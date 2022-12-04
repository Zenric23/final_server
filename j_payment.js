const router = require('express').Router()
const InvoiceController = require('./Controllers/paymentController')
var uuid = require('uuid');
const Order = require('./Model/Order');
const Notification = require('./Model/Notification');
const Cart = require('./Model/Cart');
const io = require('./util/socketUtil')


const totalPayment = (items, otherFees) => {
  let total = 0
  items.forEach(prod=> {
    total += (prod.quantity * prod.price)
  })
  return total + otherFees[0].value
}


router.post('/', async (req, res) => {
  const { items, fees } = req.body.invoice_payload
  try {
    const invoiceController = new InvoiceController()

    const invoice = await invoiceController.create({
      amount: totalPayment(items, fees),  
      external_id: uuid.v1(),
      ...req.body.invoice_payload
    })  

    const getInvoice = await invoiceController.getInvoice(invoice.data.id)

    const newOrder = new Order({
      invoice_id: getInvoice.data.external_id,
      totalPayment: getInvoice.data.amount,
      email: getInvoice.data.payer_email,
      customer_name: req.body.customer_name,
      phoneNumber: req.body.phoneNumber,
      shipping: req.body.shipping,
      products: req.body.products,
      customer_id: req.body.customer_id || '',
      payment_method: req.body.payment_method,
      shipping_fee: fees[0].value
    })
    await newOrder.save()

    res.status(200).json(getInvoice.data)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
})


router.post('/hook', async (req, res)=> {
  try {
    const isFromXendit = 
      req.headers['x-callback-token'] === process.env.CALLBACK_TOKEN

    if(!isFromXendit) {
      res.status(403).json('request is not from xendit!')
      return
    }

    const isOrderExist = await Order.findOne(
      {invoice_id: req.body.external_id}
    )

    
    if(isOrderExist) { 

      await Order.updateOne({invoice_id: req.body.external_id}, {
        payment_status: req.body.status,
        payment_method: req.body.payment_method,
        payment_channel: req.body.payment_channel
      }, {new: true})
  

      const order = await Order.findOne(
        {invoice_id: req.body.external_id}, 
        {customer_name: 1, payment_channel: 1, customer_id: 1}
      )
  
      const newNotif = new Notification({
        name: order.customer_name,
        payment_channel: order.payment_channel,
        order_id: order._id
      })
     
      newNotif.save()
      
      if(order.customer_id) {
        await Cart.findOneAndUpdate({ customer_id: order.customer_id }, {
          $set: {
            products: [],
            total: 0,
            cartQty: 0
          }
        })
      } 

      io.emit('notification', newNotif)
      console.log('payment is successful!')
      res.status(200).json('Payment is successful!')  
      return 
    }

    res.status(200).json('web hook connected!')  

  } catch (error) {
    console.log(error)   
    res.status(500).json(error)
  }  
})


module.exports = router

