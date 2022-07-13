const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth: {
        user:"walett95@gmail.com",
        pass:"ekojbojugklbrweo"
    }
});



module.exports = transporter;