const router = require('express').Router()
const Customer = require('../Model/Customer')
const { verifyTokenAndAdmin, verifyTokenAndAuthorization } = require('./verifyToken')


router.post('/', async (req, res)=> {
    try {
        const CustomerData = new Oder(req.body)
        await CustomerData.save()
        res.status(200).json(CustomerData)
    } catch (error) {
        res.status(500).json(error)
    }
})

router.get('/:id', async (req, res)=> {
    try {
        const customer = new Customer.findById(req.params.id)
        res.status(200).json(customer)
    } catch (error) {
        res.status(500).json(error)
    }
})

router.get('/', async (req, res) => {
    const page = req.query.p || 0
    const userPerPage = 10
    let customers;
    let totalUsers;

    try{
        if(req.query.q) {
            customers = await Customer
            .find({email: req.query.q})
            .skip(page * userPerPage)
            .limit(userPerPage)

            totalUsers = customers.length

            res.status(200).json({customers, totalUsers})
            return
        }

        customers = await Customer
            .find()
            .skip(page * userPerPage)
            .limit(userPerPage)

        totalUsers = await Customer.countDocuments() 

        res.status(200).json({customers, totalUsers})
    } catch (error) {
        res.status(500).json(error) 
    } 
})


router.put('/:id', async (req, res) => {
    const { id } = req.params

    try {
        const updatedCustomer = await Customer.findByIdAndUpdate(id, {
            $set: req.body
        }, { new: true })
        res.status(200).json(updatedCustomer)
    } catch (error) {
        res.status(500).json(error)
    }
 
})


router.delete('/:id', async (req, res) => {
    const { id } = req.params

    try {
        await Customer.findByIdAndDelete(id)
        res.status(200).json("Customer successfully deleted!")
    } catch (error) {
        res.status(500).json(error)
    }
})



module.exports = router
