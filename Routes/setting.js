const Setting = require('../Model/Setting')
const { verifyTokenAndAdmin } = require('./verifyToken')

const router = require('express').Router()


router.get('/', async (req, res)=> {
    try {
        const setting = await Setting.findOne({type: 'admin'})  
        res.status(200).json(setting)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})

router.put('/', async (req, res)=> {
    try {
        const updatedSetting = await Setting.findOneAndUpdate({type: 'admin'}, {
            $set: req.body
        }, { upsert: true })

        res.status(200).json(updatedSetting)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})

module.exports = router