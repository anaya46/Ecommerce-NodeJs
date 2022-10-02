const express = require('express');

//Middlewares
const { protectSession } = require('../middlewares/auth.middlewares');

// Controllers
const {
    createCart,

} = require('../controllers/carts.controller');

const cartsRouter = express.Router();

cartsRouter.use(protectSession);
cartsRouter.post('/add-product', createCart);



module.exports = { cartsRouter };

