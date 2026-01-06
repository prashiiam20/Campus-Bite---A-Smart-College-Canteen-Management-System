const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

// Use the connection string with SSL configuration
const sequelize = new Sequelize('canteen', 'postgres', 'Mohith@07Ganesh', { 
    host: 'localhost',
    dialect: 'postgres',
    logging: false,
});

const User = sequelize.define('User', {
    user_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    phone: DataTypes.STRING,
    role: { type: DataTypes.STRING, allowNull: false, defaultValue: 'user' }
}, { timestamps: true });

const Product = sequelize.define('Product', {
    product_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: DataTypes.TEXT,
    price: { type: DataTypes.DECIMAL, allowNull: false },
    discounted_price: DataTypes.DECIMAL,
    stock_quantity: { type: DataTypes.INTEGER, allowNull: false },
    image_url: DataTypes.STRING,
    size: DataTypes.STRING,
    color: DataTypes.STRING,
}, { timestamps: true });

const Order = sequelize.define('Order', {
    order_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    total_amount: { type: DataTypes.DECIMAL, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false },
    payment_method: { type: DataTypes.STRING, allowNull: false },
    payment_status: { type: DataTypes.STRING, allowNull: false },
    shipping_address: { type: DataTypes.STRING, allowNull: false },
    tracking_number: DataTypes.STRING,
    expected_delivery_date: DataTypes.DATE
}, { timestamps: true });

const OrderItem = sequelize.define('OrderItem', {
    item_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    order_id: { type: DataTypes.INTEGER, allowNull: false },
    product_id: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.DECIMAL, allowNull: false }
});

const Cart = sequelize.define('Cart', {
    cart_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
}, { timestamps: true });

const CartItem = sequelize.define('CartItem', {
    cart_item_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    cart_id: { type: DataTypes.INTEGER, allowNull: false },
    product_id: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.DECIMAL, allowNull: false }
});

const Payment = sequelize.define('Payment', {
    payment_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    order_id: { type: DataTypes.INTEGER, allowNull: false },
    amount: { type: DataTypes.DECIMAL, allowNull: false },
    currency: { type: DataTypes.STRING, allowNull: false, defaultValue: 'INR' },
    payment_method: { type: DataTypes.STRING, allowNull: false },
    transaction_id: DataTypes.STRING,
    status: { type: DataTypes.STRING, allowNull: false }
}, { timestamps: true });


// Associations
User.hasMany(Order, { foreignKey: 'user_id' });
Order.belongsTo(User, { foreignKey: 'user_id' });
Order.hasMany(OrderItem, { foreignKey: 'order_id' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });
Product.hasMany(OrderItem, { foreignKey: 'product_id' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id' });
User.hasOne(Cart, { foreignKey: 'user_id' });
Cart.belongsTo(User, { foreignKey: 'user_id' });
Cart.hasMany(CartItem, { foreignKey: 'cart_id' });
CartItem.belongsTo(Cart, { foreignKey: 'cart_id' });
CartItem.belongsTo(Product, { foreignKey: 'product_id' });
Product.hasMany(CartItem, { foreignKey: 'product_id' });
Order.hasOne(Payment, { foreignKey: 'order_id' });
Payment.belongsTo(Order, { foreignKey: 'order_id' });


// Simplify the initialization function since database already exists
async function initializeDatabase() {
    try {

        await sequelize.authenticate();
        console.log('Connection to database has been established successfully.');


        await sequelize.sync({ force: false });
        console.log('All tables have been successfully created');
    } catch (error) {
        console.error('Unable to connect to the database or create tables:', error);
        throw error;
    }
}


initializeDatabase().catch(console.error);

module.exports = {
    sequelize,
    User,
    Product,
    Order,
    OrderItem,
    Cart,
    CartItem,
    Payment,
};