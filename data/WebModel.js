function getPasswordResetHTML(token) {
  const htmlCode = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Password Reset</title>
        <style>
          h1 {
            font-size: 24px;
            font-weight: bold;
            text-align: center;
          }
          a {
            display: block;
  margin: 0 auto;
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  text-align: center;
  text-decoration: none; 
  border-radius: 4px;
  font-size: 16px;
          }
          p {
            font-size: 16px;
            text-align: center;
            margin-top: 20px;
            margin-bottom: 40px;
          }
        </style>
      </head>
      <body>
        <h1>Password Reset</h1>
        <p>To reset your password, click the link below:</p>
        
        <a href="http://localhost:4000/reset_password/${token}" target="_blank">Reset Password</a>
      </body>
    </html>
  `;
  return htmlCode;
}

module.exports = getPasswordResetHTML;
