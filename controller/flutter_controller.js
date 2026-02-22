const userModel = require('../model/userModel');
const cart = require('../model/cartModel')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_TOKEN;

const UserPostData = async(req,res)=>{
    const{name,email, password} = req.body;
    const data=await userModel.findOne({email});
    if(!data){
        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(password,salt);
        userModel.create({
            "name":req.body.name,
            "email":req.body.email,
            "password":hashedpassword
        })
        .then(user=> {
            res.status(200).send({
                "status_code": 200,
                "msg": "1",
            })
        })
        .catch(err=> res.json(err));
    }
    else{
         res.status(201).send({
             "status_code": 200,
             "msg": "E",
             "data": ''
         })
    }   
}

const UserLoginData = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(401).send({ msg: "Incorrect Email" });
    }

    const isMatched = await bcrypt.compare(password, user.password);

    if (!isMatched) {
      return res.status(401).send({ msg:"Password not correct"});
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // IMPORTANT: assign first
    user.refreshToken = refreshToken;

    // THEN save
    await user.save();

    res.status(200).json({
      token,
      refreshToken,
      status_code:200,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });

  } catch (err) {
    res.status(500).json({ msg: err.message, secret:REFRESH_SECRET});
  }
};

const UserProfile = async(req, res) =>{
    console.log("User Profile")
    try{
         console.log(req.user);
        const user = await userModel.findById(req.user.userId).select("-password");
        res.send({
            status_code:200, 
            user
        });
    }
    catch(err){
        res.send({
            status_code:"500",
            msg:"Error"
        })
    }
}

const UserLogout = async (req, res) => {
    console.log("logout")
    try {
        // Ensure this ID matches the one in your database: 6992eecd47732483068cdc39
        const userId = req.user.userId; 

        if (!userId) {
            return res.status(401).json({ msg: "User ID not found in token" });
        }

        // Explicitly nullify the field
        const result = await userModel.findOneAndUpdate(
            { _id: userId },
            { $set: { refreshToken: null } },
            { new: true }
        );

        if (result) {
            console.log("Token successfully cleared in DB");
            return res.status(200).json({ status_code: 200, msg: "Logged out successfully" });
        } else {
            return res.status(404).json({ msg: "User not found" });
        }
    } catch (err) {
        res.status(500).json({ status_code: 500, error: err.message });
    }
};

const UserCart = async(req,res)=>{
    console.log("userCart");
    try {
        const email = req.user.email;
        const{prdId} = req.body;

    const checkDuplicate = await cart.findOne({prdId, email});
    if(!checkDuplicate){
        await cart.create({ email, prdId });
        return res.status(200).send({ msg: 'Item Added', status_code:200 });
    }
    else{
        await cart.findOneAndDelete({prdId:prdId, email:email});
         return res.send({msg:'Item Removed',  status_code:200})
    }
    } catch (error) {
         return res.status(500).send({msg:err, status_code:500})
    }

}

const ShowUserCart = async (req, res) => {
    console.log("Fetching UserCart for:", req.user.email);
    const email = req.user.email;

    try {
      
        const cartItems = await cart.aggregate([
            {
                $match: { email: email }
            },
            {
                $lookup: {
                    from: "products",         
                    localField: "prdId",      
                    foreignField: "id",       
                    as: "productData"
                }
            },
            {
                // Ek item banane ke liye unwind
                $unwind: "$productData"
            },
            {
                // Data ko clean karke bhejne ke liye (Optional)
                $project: {
                    _id: 0,
                    id: "$productData.id",
                    name: "$productData.name",
                    discount_price: "$productData.discount_price",
                    image: "$productData.image",
                    // Baaki fields jo aapko chahiye
                }
            }
        ]);

        // 2. Response bhejna mat bhulein
        return res.status(200).json({
            success: true,
            cart: cartItems
        });

    } catch (error) {
        console.error("Cart Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

const checkUserCart = async(req,res) =>{
    console.log("Check Cart");
    const email = req.params;
    try {
        const {prdId} = req.body;
        const checkItem = await cart.findOne({email, prdId});
        if(!checkItem) return res.status(404).send({msg:0});
        return res.status(200).res.status(200).send({msg:1})
    } catch (error) {
        return res.status(500).send({
            msg:"Server Error"
        })
    }
}

const RemoveCart = async(req,res)=>{
    console.log("Delete")
    const email = req.user.email;
    const {prdId} = req.body;
    try {

        // find and delete cart
        const removeItem = await cart.findOneAndDelete({email:email,prdId:prdId});
        if(!removeItem) return res.status(404).send({msg:prdId});
        const uppdatedCart = await cart.aggregate([
            {
                $match:{
                    email:email
                },
            },
            {
                $lookup:{
                    from:"products",
                    localField:"prdId",
                    foreignField:"id",
                    as:"productData"
                }
            },
            {
                $unwind:"$productData"
            },
    
            {
                $project: {
                    _id: 0,
                    id: "$productData.id",
                    name: "$productData.name",
                    discount_price: "$productData.discount_price",
                    image: "$productData.image",
                }
            }

        ])
        return res.status(200).send({
            success:true,
            data:uppdatedCart
        })
    } catch (error) {
        res.status(500).send({
            msg:"server error",
        })
    }
}


module.exports = {UserPostData,UserLoginData, UserProfile, UserLogout, UserCart,ShowUserCart, RemoveCart, checkUserCart};
