const express = require('express')

//Controllers
const {
    createCategory
} = require('../controllers/products.controller')

//Middlewares
const{
    protectAdmin,
    protectSession
} = require('../middlewares/auth.middlewares')

const productsRouter = express.Router()

productsRouter.post('/categories', protectSession, createCategory)

module.exports = { productsRouter }