const router = require('express').Router()
const Delivery = require('../Model/Delivery')
const { verifyTokenAndAdmin, verifyToken } = require('./verifyToken')


router.get('/', verifyTokenAndAdmin, async (req, res)=> {
    try {
        const deliviries = await Delivery.find()
        res.status(200).json(deliviries)
    } catch (error) {
        console.log(error)
    }

})

router.get('/:id', verifyTokenAndAdmin, async (req, res)=> {
    try {
        const deliveryBoy = await Delivery.findById(req.params.id)
        res.status(200).json(deliveryBoy)
    } catch (error) {
        console.log(error)
    }

})

router.post('/', verifyTokenAndAdmin, async (req, res)=> {
    try {
        const deliveryBoyData = new Cart(req.body)
        await deliveryBoyData.save()
        res.status(200).json(deliveryBoyData)
    } catch (error) {
        console.log(error)
    }
})

router.put('/:id', verifyTokenAndAdmin, async (req, res)=> {
    try {
        const updatedDeliveryBoy = await findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true })
        res.status(200).json(updatedDeliveryBoy)
    } catch (error) {
        console.log(error)
    }
})

router.delete('/:id', verifyTokenAndAdmin, async (req, res)=> {
    try {
        await findByIdAndDelete(req.params.id)
        res.status(200).json('delivery boy has been deleted!')
    } catch (error) {
        console.log(error)
    }
})

module.exports = router