const express = require('express')

//Controllers
const {
    createCategory,
    createProduct,
    getProductsAll,
    getProduct,
    updateProduct,
    deleteProduct,
    getCategoriesAll,
    updateCategory
} = require('../controllers/products.controller')

//Middlewares
const {
    createProductValidators,
    createCategoryValidators
} = require('../middlewares/validators.middlewares')

const {
    categoryExists
} = require('../middlewares/category.middleware')

const {
    productExists
} = require('../middlewares/product.middleware')

const {
    protectSession,
    protectProduct
} = require('../middlewares/auth.middlewares')

//Utils
const {
    upload
} = require('../utils/multer.util')

const productsRouter = express.Router()

productsRouter.get('/categories', getCategoriesAll)

productsRouter.get('/', getProductsAll)

productsRouter.get('/:id', productExists, getProduct)

//Endpoint protected
productsRouter.use(protectSession)

productsRouter.post('/categories', createCategoryValidators, createCategory)

productsRouter.patch('/categories/:id', categoryExists, updateCategory)

productsRouter.post('/', upload.array('productImg', 5), createProductValidators, createProduct);

productsRouter.patch('/:id', productExists, protectProduct, updateProduct)

productsRouter.delete('/:id', productExists, protectProduct, deleteProduct)

module.exports = { productsRouter }