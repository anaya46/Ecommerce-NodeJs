const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Models
const { User } = require('../models/user.model');
const { Product } = require('../models/product.model');
const { Order } = require('../models/order.model');
const { Cart } = require('../models/cart.model');
const { ProductInCart } = require('../models/productInCart.model');


// Utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');

dotenv.config({ path: './config.env' });

// Gen random jwt signs
// require('crypto').randomBytes(64).toString('hex') -> Enter into the node console and paste the command

const getAllUsers = catchAsync(async (req, res, next) => {
	const users = await User.findAll({
		attributes: { exclude: ['password'] },
		where: { status: 'active' },
	});

	res.status(200).json({
		status: 'success',
		data: { users },
	});
});

const createUser = catchAsync(async (req, res, next) => {
	const { username, email, password } = req.body;

	//if (role !== 'admin' && role !== 'normal') {
	//return next(new AppError('Invalid role', 400));
	//}

	// Encrypt the password
	const salt = await bcrypt.genSalt(12);
	const hashedPassword = await bcrypt.hash(password, salt);

	const newUser = await User.create({
		username,
		email,
		password: hashedPassword,

	});

	// Remove password from response
	newUser.password = undefined;

	// 201 -> Success and a resource has been created
	res.status(201).json({
		status: 'success',
		data: { newUser },
	});
});

const getProductsByUser = catchAsync(async (req, res, next) => {
	const { sessionUser } = req
	const products = await Product.findAll({
		where: { userId: sessionUser.id },

	});

	res.status(200).json({
		status: 'success',
		data: { products },
	});
});

const updateUser = catchAsync(async (req, res, next) => {
	const { username, email } = req.body;
	const { user } = req;

	await user.update({ username, email });

	res.status(200).json({
		status: 'success',
		data: { user },
	});
});

const deleteUser = catchAsync(async (req, res, next) => {
	const { user } = req;

	await user.update({ status: 'disabled' });

	res.status(204).json({
		status: 'success',
		data: { user },
	});
});

const login = catchAsync(async (req, res, next) => {

	const { email, password } = req.body;


	const user = await User.findOne({
		where: { email, status: 'active' },
	});


	if (!user || !(await bcrypt.compare(password, user.password))) {
		return next(new AppError('Wrong credentials', 400));
	}

	// Remove password from response
	user.password = undefined;

	// Generate JWT (payload, secretOrPrivateKey, options)
	const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
		expiresIn: '30d',
	});

	res.status(200).json({
		status: 'success',
		data: { user, token },
	});
});

const getAllOrders = catchAsync(async (req, res, next) => {
	const { sessionUser } = req

	console.log(sessionUser.id)

	const orders = await Order.findAll({
		where: { userId: sessionUser.id },
		include: [{ model: Cart, include: { model: ProductInCart, where: { status: 'purchased' } } }],
	});
	console.log(orders)

	res.status(200).json({
		status: 'success',
		data: { orders },
	});
});

const getOneOrder = catchAsync(async (req, res, next) => {
	const { id } = req.params

	const orders = await Order.findOne({
		where: { id },
		include: [{ model: Cart, include: { model: ProductInCart, where: { status: 'purchased' } } }],
	})

	if (!orders) {
		return res.status(200).json({
			status: "success",
			message: "order no found",
		});
	}

	res.status(200).json({
		status: 'success',
		data: { orders },
	});
});



module.exports = {
	createUser,
	getAllUsers,
	login,
	getProductsByUser,
	updateUser,
	deleteUser,
	getAllOrders,
	getOneOrder
};
