// Utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');

// Models
const { ProductInCart } = require('../models/productInCart.model');
const { Cart } = require('../models/cart.model');



const cartExists = catchAsync(async (req, res, next) => {
    const { sessionUser } = req;

    const cart = await Cart.findOne({
        where: { userId: sessionUser.id, status: 'active', },
        include: [
            {
                model: ProductInCart,
                where: { status: 'active' }
            }
        ]
    });

    if (!cart) {
        return next(new AppError('There are not exist cart', 400));
    }

    req.cart = cart;

    next();
});



module.exports = { cartExists }