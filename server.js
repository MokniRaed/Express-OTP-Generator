const express = require("express")

const nodemailer = require("nodemailer");
const fs = require('fs');
const path = require('path');

const users = require("./data/users")
//  -------- In Cas we are sending a dynamic html -----------
const getPasswordResetHTML = require('./data/WebModel');
const html = getPasswordResetHTML("tokentest");
//  -------- -----------
/* In cas if we are sending a static html
const htmlFilePath = path.join(__dirname,'/data/file.html');
const htmlContent = fs.readFileSync(htmlFilePath, 'utf-8');
*/

const server = express();
const port = 4000
server.use(express.json())

server.get("/getusers",(req,res)=>{
    res.send(users)
})

server.get("/reset_password/:token",(req,res)=>{
    try {
        const {token} = req.params

        res.status(200).send(`Your token :${token}`)
    } catch (err) {

        console.log(err);
        res.status(500).send('Something went wrong')
    }
})
//Sending the reset email 
server.post("/sendMail",(req,res)=>{

    try {
        const {to,subject} = req.body
    // Setting the sender informations
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'rooda1998@gmail.com',
          pass: 'emnermclfjucovqu'
        }
      });
      //Setting the mail options
      const mailOptions = {
        to: to,
        subject: subject,
        /*text: text,*/ //we can add a text instead of using a html 
        html: html
      };

      // Mail sedding Action
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
          res.status(500).send("Server error ⚠️")
        } else {
          console.log('Email sent: ' + info.response);
          res.status(200).send("Mail Send Successfuly ✅")
        }
      });
    } catch (error) {
        console.log(error);
        res.status(500).send('something went wrong ⚠️')
    }
    
})

/*-------------------------------------------------------------------*/

// reset password with OTP code
server.post('/reset-password', (req, res) => {
    const { email, otp, password } = req.body;
  
    connection.query('SELECT * FROM otp WHERE email = ? AND code = ? AND expiry > NOW()', [email, otp], (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send('Internal server error');
      } else if (results.length === 0) {
        res.status(400).send('Invalid OTP code');
      } else {
        connection.query('UPDATE users SET password = ? WHERE email = ?', [password, email], (error, results) => {
          if (error) {
            console.log(error);
            res.status(500).send('Internal server error');
          } else {
            connection.query('DELETE FROM otp WHERE email = ?', [email], (error, results) => {
              if (error) {
                console.log(error);
              }
            });
            res.status(200).send('Password reset successful');
          }
        });
      }
    });
  });

  // generate OTP code and store it in database
  const otpGenerator = require('otp-generator');
const { log } = require("console");
  
  // generate OTP code
function generateOTP() {
    /*const secret = crypto.randomBytes(32).toString('hex');
    const otp = crypto.createHash('sha256').update(secret).digest('hex').slice(0, 6);*/
    const otp = otpGenerator.generate(6, { lowerCaseAlphabets: false,upperCaseAlphabets: false, specialChars: false });
    return otp;
  }


server.post('/generate-otp', (req, res) => {
    const { email } = req.body;
  
    const otp = generateOTP();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // set expiry to 10 minutes from now
  
    connection.query('INSERT INTO otp SET ?', { email: email, code: otp, expiry: expiry }, (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send('Internal server error');
      } else {
        sendOTP(email, otp);
        res.status(200).send('OTP code generated and sent to email');
      }
    });
  });


/*-------------------------------------------------------------------*/


console.log(generateOTP());

server.listen(port,err =>{
    err?console.log(err):console.log(`server is running on http://localhost:${port} `);
})