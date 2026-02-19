const express = require('express');
const auth_router = express.Router();
const AuthController = require('../controller/refreshController');
auth_router.post("/refresh-token",AuthController.refreshToken);
module.exports = auth_router;