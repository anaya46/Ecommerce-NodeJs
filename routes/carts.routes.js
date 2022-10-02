const express = require('express');

//Middlewares
const { protectSession } = require('../middlewares/auth.middlewares');

// Controllers
const {
    createCart,
    getAllCarts,


} = require('../controllers/carts.controller');
const { checkQuantityProduct,
    productExists,
} = require('../middlewares/carts.middlewares');

const cartsRouter = express.Router();

cartsRouter.use(protectSession);
cartsRouter.post('/add-product', productExists, checkQuantityProduct, createCart);
cartsRouter.get('/', getAllCarts);



module.exports = { cartsRouter };

