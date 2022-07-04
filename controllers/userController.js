const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt');
const {User, Basket} = require("../models/models");
const jwtToken = require('jsonwebtoken')
const sendMail = require('../api/nodemailer')

const generateJwt = (id, email, status, role) =>{
    return jwtToken.sign(
        {id, email, status, role},
        process.env.SECRET_KEY,
        {
            expiresIn: '24h',
        }
    );
}
class UserController {
    async registration(req, res, next){
        const {email, password, name} = req.body;
        const candidateMail = await User.findOne({
            where:{email}
        })
        if(candidateMail){
            return next(ApiError.badRequest('Пользователь с таким email адресом уже существует'))
        }
        const confirmationKey = +Math.random().toString().substring(2, 6);
        const mail = await sendMail(email, confirmationKey)
        if(mail){
            const hashPassword = await bcrypt.hash(password, 5);
            const user = await User.create({email, password: hashPassword, name, confirmation_code: confirmationKey});
            await Basket.create({userId: user.id});
            const token = await generateJwt(user.id, user.email, user.status, user.role)
            return res.status(201).json({token});
        }
        if(!mail){
            return next(ApiError.internal('Ошибка на сервере'))
        }
    }

    async login(req, res, next){
        const {email ,password} = req.body;
        const user = await  User.findOne({
            where: {email}
        })
        if(!user){
            return next (ApiError.internal('Пользователь не найден'));
        }
        const comparePassword = bcrypt.compareSync(password, user.password);
        if(!comparePassword){
            return next (ApiError.internal('Неверный пароль'));
        }
        const token = await generateJwt(user.id, user.email, user.status, user.role);
        return res.json({token})
    }

    async confirmStatus (req, res, next){
        const {user, body} = req;
        const candidate = await User.findOne({
            where: {id: user.id}
        })
        if(+body.key !== candidate.confirmation_code){
            return next (ApiError.internal('Код не действителен'))
        }
        await candidate.update({status: true});
        await candidate.save();
        const token = await generateJwt(candidate.id, candidate.email, candidate.status, candidate.role);
        return res.status(200).json({token});
    }

    async newConfirmationCode (req, res, next){
        const {user} = req;
        const candidate = await User.findOne({
            where: {id: user.id}
        });
        if(candidate.status){
            return next (ApiError.badRequest('Ваша почта уже подтверждена'));
        }
        const confirmationKey = +Math.random().toString().substring(2, 6);
        const mail = await sendMail(candidate.email, confirmationKey);
        if(mail){
            await candidate.update({confirmation_code: confirmationKey});
            await candidate.save();
        }
        if(!mail){
            return next(ApiError.internal('Ошибка на сервере'))
        }
    }
}

module.exports = new UserController();
