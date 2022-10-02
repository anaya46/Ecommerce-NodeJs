// Models
const { Cart } = require('../models/cart.model');
const { ProductInCart } = require('../models/productInCart.model');
const { Product } = require('../models/product.model');

// Utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');

const checkQuantityProduct = catchAsync(async (req, res, next) => {
    //const { id } = req.params;

    //const quantity = await Product.findOne({
    // where: { },
    // });


    if (quantity >= ProductInCart.quantity) {
        return next(new AppError('User not found', 404));
    }

    // req.anyPropName = 'anyValue'
    req.user = user;
    next();
});

module.exports = {
    checkQuantityProduct,
};
