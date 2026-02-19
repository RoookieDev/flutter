const { default: mongoose } = require('mongoose');
const mangoose = require('mongoose');


const CartSchema = new mongoose.Schema({
    email:String,
    prdId: String,
});

const cart = mongoose.model("UserCart", CartSchema);
module.exports = cart;