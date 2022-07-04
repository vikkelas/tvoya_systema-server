const {Subscription, User} = require('../models/models');
const ApiError = require('../error/ApiError');
class SubscriptionController {
    async add(req, res, next){
        try {
            const{name, description, price} = req.body;
            const subscription = await Subscription.create({name, description, price});
            return res.json(subscription);
        } catch (e){
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res){
        const subscriptions = await  Subscription.findAll()
        return res.json(subscriptions)
    }

    async change(req, res, next){
        try{
            const {id, name, description, price} = req.body;
            const subscription = await Subscription.findOne({
                where: {id},
            })
            await subscription.set({name, description, price});
            await subscription.save();
            return res.json(subscription)
        }
        catch (e){
            next(ApiError.badRequest(e.message))
        }
    }

    async delete(req, res, next){
        const {id} = req.params;
        const subscriptionDelete = await User.findOne({
            where: {id}
        })
        if(!subscriptionDelete){
            return next(ApiError.badRequest('Такой подписки не существует'))
        }
        await Subscription.destroy({
            where:{
                id
            }
        });
        return res.json('Подписка успешно удалена');
    }
}

module.exports = new SubscriptionController();
