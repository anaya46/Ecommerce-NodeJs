<<<<<<< HEAD
// Models
const { User } = require('../models/user.model');
const { Product } = require('../models/product.model');
const { Order } = require('../models/order.model');
const { Cart } = require('../models/cart.model');
const { ProductInCart } = require('../models/productInCart.model');
const { Category } = require('../models/category.model')


// Utils
const { catchAsync } = require('../utils/catchAsync.util');

const createCategory = catchAsync( async (req, res, next) => {    
    const { name } = req.body

    const newCategory = await Category.create({
        name
    })

    res.status(200).json({
        status: 'succes',
        data: { newCategory }
    })
})

module.exports = { createCategory }
=======
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

//models
const { Product } = require('../models/product.model');

// Utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');

dotenv.config({ path: './config.env' });


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

module.exports = {
    createProduct,

};
>>>>>>> 1e8d4dd3fbafe3d5131e914c15f97102409a2c29
