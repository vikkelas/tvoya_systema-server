const sequelize = require('../db');
const {DataTypes} = require('sequelize');

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: false, required: true},
    email: {type: DataTypes.STRING, unique: true, required: true},
    password: {type: DataTypes.STRING, unique: false, required: true},
    confirmation_code: {type: DataTypes.INTEGER, required:true},
    status: {type: DataTypes.BOOLEAN, defaultValue: false, required: true},
    role: {type: DataTypes.STRING, defaultValue: "USER"},
})

const Basket = sequelize.define('basket', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const BasketSubscription = sequelize.define('basket_subscription', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    subscriptionId: {type: DataTypes.INTEGER},
    status: {type: DataTypes.BOOLEAN, defaultValue: false}
})

const Subscription = sequelize.define('subscription', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
    description: {type: DataTypes.STRING, allowNull: false},
    price: {type: DataTypes.INTEGER, required: true, allowNull: false},
})

User.hasOne(Basket);
Basket.belongsTo(User);

Basket.hasMany(BasketSubscription);
BasketSubscription.belongsTo(Basket);

BasketSubscription.hasOne(Subscription);
Subscription.belongsTo(BasketSubscription);

module.exports = {
    User, Basket, BasketSubscription, Subscription
}
