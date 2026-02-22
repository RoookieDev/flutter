const express = require('express');
const router = express.Router();
const {UserPostData, UserLoginData, UserProfile, UserLogout, UserCart, ShowUserCart, RemoveCart, checkUserCart} = require("../controller/flutter_controller");
const auth = require('../middleware/auth');

router.route('/addUser').post(UserPostData);
router.route('/loginUser').post(UserLoginData);
router.get('/user/profile', auth, UserProfile);
router.post('/user/UserLogout', auth, UserLogout);
router.post('/user/UserCart',auth, UserCart);
router.get('/user/ShowUserCart',auth, ShowUserCart);
router.post('/user/RemoveCart',auth, RemoveCart);
router.get('/user/checkCart/:prdId',auth, RemoveCart);
module.exports = router;