
const express = require('express')

//Controllers
const {
    createCategory,
    createProduct
} = require('../controllers/products.controller')

//Middlewares
const{
    protectAdmin,
    protectSession
} = require('../middlewares/auth.middlewares')

const productsRouter = express.Router()

productsRouter.post('/categories', protectSession, createCategory)
productsRouter.post('/', protectSession, createProduct);
//aqui

module.exports = { productsRouter }
