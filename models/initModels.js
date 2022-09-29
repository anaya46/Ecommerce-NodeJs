// Models
const { User } = require('./user.model');
const { Order } = require('./order.model');
const { Cart } = require('./cart.model');
const { Product } = require('./product.model');
const { ProductInCart } = require('./productInCart.model');
const { Category } = require('./category.model');
const { ProductImgs } = require('./productImgs.model');

const initModels = () => {

    // 1 User : M Orders
    User.hasMany(Order, { foreignKey: "userId" });
    Order.belongsTo(User);

    // 1 User : 1 Cart
    User.hasOne(Cart, { foreignKey: "userId" });
    Cart.belongsTo(User);

    // 1 User : M Products
    User.hasMany(Product, { foreignKey: "userId" });
    Product.belongsTo(User);

    // 1 Cart : 1 order
    Cart.hasOne(Order, { foreignKey: "cartId" });
    Order.belongsTo(Cart);

    // 1 Category : 1 Product
    Category.hasOne(Product, { foreignKey: "categoryId" });
    Product.belongsTo(Category);

    // 1 Cart : M ProductsInCart
    Cart.hasMany(ProductInCart, { foreignKey: "cartId" });
    ProductInCart.belongsTo(Cart);

    // 1 Product : M ProductImg
    Product.hasMany(ProductImgs, { foreignKey: "productId" });
    ProductImgs.belongsTo(Product);

    // 1 ProductsInCart : M ProductImg
    ProductInCart.hasMany(ProductImgs, { foreignKey: "productId" });
    ProductImgs.belongsTo(Product);


};

module.exports = { initModels };
