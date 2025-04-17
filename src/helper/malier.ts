import nodemailer from 'nodemailer';
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";
 

export const sendEmail = async ({email, emailtyper, userId }:any) => {
 {
try { 

  const hashedToken = await bcryptjs.hash(userId.toString(), 10);


if(emailType === "VERIFY") {

  await User.findByIdAndUpdate ( userId, { verifyToken : hashedToken, verifyTokenExpiry: Date.now() + 3600000}, {new: true} )
} else if (emailType === "RESET") {

await User.findByIdAndUpdate(userId, 
  {forgotPasswordToken: hashedToken, forgotPasswordExpiry: Date.now() + 3600000}, {new: true} )

  
} 
 




    var transport = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 2525,
        auth: {
          user: "ano6p35c@mailosaur.net",// smaili
          pass: "vwNCXTusoAslpfsthIekWlOEr8fEns3l", // smailii
        },
      }); 

      const mailOptions = {
        from: 'ahmadaslam2001m@gmail.com', // sender address
        to: "email", // list of receivers
        subject : "emailType === 'VERIFY' ? " Verify your emaiil : "  reset your password", // Subject line
        
        html: '<p>click <a href="${process.env.DOMAIN} / verifyemail?token=${hashedToken}" > here </a> to $ {emailType === "VERIFY" ? "Verify your email" : " reset your password"} or copy and paste the link bellow in your browser.<br>  ${process.env.DOMAIN}/verifyemail?token=${hashedToken} </p>', // html
      }

     const mailResponse = await transport.sendMail(mailOptions)
       return mailResponse;


} catch (error:any) {

throw new Error(error.message)
    }
