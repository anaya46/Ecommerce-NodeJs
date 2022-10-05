const express = require('express');

// Controllers
const {
	createUser,
	login,
	getProductsByUser,
	updateUser,
	deleteUser,
	getAllOrders,
	getOneOrder,
	getAllUsers
} = require('../controllers/users.controller');

// Middlewares
const { userExists } = require('../middlewares/users.middlewares');
const { orderExists } = require('../middlewares/order.middlewares');
const {
	protectSession,
	protectUsersAccount,
	protectAdmin,
} = require('../middlewares/auth.middlewares');
const {
	createUserValidators,
} = require('../middlewares/validators.middlewares');

const usersRouter = express.Router();

usersRouter.post('/', createUserValidators, createUser);


usersRouter.post('/login', login);
usersRouter.get('/', getAllUsers);


// Protecting below endpoints
usersRouter.use(protectSession);

usersRouter.get('/me', getProductsByUser);

usersRouter.patch('/:id', userExists, protectUsersAccount, updateUser);

usersRouter.delete('/:id', userExists, protectUsersAccount, deleteUser);

usersRouter.get('/orders', getAllOrders);

usersRouter.get('/orders/:id', orderExists, getOneOrder);


module.exports = { usersRouter };
