const nodemailer = require('nodemailer');
module.exports = async function (job) {
    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp',
            secure: true,
            auth: {
                user: process.env.USER_EMAIL,
                pass: process.env.USER_PASSWORD,
            },
        });
        for (let i = 0; i < emails.length; i++) {
            const mailOptions = {
                from: `"Books Care" <${process.env.FROM}>`,
                to: emails[i].email,
                subject: job.data.subject,
                text: job.data.text,
                html: job.data.html,
            };
            await transporter.sendMail(mailOptions);
        }
    } catch (e) {
        console.log(e)
    }
};
