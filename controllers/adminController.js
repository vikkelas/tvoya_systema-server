const {User, Basket, BasketSubscription} =require('../models/models');
const bcrypt = require("bcrypt");
const jwtToken = require("jsonwebtoken");
const ApiError = require("../error/ApiError");

const generateJwt = (id, email, status, role) =>{
    return jwtToken.sign(
        {id, email, status, role},
        process.env.SECRET_KEY,
        {
            expiresIn: '24h',
        }
    );
}

class AdminController {
    async registration(req, res){
        const {login, password} = req.body;
        if(login!== process.env.ADMIN_LOGIN || password!==process.env.ADMIN_KEY){
            return res.status(403).json({message: 'Доступ запрещен'});
        }
        const user = await User.findOne({
            where:{name: login}
        })
        if(!user){
           const hashPassword = await bcrypt.hash(password, 5);
           const admin = await User.create({
               name: login,
               email:'balbsejr@gmail.com',
               password: hashPassword,
               status: true,
               role: 'ADMIN',
               confirmation_code: 1111
           });
           const token = await generateJwt(admin.id, admin.email, admin.status, admin.role);
           return res.status(200).json({token});
        }
        const token = await generateJwt(user.id, user.email, user.status, user.role);
        return res.status(200).json({token});
    }
    async getUsers(req, res){
        const users = await User.findAll({
            limit:100,
        })
        return res.status(200).json({users})
    }
    async getUserSubscriptions(req, res, next){
        const {user} = req.query;
        const basketUser = await Basket.findOne({
            where: {userId: user}
        });
        if(!basketUser){
            return next(ApiError.badRequest('Такого пользоватля не существуе'));
        }
        const subscriptionsUser = await BasketSubscription.findAll({
            limit: 50,
            where: {basketId: basketUser.id}
        })
        return res.status(200).json({subscriptionsUser});
    }
    async changeStatusSub(req, res, next){
        const {subId} = req.body
        const sub = await BasketSubscription.findOne({
            where:{id:subId}
        })
        if(!sub){
           return next(ApiError.badRequest('Такой подписки не существует'));
        }
        await sub.update({status: !sub.status})
        await sub.save();
        return res.status(201).json({sub})
    }
    async deleteUser(req, res, next){
        const {id} = req.params;
        const userDelete = await User.findOne({
            where: {id}
        })
        const userBasket = await Basket.findOne({
            where: {userId: id}
        })
        if(!userDelete || !userBasket){
            return next(ApiError.badRequest('Такого пользователя не существуе'))
        }
        await BasketSubscription.destroy({
            where: {basketId: userBasket.id}
        });
        await Basket.destroy({
            where:{
                id: userBasket.id
            }
        });
        await User.destroy({
            where:{
                id
            }
        });
        return res.status(200).json({message:'Пользователь успешно удален'});
    }
}

module.exports = new AdminController();
