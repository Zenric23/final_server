// require('./scheduler')
const express = require("express");
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const app = express()
const cookieParser = require('cookie-parser') 

dotenv.config()
  
const categoryRoutes = require('./Routes/prod_category')
const productRoutes = require('./Routes/product')
const cartRoutes = require('./Routes/cart')
const custRoutes = require('./Routes/customer')
const authRoutes = require('./Routes/auth')
const orderRoutes = require('./Routes/order')
const discountRoutes = require('./Routes/discount')
const adminRoutes = require('./Routes/admin')
const paymentRoutes = require('./j_payment')
const reportRoutes = require('./Routes/report')
const emailSenderRoutes = require('./Routes/emailSender');
const landingPageRoutes = require('./Routes/landingPage')
const notificationRoutes = require('./Routes/notif')
const formData = require('express-form-data');
const settingRoutes = require('./Routes/setting')


// mongoose.connect('mongodb://localhost:27017/King_Canis', {useNewUrlParser: true, useUnifiedTopology: true})
//     .then(()=> console.log("connected to database!"))
//     .catch((err)=> console.log(err))

mongoose.connect(process.env.MONGODB_URL)
.then(()=> console.log("connected to database!"))
.catch((err)=> console.log(err))

// app.use(cors({
//     credentials: true, 
//     origin: ['https://admin.kingcanis.com', 'https://kingcanis.com']
// }))

app.use(cors())

app.use(express.json()) 
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser())  
app.use(formData.parse());      
 
app.use('/auth', authRoutes)  
app.use('/category', categoryRoutes)    
app.use('/collection', productRoutes) 
app.use('/cart', cartRoutes) 
app.use('/customer', custRoutes)
app.use('/admin', adminRoutes)  
app.use('/order', orderRoutes)
app.use('/discount', discountRoutes)
app.use('/checkout', paymentRoutes) 
app.use('/report', reportRoutes)
app.use('/mail', emailSenderRoutes)
app.use('/landing', landingPageRoutes)
app.use('/notif', notificationRoutes)
app.use('/setting', settingRoutes)


app.listen(process.env.PORT || 5000, ()=> { 
    console.log("server is running to port 5000") 
})




