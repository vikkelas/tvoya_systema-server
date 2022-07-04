const {BasketSubscription, Basket, Subscription} = require('../models/models');
const ApiError = require('../error/ApiError');

class BasketController {
    async addSubscription(req, res, next){
        const {user} = req;
        const {id} = req.params;
        const basket = await Basket.findOne({
            where: {userId: user.id}
        })

        const subscription = await Subscription.findAll({
            limit: 20,
        })
        const checkSub = subscription.findIndex(elem=>elem.dataValues.id===+id);
        if(checkSub===-1){
            return next(ApiError.badRequest('Такой подписки не существует'));
        }
        const basketSubscriptions = await BasketSubscription.findAll({
            limit: 20,
            where: {basketId: basket.id}
        })
        const checkBasket = basketSubscriptions.findIndex(elem=>elem.dataValues.subscriptionId===+id);
        if(checkBasket!==-1){
            return next(ApiError.badRequest('Такая подписка уже добавлена'));
        }

        await BasketSubscription.create({
            basketId: basket.id,
            subscriptionId: id,
        })
        return res.status(200).json({message: 'Подписка успешно добавлена'});
    }

    async requestSubscriptions(req, res){
       const {user} = req;
       const basket = await Basket.findOne({
           where: {userId: user.id}
       });
       const subscriptionsBasket = await BasketSubscription.findAll({
           limit: 50,
           where: {basketId: basket.id}
       });
       return res.status(200).json(subscriptionsBasket);
    }

    async deleteSubscription(req, res, next){
        const {id} = req.params;
        const {user} = req;
        const basket = await Basket.findOne({
            where: {userId: user.id}
        });
        const candidateDelete = await BasketSubscription.findOne({
            where:{
                id: +id,
                basketId: basket.id}
        });
        if(!candidateDelete){
            return next(ApiError.badRequest('Такой подписки не существует'));
        }
        await BasketSubscription.destroy({
            where:{
                id: +id,
                basketId: basket.id,
            }
        })
        return res.status(200).json({message: 'Подписка успешно удалена'});
    }
}

module.exports = new BasketController();
