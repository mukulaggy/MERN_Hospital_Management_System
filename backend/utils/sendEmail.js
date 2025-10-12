// backend/utils/sendEmail.js

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'aggymukul@gmail.com',
    pass: 'ibmb wtkm jaln pori',
  },
});

const sendEmail = async (to, subject, text, html) => {
  try {
    const mailOptions = {
      from: {
        name: 'E-Health',
        address: 'aggymukul@gmail.com',
      },
      to: to,
      subject: subject,
      text: text,
      html: html,
    };

    let info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Error sending email');
  }
};

export default sendEmail;
