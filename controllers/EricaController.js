const nodeMailer = require("nodemailer");
require('dotenv').config();

class EricaController {
    static async sendWelcomeEmail(userEmail){
        try{
            const transporter = nodeMailer.createTransport({
                host: 'smtp.office365.com',
                port: 587,
                secure: false,          
                auth: {
                  user: process.env.EMAIL_USER,
                  pass: process.env.EMAIL_PASSWORD
                }
              });
        
            const info = await transporter.sendMail({
                from: `UMAMY <${process.env.EMAIL_USER}>`,
                to: `${userEmail}`,
                subject: 'Welcome to UMAMY!',
                html: `<h1>Hello welcome to UMAMY! Hopefully you'll enjoy learning here!</h1>`,
            });
            console.log(info);
        
        } catch (err){
            console.log(err.message);
        }
    }

    static async sendCongratulationsEmail(userEmail){
        try{
            const transporter = nodeMailer.createTransport({
                host: 'smtp.office365.com',
                port: 587,
                secure: false,          
                auth: {
                  user: process.env.EMAIL_USER,
                  pass: process.env.EMAIL_PASSWORD
                }
              });
        
            const info = await transporter.sendMail({
                from: `UMAMY <${process.env.EMAIL_USER}>`,
                to: `${userEmail}`,
                subject: 'Congratulations on completing the course!',
                html: `<h1>Hope you'll excel with your new skill and knowledge!</h1>
                <h2>Will definitely wait for you to enroll our other interesting courses soon!</h2>`,
            });
            console.log(info);
        
        } catch (err){
            console.log(err.message);
        }
    }
}

module.exports = EricaController;
