const Product = require("../model/productModel");

const productContoller = async (req, res) => {
    console.log("product");
  try {
    const products = await Product.find();

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });

  } catch (error) {
    console.error("Product Fetch Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


const searchProducts =async(req,res)=>{
  console.log("search");
  const{searchItem, page=1} = req.body;
  const limit=6;
  const skip = (page-1)*limit;
  try {
    const searchProducts = await Product.find({
       name: { $regex: searchItem, $options: "i" }
    }).skip(skip).limit(limit);
    res.status(200).send({
  success:true,
  data:searchProducts
  })

  } catch (error) {
    res.status(500).send({
      msg:"Server Error"
    })
  }
}

module.exports = {productContoller, searchProducts};
