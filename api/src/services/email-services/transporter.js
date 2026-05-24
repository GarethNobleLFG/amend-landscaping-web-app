const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.COMPANY_USER,
        pass: process.env.COMPANY_PASS 
    }
});

module.exports = { transporter };