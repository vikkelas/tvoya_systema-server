require('dotenv').config();
const express = require('express');
const sequelize = require('./db');
const models = require('./models/models');
const cors = require('cors');
const bodyParser = require('body-parser');
const formData = require('express-form-data');
const router = require('./routes/index');
const errorHandler = require('./middleware/ErrorHandleMiddleware');

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(formData.parse());
app.use('/api', router);

// последний middleware обработка ошибок
app.use(errorHandler);

const start = async () =>{
    try{
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT, ()=>console.log(`Start server done on port ${PORT}`));
    }catch (e){
        console.log(e);
    }
}

start();


