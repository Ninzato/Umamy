const express = require("express");
const app = express();
const port = 3000;
const router = require("./routes");
const nodeMailer = require("nodemailer");
require('dotenv').config();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(router);

app.listen(port, () => console.log(`Listening to port ${port}`));

// async function sendWelcomeEmail(){
//     try{
//         const transporter = nodeMailer.createTransport({
//             host: 'smtp.office365.com',
//             port: 587,
//             secure: false, // Use true if you are using port 465            
//             auth: {
//               user: process.env.EMAIL_USER,
//               pass: process.env.EMAIL_PASSWORD
//             }
//           });
    
//         const info = await transporter.sendMail({
//             from: 'UMAMY <ecaoliviaaa@outlook.com>',
//             to: 'ecaoliviaaa@gmail.com',
//             subject: 'testing 123',
//             html: `<h1>Hello welcome to UMAMY! Hopefully you'll enjoy learing here!</h1>`,
//         });
//         console.log(info);
    
//     } catch (err){
//         console.log(err.message);
//     }
// }



// sendEmail();
