const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');

const { product_router } = require('./routers/product_router');
const { order_router } = require('./routers/order_router');
const { payment_router } = require('./routers/payment_router');
const { cart_router } = require('./routers/cart_router');
const { auth_router } = require('./routers/auth_router');
const { user_router } = require('./routers/user_router');


app.use(cors());
app.use(express.json());

app.use(product_router);
app.use(order_router);
app.use(payment_router);
app.use(cart_router);
app.use(auth_router);
app.use(user_router);



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.get("/health", (req, res) => {
    res.send("Server is running");
});

