const router = require('express').Router()
const Prod_category = require('../Model/Prod_category')
const { verifyTokenAndAdmin } = require('./verifyToken')


router.get('/', async (req, res)=> {
    try {
        const categories = await Prod_category.find()
        res.status(200).json(categories)
    } catch (error) {
        console.log(error)
    }

}) 

router.get('/:id', async (req, res)=> {
    try {
        const Prod_category = await Prod_category.findById(req.params.id)
        res.status(200).json(Prod_category)
    } catch (error) {
        console.log(error)
    }

})

router.post('/', async (req, res)=> {
    try {
        const categoryData = new Prod_category(req.body)
        await categoryData.save()
        res.status(200).json(categoryData)
    } catch (error) {
        console.log(error)
    }
})

router.put('/:id', verifyTokenAndAdmin, async (req, res)=> {
    try {
        const category = await findByIdAndUpdate(req.params.id, {   
            $set: req.body
        }, { new: true })
        res.status(200).json(category)
    } catch (error) {
        console.log(error)
    }
})

router.delete('/:id', async (req, res)=> {
    try {
        await Prod_category.findByIdAndDelete(req.params.id)
        res.status(200).json('Prod_category has been deleted!')
    } catch (error) {
        console.log(error)
    }
})
 
module.exports = router