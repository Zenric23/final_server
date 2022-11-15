const router = require('express').Router()
const Cart = require('../Model/Cart')
const {verifyTokenAndAuthorization } = require('./verifyToken')


// ADD PRODUCT TO CART
router.put('/add/:id', async (req, res)=> {
    // { product_id, price, qty, size }
    try {
        const cartData = await Cart.findOne({customer_id: req.params.id})
        const addedProduct = await cartData.addProduct(req.body)
        res.status(200).json(addedProduct)
    } catch (error) {
        console.log(error)  
    } 
})

   
// UPDATE CART 
router.put('/update/:id', async (req, res)=> {
    const { action } = req.query
    let updatedCart = {} 
 
    try {
        const cartData = await Cart.findOne({customer_id: req.params.id})

        if(action === 'delete') {
            // { product_id, price, size }
            updatedCart = await cartData.removeProduct(req.body)
            updatedCart 
                ? res.status(200).json(updatedCart) 
                : res.status(200).json('product has not been deleted!')
        } else {
            // { actionType, product_id, price, size } 
            updatedCart = await cartData.updateQty(req.body)
            updatedCart 
                ? res.status(200).json(updatedCart)   
                : res.status(200).json('product quantity has not been updated !')
        }  
      
    } catch (error) {  
        console.log(error)
    }
})


// GET CART
router.get('/:id', async (req, res)=> {
    try {
        const cart = await Cart.findOne({ customer_id: req.params.id })
            .populate({
                path: 'products',
                populate: {
                    path: 'product_id',
                    select: { images: 1, title: 1, price: 1}
                }
            })
        res.status(200).json(cart)
    } catch (error) {
        console.log(error)
    }
})


module.exports = router