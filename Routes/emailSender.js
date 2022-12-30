const router = require('express').Router()
const nodemailer = require('nodemailer')


router.post('/send-mail', async (req, res)=> {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "kingcanis14@gmail.com",
                pass: process.env.GOOGLE_EMAIL_PASS
            }
        })

        const mailOptions = {
            from: req.body.senderEmail,
            to: req.body.receiver,
            subject: `Message from ${req.body.senderEmail} your Dev portfolio!.`,
            text: req.body.message
            // html: `
            //     <div>
            //         <p style="margin-top: 20px; font-size: 17px; font-weight: 500;">
            //             ${req.body.message}
            //         </p>
            //     </div>`
        }

        const info = await transporter.sendMail(mailOptions)

        res.status(200).json(info)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})

module.exports = router