const express = require('express');

//Middlewares
const { protectSession } = require('../middlewares/auth.middlewares');

// Controllers
const {
    createProduct,

} = require('../controllers/products.controller');

const productsRouter = express.Router();


productsRouter.post('/', createProduct);



module.exports = { productsRouter };


