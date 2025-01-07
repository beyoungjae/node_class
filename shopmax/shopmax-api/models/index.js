const Sequelize = require('sequelize')
const env = process.env.NODE_ENV || 'development'
const config = require('../config/config')[env]

const User = require('./user')
const Item = require('./item')
const Cart = require('./cart')
const CartItem = require('./cartItem')
const Order = require('./order')
const OrderItem = require('./orderItem')
const Img = require('./img')
const Domain = require('./domain')

const db = {}

const sequelize = new Sequelize(config.database, config.username, config.password, config)

db.sequelize = sequelize

db.User = User
db.Item = Item
db.Cart = Cart
db.CartItem = CartItem
db.Order = Order
db.OrderItem = OrderItem
db.Img = Img
db.Domain = Domain

User.init(sequelize)
Item.init(sequelize)
Cart.init(sequelize)
CartItem.init(sequelize)
Order.init(sequelize)
OrderItem.init(sequelize)
Img.init(sequelize)
Domain.init(sequelize)

User.associate(db)
Order.associate(db)
Cart.associate(db)
Item.associate(db)
Img.associate(db)
OrderItem.associate(db)
CartItem.associate(db)
Domain.associate(db)

module.exports = db
