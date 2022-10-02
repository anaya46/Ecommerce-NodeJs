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
