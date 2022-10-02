const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Models
const { Cart } = require('../models/cart.model');
const { ProductInCart } = require('../models/productInCart.model');

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

    if (cart || (quantity >= ProductInCart.quantity)) {
        return res.status(200).json({
            status: "success",
            message: "You have other cart active or quantity is not available",
        });
    }

    const newCart = await Cart.create({ productId, quantity, userId: sessionUser.id });

    res.status(200).json({
        status: 'success',
        data: { newCart },
    });
});






module.exports = {
    createCart,

};
