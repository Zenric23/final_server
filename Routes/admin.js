const router = require('express').Router()
const Admin = require('../Model/Admin')
const bcrypt = require('bcrypt')

router.post('/', async (req, res)=> {
    try {
        const AdminData = new Admin(req.body)
        await AdminData.save()
        res.status(200).json(AdminData)
    } catch (error) {
        res.status(500).json(error)
    }
})

router.get('/:id', async (req, res) => {
    try{
        const admin = await Admin.findById(req.params.id)
        res.status(200).json(admin)
    } catch (error) {
        res.status(200).json(error) 
    }
})


router.put('/:id', async (req, res) => {
    const { id } = req.params

    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPass = await bcrypt.hash(req.body.pass, salt)
        const updatedAdmin = await Admin.findByIdAndUpdate(id, {
            $set: {
                ...req.body,
                pass: hashedPass
            }
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