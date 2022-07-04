const mailer = require('nodemailer');
module.exports = sendMail = async (emailUser, key)=>{
   try{
       const transporter = mailer.createTransport({
           service: 'gmail',
           auth: {
               user: process.env.MAILER_USER,
               pass: process.env.MAILER_PASSWORD,
           },
       })
       await transporter.sendMail({
           from: '"Твоя Система" <bass89@mail.ru>',
           to: `${emailUser}`,
           subject: 'Код подтверждения',
           text: `${key}`
       })
       return true;
   } catch (e){
       console.log(e)
       return false
   }
}
