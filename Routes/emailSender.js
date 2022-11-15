const router = require('express').Router()
const nodemailer = require('nodemailer')


router.post('/send-mail', async (req, res)=> {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'kingcanis14@gmail.com',
                pass: process.env.GOOGLE_EMAIL_PASS
            }
        })

        const mailOptions = {
            from: "Admin 🐶🐱, <kingcanis14@gmail.com>",
            to: req.body.receiver,
            subject: 'Order Cancellation',
            html: `
                <div>
                    <img 
                        src='https://scontent.fdvo2-2.fna.fbcdn.net/v/t39.30808-6/277556957_876758343723995_5846706801367138099_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=09cbfe&_nc_eui2=AeGXTe65l8PLCairC6iCHx6BM0kfeyMk9a8zSR97IyT1r_p_7uRFrM4AI9sYrywUM2qKOJkS9vEn84RVdp9pbDxi&_nc_ohc=zP5hKH6SK9oAX8QP8cZ&_nc_ht=scontent.fdvo2-2.fna&oh=00_AT9SZ826pCmTrIQekw9Ho9i0jl-aAAt1ypjhQq50cai31Q&oe=63589DAF'
                        style="height: 400px; object-fit: cover; border: 2px solide black"
                     />
                    <p style="margin-top: 20px; font-size: 17px; font-weight: 500;">
                        ${req.body.message}
                    </p>
                </div>`
        }

        const info = await transporter.sendMail(mailOptions)

        res.status(200).json(info)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})

module.exports = router