import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config();

class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        }, function (error, info) {
            if (error) {
                console.log("Ошибка такая: ", error)
            } else {
                console.log('email sent:' + info.response)
            }
        })
    }

    async sendActivationMail(to, link) {
        
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: "Активация аккаунта" + process.env.API_URL,
            text: "",
            html:
                `
                    <div>
                        <h1>Для активации перейдите по ссылке</h1>
                        <a href="${link}">${link}</a>
                    </div>
                `
        })
    }
}

export default new MailService()