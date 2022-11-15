const router = require('express').Router()
const Discount = require('../Model/Discount')
const { verifyTokenAndAdmin } = require('./verifyToken')


router.get('/', async (req, res)=> {
    try {
        const Discounts = await Discount.find()
        res.status(200).json(Discounts)
    } catch (error) {
        console.log(error)
    }

})

router.post('/', async (req, res)=> {
    try {
        const DiscountData = new Discount(req.body)
        await DiscountData.save()
        res.status(200).json(DiscountData)
    } catch (error) {
        console.log(error)
    }
})

router.put('/:id', async (req, res)=> {
    try {
        const Discount = await findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true })
        res.status(200).json(Discount)
    } catch (error) {
        console.log(error)
    }
})

router.delete('/:id', async (req, res)=> {
    try {
        await findByIdAndDelete(req.params.id)
        res.status(200).json('Discount has been deleted!')
    } catch (error) {
        console.log(error)
    }
})

module.exports = router