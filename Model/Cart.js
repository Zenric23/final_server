var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cartSchema = new Schema({
  customer_id: {
    type: String,
    required: true,
    unique: true
  },
  cartQty: {
    type: Number,
    required: true,
    default: 0
  },
  total: {
    type: Number,
    required: true, 
    default: 0
  },
  products: [{
    product_id: {
      type: Schema.Types.ObjectId,
      ref: 'Product', 
    },
    size : {
      type: String,
    },
    qty: {
      type: Number,
    },
    price: {
      type: Number
    }
  }]
}, { timestamps: true });



// prod.id, prod.qty, prod.size, prod.size
cartSchema.methods.addProduct = async function(productData) {
  const isExisting = this.products.findIndex(prod=> 
    prod.product_id.toString() === productData.product_id
  ) > -1
  && this.products.some(prod=> 
    prod.product_id.toString() === productData.product_id &&
    prod.size === productData.size
  )

  if(isExisting) {

    const prodIndex = this.products.findIndex(prod=> 
      prod.product_id.toString() === productData.product_id
        && prod.size === productData.size
    )
    this.products[prodIndex].qty += productData.qty
  } else {

    this.products.push({ 
      product_id: productData.product_id, 
      qty: productData.qty,
      size: productData.size,
      price: productData.price
    })
  }

  this.cartQty = this.products.length
  this.total += (productData.price * productData.qty)

  return await this.save()
}


//prod.id, prod.price, size
cartSchema.methods.removeProduct = async function(productData) {
  const productIndex = this.products.findIndex(prod=> 
    prod.product_id.toString() === productData.product_id &&
    prod.size === productData.size
  )

  if(productIndex >= 0) {
    const newArr = this.products.splice(productIndex, 1)
 
    const selectedProduct = newArr.find(prod=> 
      prod.product_id.toString() === productData.product_id &&
      prod.size === productData.size
    )
    
    if(selectedProduct) {
      this.total -= (Number(selectedProduct.qty) * Number(productData.price))
      this.cartQty--
      
      return await this.save()
    }
  }
}


cartSchema.methods.updateQty = async function(payload) {
  const productIndex = this.products.findIndex(prod=> 
    prod.product_id.toString() === payload.product_id
    && prod.size === payload.size
  )

  if(productIndex < 0) return

  if(payload.actionType === 'dec') {

    this.products[productIndex].qty--
    this.total -= payload.price 

    if(this.products[productIndex].qty === 0) {
      this.products.splice(
        this.products.findIndex(prod=> 
          prod.product_id.toString() === payload.product_id &&
          prod.size === payload.size
        ),
        1
      )
      this.cartQty -=1
    }
    
  } else {

    this.products[productIndex].qty++
    this.total += payload.price 
  }
 
  return await this.save()
}


module.exports = mongoose.model("Cart", cartSchema)