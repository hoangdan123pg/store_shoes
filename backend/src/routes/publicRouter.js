const express = require('express');
const router = express.Router();

const Product = require('../models/Product');

router.get('/home', async (req, res) => {
   // console.log("/home")
    try {
        // lấy 3 sản phẩm mới nhất làm banner
        const listProductBanner = await Product.find().sort({ price: 1 }).limit(3);
        // lấy 3 sản phẩm state = hot
        const listProductHot = await Product.find({status: "hot"}).sort({createdAt: -1}).limit(3); // -1 lấy date moi nhat
        // lấy 3 sản phẩm state = new
        const listProductSale = await Product.find({status: "sale"}).sort({createdAt: -1}).limit(3);
       // console.log(listProductSale.length)
        const ProductTopSale = await Product.find().sort({discord: -1})
        const topSale = ProductTopSale[0].discord
        console.log("top sale", topSale)
        res.status(200).json({
            listProductBanner,
            listProductHot,
            listProductSale,
            topSale
        })
    }catch(error) {
        res.status(500).json({message: "Internal Server Error"})
    }
})
router.get('/topsale', async (req, res) => {
    // console.log("/home")
     try {    
         const ProductTopSale = await Product.find().sort({discord: -1})
         const topSale = ProductTopSale[0].discord
         console.log("top sale", topSale)
         res.status(200).json({
             topSale
         })
     }catch(error) {
         res.status(500).json({message: "Internal Server Error"})
     }
 })
// lay thong tin product theo name
router.get('/product', async (req, res) => {
  console.log("hi api public");

  const { name } = req.query;
  const originalName = name.replace(/_/g, " ").replace(/-/g, "/");

  try {
      const products = await Product.find({ name: { $regex: originalName, $options: "i" } })
          .populate({ path: "comment.user_id", select: "email" }); // Chỉ lấy email từ Account

      res.status(200).json({ products });
  } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Internal Server Error" });
  }
});



router.get("/collections/:category", async (req, res) => {
    try {
      let categoryParse = req.params.category === "all" ? "giày" : req.params.category;
      const searchQuery = req.query.search ? req.query.search.trim() : "";
      const page = parseInt(req.query.page) || 1;
      const limit = 5;
      const skip = (page - 1) * limit;
      console.log("data tu fe: ", req.query.filter_size)
      let filterConditions = {
        category: { $regex: new RegExp(`^${categoryParse}$`, "i") },
      };
  
      if (searchQuery) {
        filterConditions.name = { $regex: new RegExp(searchQuery, "i") };
      }
  
      // Kiểm tra filter brand
      if (req.query.filter_brand) {
        const brandArray = req.query.filter_brand.split(",");
        filterConditions.brand = { $in: brandArray };
      }
  
      // Kiểm tra filter size
      if (req.query.filter_size) {
        const sizeArray = req.query.filter_size.split(",").map(Number);
        filterConditions.size = { $in: sizeArray };
      }
  
      const products = await Product.find(filterConditions).skip(skip).limit(limit);
  
      const brands = await Product.aggregate([
        { $match: filterConditions },
        { $group: { _id: "$brand" } },
        { $project: { _id: 0, brand: "$_id" } },
      ]);
  
      const totalProducts = await Product.countDocuments(filterConditions);
      const totalPages = Math.ceil(totalProducts / limit);
  
      res.status(200).json({ products, brands, totalPages });
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  // router add review
// router.post('/products/review/:productId', async (req, res) => {
//     console.log("hello")
//     try {
//         const { productId } = req.params; // Lấy productId từ params
//         const { rate, comment } = req.body; // Nhận đúng dữ liệu từ frontend
//         console.log("data from api: ", productId, rate, comment);
//         const 
//     }catch(error){
//         console.log(error)
//     }
// });


  
module.exports = router