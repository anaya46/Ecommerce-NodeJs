// Models
const { Product } = require('../models/product.model');
const { Category } = require('../models/category.model')
// Utils
const { catchAsync } = require('../utils/catchAsync.util');
const createCategory = catchAsync(async (req, res, next) => {
    const { name } = req.body
    const newCategory = await Category.create({
        name
    })
    res.status(200).json({
        status: 'succes',
        data: { newCategory }
    })
})
const getCategoriesAll = catchAsync(async (req, res, next) => {
    const category = await Category.findAll({
        where: { status: 'active' },
        attributes: { exclude: ['status', 'createdAt', 'updatedAt'] },
    })
    res.status(200).json({
        status: 'success',
        data: {
            category
        }
    })
})
const updateCategory = catchAsync(async (req, res, next) => {
    const { name } = req.body
    const { category } = req
    await category.update({ name })
    res.status(200).json({
        status: 'success',
        data: { category }
    })
})
const createProduct = catchAsync(async (req, res, next) => {
    const { sessionUser } = req
    const { title,
        description,
        price,
        categoryId,
        quantity,
    } = req.body;
    const newProduct = await Product.create({
        title,
        description,
        price,
        categoryId,
        quantity,
        userId: sessionUser.id,
    });
    res.status(200).json({
        status: 'success',
        data: { newProduct },
    });
});
const getProductsAll = catchAsync(async (req, res, next) => {
    const product = await Product.findAll({
        where: { status: 'active' },
        attributes: { exclude: ['status', 'createdAt', 'updatedAt'] },
        include: [
            {
                model: Category,
                attributes: ['id', 'name']
            }
        ]
    })
    console.log(product);
    res.status(200).json({
        status: 'success',
        data: {
            product
        }
    })
})
const getProduct = catchAsync(async (req, res, next) => {
    const { id } = req.product
    const product = await Product.findOne({
        where: { id, status: 'active' },
        attributes: { exclude: ['status', 'createdAt', 'updatedAt'] },
        include: [
            {
                model: Category,
                attributes: ['id', 'name']
            }
        ]
    })
    res.status(200).json({
        status: 'success',
        data: {
            product
        }
    })
})
const updateProduct = catchAsync(async (req, res, next) => {
    const { title, description, price, quantity } = req.body
    const { product } = req
    await product.update({ title, description, price, quantity })
    res.status(200).json({
        status: 'success',
        data: { product }
    })
})
const deleteProduct = catchAsync(async (req, res, next) => {
    const { product } = req
    await product.update({ status: 'disabled' })
    res.status(200).json({
        status: 'success',
        message: `The product ${product.title} has been disabled`
    })
    next()
})
module.exports = {
    createCategory,
    createProduct,
    getProductsAll,
    getProduct,
    updateProduct,
    deleteProduct,
    getCategoriesAll,
    updateCategory
}