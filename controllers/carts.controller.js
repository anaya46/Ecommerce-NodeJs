const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Models
const { Cart } = require('../models/cart.model');
const { ProductInCart } = require('../models/productInCart.model');
const { Product } = require('../models/product.model');
const { Order } = require('../models/order.model');

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
        const productInCart = await ProductInCart.findOne({
            where: { cartId: cart.id, productId }
        });

        if (!productInCart) {
            await ProductInCart.create({ cartId: cart.id, productId, quantity });

        } else if (productInCart.status === 'active') {
            return next(new AppError('This product is already in the cart', 400));

        } else if (productInCart.status === 'removed') {
            await productInCart.update({ status: 'active', quantity });
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
    const { sessionUser } = req;
    const { productId, newQty } = req.body;

    const cart = await Cart.findOne({
        where: { userId: sessionUser.id, status: "active" }
    })

    if (!cart) {
        return next(new AppError(`You do not have cart active `, 400))
    }

    const product = await Product.findOne({
        where: { id: productId, status: "active" }
    })
    if (!product) {
        return next(new AppError(`Product does not exist`, 404));
    } else if (newQty > product.quantity) {
        return next(new AppError(`There are only available ${product.quantity} products.`, 400)
        );
    } else if (0 > newQty) {
        return next(new AppError(`Please correct your quantity`, 400)
        );
    }

    const productInCart = await ProductInCart.findOne({
        where: { cartId: cart.id, status: 'active', productId }
    });

    if (!productInCart) {
        return next(
            new AppError(`This product does not exist in the cart, please add it first `, 404)
        );
    }

    if (newQty === 0) {
        await productInCart.update({ quantity: 0, status: 'removed' });
    } else if (newQty > 0) {
        await productInCart.update({ quantity: newQty });
    }

    res.status(200).json({
        status: 'success',

    });
});

const takeOutProduct = catchAsync(async (req, res, next) => {
    const { cart } = req;

    const { productId } = req.params;

    const productInCart = await ProductInCart.findOne({
        where: { status: 'active', cartId: cart.id, productId }
    });

    if (!productInCart) {
        return next(new AppError('This product does not exist in this cart', 404));
    }

    await productInCart.update({ status: 'removed', quantity: 0 });

    res.status(200).json({
        status: 'success',

    });
});

const buyCart = catchAsync(async (req, res, next) => {

    let totalPrice = 0

    const { sessionUser } = req;

    const cart = await Cart.findOne({
        where: { userId: sessionUser.id, status: "active" },
        include: { model: ProductInCart }
    })
    console.log(cart)

    const selectProductsInCart = cart.productInCarts.map(async (productInCart) => {
        const product = await Product.findOne({
            where: { id: productInCart.productId },
        })

        const subTotal = product.price * productInCart.quantity

        const newQuantity = product.quantity - productInCart.quantity

        totalPrice += subTotal

        await product.update({ quantity: newQuantity })

        await productInCart.update({ status: 'purchased' })
    });

    await Promise.all(selectProductsInCart);

    await cart.update({ status: 'purchased' });

    const newOrder = await Order.create({
        userId: sessionUser.id,
        cartId: cart.id,
        totalPrice
    });

    res.status(201).json({
        status: 'success',
        data: { newOrder }
    });
});



module.exports = {
    addProduct,
    getAllCarts,
    updateCart,
    takeOutProduct,
    buyCart

};
