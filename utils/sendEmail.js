const nodemailer = require("nodemailer");

const sendVerificationEmail = async (to, verificationLink) => {
    const transporter = nodemailer.createTransport({
        service: "gmail", 
        auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS, 
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: "Verify Your Email",
        html: `<p>Click the link below to verify your email:</p>
               <a href="${verificationLink}">${verificationLink}</a>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Verification email sent successfully");
    } catch (error) {
        console.error("Error sending verification email:", error);
    }
};

module.exports = sendVerificationEmail;