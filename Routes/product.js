const router = require("express").Router();
const Order = require("../Model/Order");
const Product = require("../Model/Product");
const cloudinary = require('../util/cloudinaryUtil');


router.get("/best-seller", async (req, res) => {
  let bestSellers

  try {

    if(req.query.admin) {

      bestSellers = await Order.aggregate([
        {
          $match: {
            payment_status: "PAID",
            payment_status: {
              $ne: 'Cancelled'
            },
            isDelivered: true
          }
        },
        {
          $unwind: {
            path: "$products",
          },
        },
        {
          $group: {
            _id: "$products.product_id",
            sum: {
              $sum: "$products.qty",
            },
          },
        },
        { 
          $sort: {
            sum: -1,
          },
        },
        {
          $limit: 5,
        },
        {
          $group: {
            _id: "null",
            products: {
              $push: "$_id",
            },
          },
        },
        {
          $project: {
            _id: 0,
          },
        },
      ]);
  
    } else {

      bestSellers = await Order.aggregate([
        {
          $match: {
            payment_status: "PAID",
            payment_status: {
              $ne: 'Cancelled'
            },
            isDelivered: true
          }
        },
        {
          $unwind: {
            path: "$products",
          },
        },
        {
          $group: {
            _id: "$products.product_id",
            sum: {
              $sum: "$products.qty",
            },
          },
        },
        { 
          $sort: {
            sum: -1,
          },
        },
        {
          $limit: 8,
        },
        {
          $group: {
            _id: "null",
            products: {
              $push: "$_id",
            },
          },
        },
        {
          $project: {
            _id: 0,
          },
        },
      ]);
    }

    await Product.populate(bestSellers, {
      path: "products",
      select: {
        title: 1,
        price: 1,
        images: 1,
      },
    });

    res.status(200).json(bestSellers);

  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  } 
});

router.get('/relevant/:id', async (req, res)=> {
  try {
    const thisProd = await Product.findById(req.params.id)
    const relevantProducts = await Product.find({animalTags: { $in: [...thisProd.animalTags] }})
    res.status(200).json(relevantProducts)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
})

router.get('/search', async (req, res)=> {
  try {
    
    const searchResult = await Product.aggregate([
      {
        "$search": {
          "index": "product_search",
          "text": {
            "query": req.query.q,
            "path": {
              "wildcard": "*"
            }
          }
        } 
      },
      {
        $project: {
          title: 1,
          images: 1,
          desc: 1,
        }
      }
    ])

    res.status(200).json(searchResult)

  } catch (error) {

    console.log(error)
    res.status(500).json(error)
  }
})

router.post('/', async (req, res)=> {
  try {
    const productData = new Product(req.body)
    await productData.save()
    res.status(200).json(productData)
} catch (error) {
    res.status(500).json(error)   
    console.log(error)  
}
})


router.post("/upload-image-product", async (req, res) => {
  const images = req.files.images
  let imageRes = []
  let cloudRes;
 
  try {
     
    if(Array.isArray(images)) {
      for(let i = 0; i< images.length; i++) {
        cloudRes =  await cloudinary.uploader.upload(images[i].path, {
              folder: 'ecommerce'
            })
        imageRes.push({ 
          public_id: cloudRes.public_id, 
          url: cloudRes.secure_url
        })
      } 

    } else {
      cloudRes = await cloudinary.uploader.upload(images.path, {
            folder: 'ecommerce'
          })
          imageRes.push({
        public_id: cloudRes.public_id,
        url: cloudRes.secure_url
      })
    }
    
    res.status(200).json(imageRes);
  } catch (error) {

    res.status(500).json(error);
    console.log(error)
  }
});


router.get('/related-products/:id', async (req,res)=> {
  try {
    const product = await Product.findById(req.params.id)
    const products = await Product.find({$and:[
      {animalTags: { $in: [...product.animalTags] }},
      {_id: { $ne: req.params.id }}
    ]}).limit(4)
    res.status(200).json(products)
  } catch (error) {
    res.status(500).json(error)
  }
})


router.get("/", async (req, res) => {
  const sort = req.query.sort
  const page = req.query.p || 0
  const productPerPage = 10
  let products;
  let totalProducts
  

  try {

    if(req.query.client) {
      
       if(req.query.q) {
      products = await Product.find({title: new RegExp(req.query.q, "i")})

      totalProducts = products.length

      res.status(200).json({products, totalProducts})
      return
    }

      if(req.query.cat) {
        products = await Product
          .find({"category": req.query.cat})
          .skip(page * 32)
          .limit(32)
      } else {
        products = await Product
          .find()
          .skip(page * 32)
          .limit(32)
      }

      totalProducts = products.lengths
      Sort(products, sort)
      
      res.status(200).json({products, totalProducts});
      return
    }

    if(req.query.q) {
      products = await Product.find({title: new RegExp(req.query.q, "i")})

      totalProducts = products.length

      res.status(200).json({products, totalProducts})
      return
    }

    if(req.query.cat) {
      
      products = await Product
        .find({"category": req.query.cat}) 
        .skip(page * productPerPage)
        .limit(productPerPage)

    } else {
      products = await Product
        .find()
        .skip(page * productPerPage)
        .limit(productPerPage)
      }

      totalProducts = products.length
      
      Sort(products, sort)

      res.status(200).json({products, totalProducts});
    
  } catch (error) {
    res.status(500).json(error);
  }
});


function Sort(products, sort) {
  
  switch(sort) {
    case "priceDesc":
    products.sort((a,b)=> {

      const priceA = a.sizes.map(item=> item.price)
      const minPriceA = Number(Math.min(...priceA))

      const priceB = b.sizes.map(item=> item.price)
      const minPriceB = Number(Math.min(...priceB))

      return minPriceB - minPriceA  
    
    })
    break;
  case "priceAsc":
    products.sort((a,b)=> {
      const priceA = a.sizes.map(item=> item.price)
      const minPriceA = Number(Math.min(...priceA))

      const priceB = b.sizes.map(item=> item.price)
      const minPriceB = Number(Math.min(...priceB))

      return minPriceA - minPriceB
      
    })
    break;
  case "latest":
    products.sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt))
    break;
  case "oldest":
    products.sort((a,b)=> new Date(a.createdAt) - new Date(b.createdAt))
    break;
    default:
} 
}


router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (error) {
    console.log(error);
  }
});


router.post("/edit-images", async (req, res)=> {
  const public_id = req.body.public_id
  const image = req.files.image
  
  try {
    await cloudinary.uploader.destroy(public_id) 

    const cloudRes = await cloudinary.uploader.upload(image.path, {
      folder: 'ecommerce'
    })

    const newProd = await Product.updateOne({images: { $elemMatch: { public_id }}}, {
      $set: { 
        "images.$.public_id": cloudRes.public_id,
        "images.$.url": cloudRes.secure_url,
      }
    }, { new: true })
 
    res.status(200).json(newProd)
    
  } catch (error) {
    res.status(500).json(error)
    console.log(error)
  }
})


const generateProdPrice = async (product_id) => {
  const product = await Product.findById(product_id)
  const price = product.sizes.map(size=> size.price)
  const maxPrice = Math.max(...price)
  const minPrice = Math.min(...price)

  if(price.length  === 1) {
    await Product.findByIdAndUpdate(product_id, {
      price: `${maxPrice}`
    })  
    return
  }
  await Product.findByIdAndUpdate(product_id, {
    price: `${minPrice} ~ ${maxPrice}`
  })
}


router.put("/edit-sizes/:id", async (req, res)=> {
  const { size, price, inStock } = req.body

  try {

    if(req.body.add) {
      await Product.updateOne({_id: req.params.id}, {
        $push: {
          sizes: {
            size, price
          }
        }
      }, {new: true})

      await generateProdPrice(req.params.id)

      res.status(200).json('size added successfully!')
      return
    }
    
    if(req.body.delete) {
      await Product.updateOne({sizes: { $elemMatch: { _id: req.params.id }}}, {
      $pull: {
        sizes: {  
           _id: req.params.id
        }  
      }
      }, {new: true})
      await generateProdPrice(req.body.product_id)

      res.status(200).json('size delete successfully!')
      return
    }

    await Product.updateOne({sizes: { $elemMatch: { _id: req.params.id }}}, {
      $set: { 
        "sizes.$.price": price,
        "sizes.$.size": size,
        "sizes.$.inStock": inStock,
      }
    }, { new: true })
    await generateProdPrice(req.body.product_id)

    res.status(200).json('product size is updated successfully!')

  } catch (error) {
    res.status(500).json(error)
    console.log(error)
  } 
})


router.put("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json(error);
  }
});


router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await Product.findByIdAndDelete(id);
    res.status(200).json("product successfully deleted!");
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
