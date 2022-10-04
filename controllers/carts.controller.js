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

const addProduct = catchAsync(async (req, res, next) => {
    const { productId, quantity } = req.body;
    const { sessionUser } = req;


    const product = await Product.findOne({
        where: [{ id: productId }, { status: "active" }]
    });

    if (!product) {
        return next(new AppError(`Product does not exist`, 404)
        );
    } else if (product.quantity < quantity) {
        return next(new AppError(`There are only available ${product.quantity} products.`, 400)
        );

    }

    const cart = await Cart.findOne({
        where: { status: "active", userId: sessionUser.id }
    })

    if (!cart) {
        const newCart = await Cart.create({ userId: sessionUser.id });

        await ProductInCart.create({
            productId,
            cartId: newCart.id,
            quantity
        });
    } else {
        const productExists = await ProductInCart.findOne({
            where: { cartId: cart.id, productId }
        });

        if (!productExists) {
            await ProductInCart.create({ cartId: cart.id, productId, quantity });

        } else if (productExists.status === 'active') {
            return next(new AppError('This product is already in the cart', 400));

        } else if (productExists.status === 'removed') {
            await productExists.update({ status: 'active', quantity });
        }

    }

    res.status(200).json({
        status: 'success',


    });
});


const getAllCarts = catchAsync(async (req, res, next) => {
    const carts = await Cart.findAll({
        where: ({ where: { id, status: "active" } })


    });

    res.status(200).json({
        status: 'success',
        data: { carts },
    });
});

const updateCart = catchAsync(async (req, res, next) => {

    const { cart, sessionUser } = req;

    console.log(sessionUser.id, cart.userId)

    // if (sessionUser.id !== cart.userId) {
    //     return next(
    //         new AppError(`Your are not the owner of this cart `, 400)
    //     );
    // }


    const { productId, newQty } = req.body;

    const product = await Product.findOne({
        where: { id: productId }
    })



    if (product.quantity < newQty) {
        return next(new AppError(`There are only available ${product.quantity} products.`, 400)
        );
    }


    // const productInCart = await ProductInCart.findOne({
    //     where: { status: 'active', cartId: cart.id, productId }
    // });

    // if (!productInCart) {
    //     return next(
    //         new AppError(`This product does not exist in the cart, please add it first `, 404)
    //     );
    // }
    // if (quantity === 0) {
    //     await productInCart.update({ quantity: 0, status: 'removed' });
    // }
    // if (quantity > 0) {
    //     await productInCart.update({ quantity });
    // }

    res.status(200).json({
        status: 'success',

    });
});



module.exports = {
    addProduct,
    getAllCarts,
    updateCart

};
