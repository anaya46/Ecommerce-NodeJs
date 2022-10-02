// Models
const { Cart } = require('../models/cart.model');
const { ProductInCart } = require('../models/productInCart.model');
const { Product } = require('../models/product.model');

// Utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');

const checkQuantityProduct = catchAsync(async (req, res, next) => {
    const { quantity } = req;

    //const quantity = await Product.findOne({
    // where: { },
    // });


    if (quantity >= Product.quantity) {
        return next(new AppError('Quantity is not available', 404));
    }

    // req.anyPropName = 'anyValue'
    req.quantity = quantity;
    next();
});

const productExists = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const product = await Product.findOne({
        where: { id },
    });

    // If user doesn't exist, send error message
    if (product) {
        return next(new AppError('Product has already been added', 404));
    }

    // req.anyPropName = 'anyValue'
    req.product = product
    next();
});




module.exports = {
    checkQuantityProduct,
    productExists
};
