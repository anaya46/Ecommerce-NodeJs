const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Models
const { Cart } = require('../models/cart.model');
const { ProductInCart } = require('../models/productInCart.model');
const { Product } = require('../models/product.model');

// Utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');

dotenv.config({ path: './config.env' });

const createCart = catchAsync(async (req, res, next) => {
    const { productId, quantity } = req.body;
    const { sessionUser } = req

    const cart = await Cart.findOne({
        where: { userId: sessionUser.id },
    })

    if (cart) {
        return res.status(200).json({
            status: "success",
            message: "You have other cart active",
        });
    }

    const newCart = await Cart.create({ productId, quantity, userId: sessionUser.id });

    res.status(200).json({
        status: 'success',
        data: { newCart },

    });


});

const getAllCarts = catchAsync(async (req, res, next) => {
    const carts = await Cart.findAll({
        where: { status: 'active' },


    });

    res.status(200).json({
        status: 'success',
        data: { carts },
    });
});





module.exports = {
    createCart,
    getAllCarts,

};
