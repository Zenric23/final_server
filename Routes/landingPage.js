const Landing_Page = require('../Model/Landing_Page')
const router = require('express').Router()
const cloudinary = require('../util/cloudinaryUtil')
const { verifyTokenAndAdmin } = require('./verifyToken')


router.post('/upload', async (req,res)=> {
   const file = req.files.file
    try {
        const cloudRes = await cloudinary.uploader.upload(file.path, {
            folder: 'ecommerce'
          })
        res.status(200).json({
            public_id: cloudRes.public_id,
            url: cloudRes.secure_url
        })
    } catch (error) {
        res.status(500).json(error)
    }
})

router.put('/edit/:id', async (req, res)=> {
    const image = req.body.prevImg
    try {
        if(image) {
            const cloudRes =  await cloudinary.uploader.destroy(image)
        }
        const updatedLanding = await Landing_Page.findByIdAndUpdate(req.params.id,{
            $set: req.body
        }, { new: true })

        res.status(200).json(updatedLanding)
    } catch (error) {
        console.log(error)
        res.status(500).json(error.message)
    }
}) 

router.get('/:id', async (req, res)=> {
    try {
        const landing = await Landing_Page.findById(req.params.id)
        res.status(200).json({aboutUS: landing.aboutUs, image: landing.image})
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})

module.exports = router