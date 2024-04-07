import Product from "../models/product.model.js"; // Import model sản phẩm
import responseHandler from "../handlers/response.handler.js";

export const searchProductList = async (req, res, next) => {
  try {
    const searchKey = req.query.searchkey; // Lấy từ truy vấn tìm kiếm từ query parameter
    const products = await Product.find({
      $or: [
        { product_name: { $regex: searchKey, $options: "i" } }, // Tìm kiếm theo tên sản phẩm, không phân biệt chữ hoa chữ thường
        { product_description: { $regex: searchKey, $options: "i" } }, // Tìm kiếm theo mô tả sản phẩm, không phân biệt chữ hoa chữ thường
      ],
    });

    res.status(200).json({ success: true, products: products });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi tìm kiếm sản phẩm.",
    });
  }
};

export const getNewestProducts = async (req, res, next) => {
  try {
    const newestProducts = await Product.find()
      .sort({ createdAt: -1 }) // Sắp xếp các sản phẩm theo thời gian tạo giảm dần (tức là mới nhất đầu tiên)
      .limit(10); // Giới hạn kết quả trả về chỉ 10 sản phẩm

    res.status(200).json({ success: true, products: newestProducts });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi lấy sản phẩm mới nhất.",
    });
  }
};

export const getTopRatedProducts = async (req, res, next) => {
  try {
    const topRatedProducts = await Product.find()
      .sort({ product_avg_rating: -1 }) // Sắp xếp các sản phẩm theo product_avg_rating giảm dần
      .limit(10); // Giới hạn kết quả trả về chỉ 10 sản phẩm

    res.status(200).json({ success: true, products: topRatedProducts });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi lấy sản phẩm có đánh giá cao nhất.",
    });
  }
};

// [GET] /api/:product_slug
export const getProduct = async (req, res, next) => {
  const productSlug = req.params.product_slug;

  try {
    const product = await Product.findOne({
      product_slug: productSlug,
    }).exec();

    if (!product) {
      return responseHandler.notFound(res, "Product Not Found");
    }

    const productCategory = product.categories[0].category;
    const productId = product.product_id;
    const relatedProducts = await Product.find({
      categories: { $elemMatch: { category: productCategory } },
      product_id: { $ne: productId },
    });
    return responseHandler.ok(res, { product, relatedProducts });
  } catch (err) {
    console.log(err);
    return responseHandler.error(res);
  }
};
