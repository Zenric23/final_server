const router = require('express').Router()
const Admin = require('../Model/Admin')


router.post('/', async (req, res)=> {
    try {
        const AdminData = new Admin(req.body)
        await AdminData.save()
        res.status(200).json(AdminData)
    } catch (error) {
        res.status(500).json(error)
    }
})

router.get('/', async (req, res) => {
    try{
        const Admin = await Admin.find()
        res.status(200).json(Admin)
    } catch (error) {
        res.status(200).json(error) 
    }
})


router.put('/:id', async (req, res) => {
    const { id } = req.params

    try {
        const updatedAdmin = await Admin.findByIdAndUpdate(id, {
            $set: req.body
        }, { new: true })
        res.status(200).json(updatedAdmin)
    } catch (error) {
        res.status(500).json(error)
    }
 
})


router.delete('/:id', async (req, res) => {
    const { id } = req.params

    try {
        await Admin.findByIdAndDelete(id)
        res.status(200).json("Admin successfully deleted!")
    } catch (error) {
        res.status(500).json(error)
    }
})



module.exports = router