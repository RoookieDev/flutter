const express = require('express');
const router = express.Router();
const {productContoller, searchProducts} = require('../controller/ProductController')
router.route('/').get(productContoller);
router.route('/searchproducts').post(searchProducts);

module.exports = router;