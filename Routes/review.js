const router = require('express').Router()
const Review = require('../Model/Review')
const { verifyTokenAndAuthorization } = require('./verifyToken')


router.get('/:id', async (req, res)=> {
    try {
        const reviews = await Review.find({ product_id: req.params.id })
        res.status(200).json(reviews)
    } catch (error) {
        console.log(error)
    }

})

router.post('/', verifyTokenAndAuthorization, async (req, res)=> {
    try {
        const ReviewData = new Cart(req.body)
        await ReviewData.save()
        res.status(200).json(ReviewData)
    } catch (error) {
        console.log(error)
    }
})

router.put('/:id', verifyTokenAndAuthorization, async (req, res)=> {
    try {
        const review = await findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true })
        res.status(200).json(review)
    } catch (error) {
        console.log(error)
    }
})

router.delete('/:id', verifyTokenAndAuthorization,  async (req, res)=> {
    try {
        await findByIdAndDelete(req.params.id)
        res.status(200).json('Review has been deleted!')
    } catch (error) {
        console.log(error)
    }
})

module.exports = router