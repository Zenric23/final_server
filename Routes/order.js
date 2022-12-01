const router = require('express').Router()
const Order = require('../Model/Order')
const Product = require('../Model/Product')
const mongoose = require('mongoose');
const { verifyTokenAndAdmin, verifyTokenAndAuthorization } = require('./verifyToken');
const InvoiceController = require('../Controllers/paymentController');
const Notification = require('../Model/Notification');
const io = require('../util/socketUtil')


// GET SPECIFIC PRODUCT LAST 3 MONTHS REVANUE
router.get("/income/:id", async (req, res)=> {
    
    const date = new Date()
    const lastMonth = new Date(date.setMonth(date.getMonth()-1))
    const prevMonth = new Date(date.setMonth(lastMonth.getMonth()-1))

    const productId = mongoose.Types.ObjectId(req.params.id)

    try {
        const income = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: prevMonth },
                    products: { $elemMatch: { productId } }
                }
            },
            {
                $unwind: { path: "$products" }
            },
            {
                $match: {
                    "products.product_id": productId
                }
            },
            {
                $project: {
                    month: { $month: "$createdAt" },
                    qty: "$products.qty"
                }
            },
            
            {
                $group: {
                    _id: "$month",
                    total: {
                        $sum: "$qty"
                    }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ])
        res.status(200).json(income)  
    } catch (error) {     
        res.status(500).json(error)
        console.log(error)
    }
}) 

router.get('/', async (req, res)=> {
    const page = req.query.p || 0 
    const orderPerPage = 10

    try {
     
        const orders = await Order.find({payment_method: { $ne: '' }}).sort({createdAt: -1})
                .skip(page * orderPerPage)
                .limit(orderPerPage)

        const total = await Order.countDocuments()
        
        res.status(200).json({orders, total})
    } catch (error) {
        console.log(error) 
    }
})

router.get('/latest',  async (req, res)=> {
    try {
        const orders = await Order.find().sort({createdAt: -1}).limit(8)
        res.status(200).json(orders)
    } catch (error) {
        console.log(error)
    }
})

router.get('/:id', async (req, res)=> {
    try {
        const order = await Order
            .findById(req.params.id)
            .populate("products.product_id", {title: 1, images: 1, sizes: 1})

        res.status(200).json(order)
    } catch (error) {
        console.log(error)  
    }
})

router.get('/user-orders/:id',  async (req, res)=> {
    try {
        const orders = await Order
            .find({customer_id: req.params.id})
            .populate('products.product_id', {title: 1, images: 1})
            
        res.status(200).json(orders)
    } catch (error) {
        console.log(error)  
    }
}) 

router.get('/invoice/:id', async (req, res)=> {
    const invoiceController = new InvoiceController()
    try {
        const invoice = await invoiceController.getInvoice(req.params.id)
        res.status(200).json(invoice.data)
    } catch (error) {
        console.log(error)
    }   
})

router.put('/:id', async (req, res)=> {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true })
        res.status(200).json(order) 
    } catch (error) {
        console.log(error)
    }   
})

router.delete('/:id', async (req, res)=> {
    try {
        await Order.findByIdAndDelete(req.params.id)
        res.status(200).json('Order has been deleted!')
    } catch (error) {
        console.log(error)
    }
})



const totalPayment = (items, otherFees) => {
    let total = 0
    items.forEach(prod=> {
      total += (prod.qty * prod.price)
    })
    return total + otherFees
  }

router.post('/', async (req, res)=> {

    const {
        products,
        shipping_fee,
        ...rest
    } = req.body

    const total = totalPayment(req.body.products, req.body.shipping_fee)

    const items = req.body.products.map(prod=> {
        return {
            product_id: prod.product_id,
            qty: prod.qty,
            size: prod.size,
            price: prod.price
        }
    })
    
    try {
        const newOrder = new Order({
            ...rest,
            products: items,
            totalPayment: total
        })

        await newOrder.save()

        const order = await Order.findById(newOrder._id)

        if(!order) {
            res.status(404).json('Order is not found')
            return
        }

        const newNotif = new Notification({
            name: order.customer_name,
            payment_channel: order.payment_method,
            order_id: order._id
        }) 

        await newNotif.save()

        io.emit('notification', newNotif)
        res.status(200).json(order)
        

    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})

module.exports = router