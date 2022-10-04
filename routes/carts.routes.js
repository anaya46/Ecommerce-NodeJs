const express = require('express');

//Middlewares
const { protectSession, protectCart } = require('../middlewares/auth.middlewares');
const { cartExists } = require('../middlewares/carts.middlewares');

// Controllers
const {
    addProduct,
    getAllCarts,
    updateCart,


} = require('../controllers/carts.controller');


const cartsRouter = express.Router();

cartsRouter.use(protectSession);
cartsRouter.post('/add-product', addProduct);
cartsRouter.get('/', getAllCarts);
cartsRouter.patch('/update-cart', cartExists, protectCart, updateCart);



module.exports = { cartsRouter };

