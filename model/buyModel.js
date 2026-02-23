const mongoose = require('mongoose');
const buySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [
        {
            prdId: {
                type: String,   
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            }
        }
    ],
    totalAmount: {  
        type: Number,
        required: true
    },
    purchaseDate: {
        type: Date,
        default: Date.now
    }
});


const Buy = mongoose.model('Buy', buySchema);
module.exports = Buy;