const {body} = require('express-validator');

const schema = [
    body('name').exists({checkFalsy: true}).withMessage('Поле не должно быть пустым'),
    body('email').isEmail().normalizeEmail().withMessage('Не корректный введен адрес электронной почты'),
    body('password').isLength({min: 4}).withMessage('Пароль не должен быть менее 4 символов'),
];
module.exports = schema;
