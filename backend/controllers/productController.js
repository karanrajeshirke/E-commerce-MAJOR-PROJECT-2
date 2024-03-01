import productModel from "../models/productModel.js";
import orderModel from "../models/orderModel.js";
import categoryModel from "../models/categoryModel.js";
import userModel from "../models/userModel.js";
import fs from "fs";
import slugify from "slugify";
import braintree from "braintree";
import dotenv from "dotenv";
import mongoose from "mongoose";
import adminOrderModel from "../models/adminOrderModel.js";
import orderPageModel from "../models/orderPageModel.js";

dotenv.config();

//!BRAIN TREE

var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

//!creating an product only admin access
export const createProductController = async (req, res) => {
  try {
    const { name, description, price, inStock, shipping, category } =
      req.fields;
    const { photo } = req.files;

    if (!name) {
      return res.status(404).send({ message: "name is required" });
    }
    if (!description) {
      return res.status(404).send({ message: "description is required" });
    }
    if (!price) {
      return res.status(404).send({ message: "price is required" });
    }
    if (!inStock) {
      return res.status(404).send({ message: "inStock is required" });
    }
    if (!shipping) {
      return res.status(404).send({ message: "shipping is required" });
    }
    if (!category) {
      return res.status(404).send({ message: "category is required" });
    }
    if (photo && photo.size > 1000000) {
      return res
        .status(404)
        .send({ message: "photo is Required and should be less then 1mb" });
    } else {
      console.log("No photo ");
    }
    const products = new productModel({
      ...req.fields,
      slug: slugify(name),
      seller: req.user._id,
    });

    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }

    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Something went wrong while creating a product",
      error,
    });
  }
};

//! fetching products for home page (unproteced)
export const getProductsController = async (req, res) => {
  try {
    const allproducts = await productModel
      .find()
      .select("-photo")
      .populate("category")
      // .limit(12)
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      counTotal: allproducts.length,
      message: "ALlProducts ",
      allproducts,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Something went wrong while getting all products",
      error,
    });
  }
};

export const getProductsAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;
    const allproducts = await productModel
      .find({ seller: adminId })
      .select("-photo")
      .populate("category")
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      counTotal: allproducts.length,
      message: "ALlProducts ",
      allproducts,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Something went wrong while getting all products",
      error,
    });
  }
};

export const getSingleProductController = async (req, res) => {
  try {
    let { slug } = req.params;
    const product = await productModel
      .findOne({ slug })
      .select("-photo")
      .populate("seller")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Single Product Fetched",
      product,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({
      success: false,
      message: "Eror while getitng single product",
      error,
    });
  }
};

//!----------------------------------------------

//!----------------------------------------------
//! deleting a product
export const deleteProductController = async (req, res) => {
  try {
    const { pid } = req.params;

    const deletedProduct = await productModel
      .findByIdAndDelete(pid)
      .select("-photo");

    res.status(200).send({
      success: true,
      message: "Product deleted",
      deletedProduct,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({
      success: false,
      message: "Something went wrong while deleteing the product",
      error: error.message,
    });
  }
};

//!----------------------
// export const deleteProductController = async (req, res) => {
//   try {
//     const { pid } = req.params;

//     // Find the product to be deleted
//     const deletedProduct = await productModel.findById(pid).select("-photo");

//     // If the product doesn't exist, return an error
//     if (!deletedProduct) {
//       return res.status(404).send({
//         success: false,
//         message: "Product not found",
//       });
//     }

//     // Remove references to the deleted product from other models
//     await userModel.updateMany(
//       { $or: [{ cart: deletedProduct._id }, { 'orders.product': deletedProduct._id }] },
//       { $pull: { cart: deletedProduct._id, 'orders.$[].product': deletedProduct._id } }
//     );
//     await adminOrderModel.updateMany(
//       { "products.product": deletedProduct._id },
//       { $pull: { products: { product: deletedProduct._id } } }
//     );
//     await orderModel.updateMany(
//       { "productArr.product": deletedProduct._id },
//       { $pull: { productArr: { product: deletedProduct._id } } }
//     );

//     // Remove references from the orderPage model
//     await orderPageModel.deleteMany({ product: deletedProduct._id });

//     // Delete the product
//     await deletedProduct.deleteOne();

//     // Send response
//     res.status(200).send({
//       success: true,
//       message: "Product deleted",
//       deletedProduct,
//     });
//   } catch (error) {
//     console.log(error.message);
//     return res.status(500).send({
//       success: false,
//       message: "Something went wrong while deleting the product",
//       error: error.message,
//     });
//   }
// };

export const getProductPhotoController = async (req, res) => {
  try {
    const { pid } = req.params;

    let product = await productModel.findById(pid).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Something went wrong while fetching the photo",
      error: error.message,
    });
  }
};

export const updateProductController = async (req, res) => {
  try {
    const { pid } = req.params;
    const { name, description, price, inStock, shipping, category } =
      req.fields;
    const { photo } = req.files;

    if (!name) {
      return res.status(404).send({ message: "name is required" });
    }
    if (!description) {
      return res.status(404).send({ message: "description is required" });
    }
    if (!price) {
      return res.status(404).send({ message: "price is required" });
    }
    if (!inStock) {
      return res.status(404).send({ message: "inStock is required" });
    }
    if (!shipping) {
      return res.status(404).send({ message: "shipping is required" });
    }
    if (!category) {
      return res.status(404).send({ message: "category is required" });
    }
    if (photo && photo.size > 1000000) {
      return res
        .status(404)
        .send({ message: "photo is Required and should be less then 1mb" });
    }

    const products = await productModel.findByIdAndUpdate(
      pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    // console.log(products);
    // console.log(photo);
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }

    await products.save();
    res.status(201).send({
      success: true,
      message: "Product updated Successfully",
      products,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({
      success: false,
      message: "Something went wrong while updating a product",
      error,
    });
  }
};

export const productFiltersController = async (req, res) => {
  try {
    const { catFilter, radioFilter } = req.body;
    let args = {};

    // productModel.find({category:[],price:{gte:radioFilter[0],lte:radioFilter[1]}})
    if (catFilter.length > 0) {
      args.category = catFilter;
    }
    if (radioFilter.length > 0) {
      args.price = { $gte: radioFilter[0], $lte: radioFilter[1] };
    }
    // console.log(args);
    let filteredData = await productModel.find(args).select("-photo");

    return res.status(200).send({
      success: "true",
      message: "data fetched successfully",
      filteredData,
    });

    // console.log(filteredData);
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Something went wrong while updating a product",
      error,
    });
  }
};

export const searchProductController = async (req, res) => {
  let { query } = req.params;

  try {
    let searched_data = await productModel
      .find({ name: { $regex: query, $options: "i" } })
      .select("-photo");

    res.status(200).send({
      success: "true",
      message: "search successfull",
      searched_data,
    });
  } catch (error) {
    res.status(500).send({
      success: "false",
      message: "Something went wrong while searching product",
      error,
    });
  }
};

export const getSimilarProductController = async (req, res) => {
  const { categoryId } = req.params;
  const { pid } = req.params;
  // console.log(categoryId);
  try {
    const simPro = await productModel
      .find({ category: categoryId, _id: { $ne: pid } })
      .select("-photo");

    // console.log(simPro);
    res.status(200).send({
      message: "fetched data",
      simPro,
    });
  } catch (error) {
    res.status(500).send({
      success: "false",
      message: "Something went wrong while searching product",
      error,
    });
  }
};

//logged in user ..we will get the id of the product to be add to cart
export const AddToCart = async (req, res) => {
  try {
    let userId = req.user._id;
    let { pid } = req.params; //a string based Id

    const user = await userModel.findById(userId);
    const cartArray = user.cart; //an array of objectId

    const pidObjectId = new mongoose.Types.ObjectId(pid);

    const isThere = cartArray.includes(pidObjectId);

    if (isThere) {
      return res.status(500).send({
        message: "Already added to cart",
      });
    }

    let updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { $push: { cart: pid } },
      { new: true }
    );
    res.status(200).send({
      updatedUser,
      message: "Added to cart",
    });
  } catch (error) {
    console.log(error);
  }
};

export const getFromCart = async (req, res) => {
  try {
    let userId = req.user._id;

    const itemsFromCart = await userModel.findById(userId).populate({
      path: "cart",
      select: "-photo",
      populate: {
        path: "seller",
      },
    });

    res.status(200).send({
      products: itemsFromCart.cart,
    });
  } catch (error) {
    console.log(error);
  }
};

//! get bill temporary

export const getbill = async (req, res) => {
  try {
    let id = req.user._id;

    const data = await userModel.findById(id).populate({
      path: "orders",
      populate: {
        path: "product",
        select: "-photo",
        populate: {
          path: "seller",
          select: "name",
        },
      },
    });

    res.status(200).send({
      data: data.orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

//!---------------------------------------------------------
//!place an order
export const placeOrder = async (req, res) => {
  try {
    const orderData = req.body.orderData;
    const orderDropDetails = req.body.orderDropDetails;

    const address = {
      country: orderDropDetails.country,
      houseadd: orderDropDetails.houseadd,
      city: orderDropDetails.city,
      state: orderDropDetails.state,
      postcode: orderDropDetails.postcode,
    };

    console.log(address);

    if (!orderData.length) {
      return res.status(500).send({
        message: "Cart is empty cannot place order",
      });
    }

    for (const order of orderData) {
      const newProduct = new orderPageModel({
        product: order.productId,
        quantity: order.quantity,
        country: orderDropDetails.country,
        houseadd: orderDropDetails.houseadd,
        city: orderDropDetails.city,
        state: orderDropDetails.state,
        postcode: orderDropDetails.postcode,
      });

      const savedProduct = await newProduct.save();
    }

    let userId = req.user._id;

    const user = await userModel.findById(userId);

    const formattedOrders = orderData.map((order) => ({
      product: order.productId,
      quantity: order.quantity,
      country: orderDropDetails.country,
      houseadd: orderDropDetails.houseadd,
      city: orderDropDetails.city,
      state: orderDropDetails.state,
      postcode: orderDropDetails.postcode,
    }));

    console.log(formattedOrders);
    user.orders.push(formattedOrders);

    await user.save();

    console.log(user);

    const cartItems = await userModel.findById(userId).populate({
      path: "cart",
      select: "-photo",
    });

    for (const item of orderData) {
      let id = item.productId;
      await productModel.findByIdAndUpdate(id, {
        $inc: { inStock: -item.quantity },
      });
    }

    const products = cartItems.cart.map((item, index) => ({
      product: item._id,
      status: "Not Process",
      quantity: req.body.orderData[index].quantity,
    }));

    const buyerExists = await orderModel.findOne({ buyer: userId });
    if (buyerExists) {
      buyerExists.productArr.push(...products);
      await buyerExists.save();
    } else {
      const order = new orderModel({
        buyer: userId,
        productArr: products,
      });

      await order.save();
    }

    const productsBySeller = {};
    for (const item of orderData) {
      const productId = item.productId;

      const product = await productModel.findById(productId);
      const sellerId = product.seller;

      if (!productsBySeller[sellerId]) {
        productsBySeller[sellerId] = [];
      }
      productsBySeller[sellerId].push({
        product: productId,
        buyer: userId,
        status: "Not Process",
        quantity: item.quantity,
      });
    }

    for (const sellerId in productsBySeller) {
      let adminOrder = await adminOrderModel.findOne({ seller: sellerId });

      if (!adminOrder) {
        adminOrder = new adminOrderModel({
          seller: sellerId,
          products: productsBySeller[sellerId],
        });
      } else {
        adminOrder.products.push(...productsBySeller[sellerId]);
      }

      await adminOrder.save();

      const user = await userModel.findById(userId);
      user.cart = [];
      await user.save();
    }

    return res.status(200).send({
      message: "Order placed successfully",
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ error: "Failed to place order" });
  }
};

//! from user view
export const getPlacedOrders = async (req, res) => {
  try {
    let userId = req.user._id;
    const orders = await orderModel.findOne({ buyer: userId }).populate({
      path: "productArr.product",
      select: "-photo",
      populate: {
        path: "seller",
        select: "-password",
      },
    });
    //!seller is inside the orders

    // console.log(orders);
    res.status(200).send(orders);
    // res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ error: "Failed to fetch user orders" });
  }
};

//! ADMIN -ORDERS ROUTE

export const adminOrdersSide = async (req, res) => {
  try {
    const adminId = req.user._id;
    let adminOrders = await adminOrderModel
      .findOne({ seller: adminId })
      .populate({
        path: "products.product",
        select: "-photo",
      })
      .populate("products.buyer");

    if (adminOrders) {
      res.status(200).send({
        productsArr: adminOrders.products,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

//!---------------------------------------------------------------

export const updateOrderStatus = async (req, res) => {
  try {
    let { pid, buyerId, status, id } = req.params;
    console.log(id);
    let sellerId = req.user._id;

    const buyer = await orderModel.findOne({ buyer: buyerId }).populate({
      path: "productArr.product",
      select: "-photo",
    });

    const seller = await adminOrderModel
      .findOne({ seller: sellerId })
      .populate({
        path: "products.product",
        select: "-photo",
      });

    seller.products.forEach((item) => {
      if (item.product._id.toString() === pid && item._id.toString() === id) {
        item.status = status;
        console.log(item._id);
      }
    });
    await seller.save();

    buyer.productArr.forEach((item) => {
      if (
        item.product._id.toString() === pid &&
        item.status === "Not Process"
      ) {
        item.status = status;
      }
    });

    const orderUpdated = await buyer.save();

    res.status(200).send({
      message: "Changed the status of the order successfully",
      orderUpdated,
    });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

//! we will get a particular status data

export const getStatus = async (req, res) => {
  try {
    const id = req.user._id;
    const { status } = req.params;
    console.log(status);
    const data = await adminOrderModel
      .findOne({ seller: id })
      .populate({
        path: "products.product",
        select: "-photo",
      })
      .populate({
        path: "products.buyer",
        select: "name",
      });
    console.log(data.products);

    const filteredData = data.products.filter((item) => {
      return item.status === status;
    });

    console.log(filteredData);
    res.send({ filteredData });
  } catch (error) {
    console.log(error);
  }
};

export const getStatusCount = async (req, res) => {
  try {
    const id = req.user._id;
    const Not_processed = await adminOrderModel.findOne({ seller: id });
    const Processing = await adminOrderModel.findOne({ seller: id });
    const Shipped = await adminOrderModel.findOne({ seller: id });
    const Delivered = await adminOrderModel.findOne({ seller: id });
    const Cancelled = await adminOrderModel.findOne({ seller: id });

    const l1 = Not_processed.products.filter((item) => {
      return item.status === "Not Process";
    });

    const l2 = Processing.products.filter((item) => {
      return item.status === "Processing";
    });
    const l3 = Shipped.products.filter((item) => {
      return item.status === "Shipped";
    });
    const l4 = Delivered.products.filter((item) => {
      return item.status === "Delivered";
    });
    const l5 = Cancelled.products.filter((item) => {
      return item.status === "Cancelled";
    });

    const namesArr = [
      "Not_processed",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];
    const valuesArr = [l1.length, l2.length, l3.length, l4.length, l5.length];

    res.status(200).send({
      namesArr,
      valuesArr,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getIndividualProductsCount = async (req, res) => {
  try {
    const id = req.user._id;

    const data = await adminOrderModel.findOne({ seller: id }).populate({
      path: "products.product",
      select: "-photo",
    });

    console.log(data);

    const productsByCount = {};
    for (const item of data.products) {
      const key = item.product.name;

      const quantity = parseInt(item.quantity);

      if (!productsByCount[key]) {
        productsByCount[key] = quantity;
      } else {
        productsByCount[key] = productsByCount[key] + quantity;
      }
    }

    const productNames = [];
    const productCount = [];

    for (const key in productsByCount) {
      productNames.push(key);
      productCount.push(productsByCount[key]);
    }
    res.status(200).send({
      productNames,
      productCount,
    });
  } catch (error) {
    console.log(error);
  }
};

export const adminProfileDetails = async (req, res) => {
  try {
    const id = req.user._id;

    const products = await productModel.find({ seller: id });

    const adminOrders = await adminOrderModel.findOne({ seller: id }).populate({
      path: "products.product",
      select: "-photo",
    });
    let amount = 0;
    adminOrders.products.forEach((item) => {
      amount = amount + item.product.price * parseInt(item.quantity);
    });

    res.status(200).send({
      productsCount: products.length,
      ordersCount: adminOrders.products.length,
      amount,
    });
  } catch (error) {
    console.log(error);
  }
};

export const brainTreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

export const brainTreePaymentController = async () => {
  console.log("working");
};

// admin ordrer

// export const placeAdminOrder = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const cartItems = await userModel.findById(userId).populate("cart");

//     // Group products by seller (trader)
//     const productsBySeller = {};

//     cartItems.cart.forEach((item) => {
//       const sellerId = item.seller; // Assuming each product has a 'seller' field referencing the seller's ID
//       if (!productsBySeller[sellerId]) {
//         productsBySeller[sellerId] = [];
//       }
//       productsBySeller[sellerId].push({
//         product: item._id,
//         buyer: userId,
//       });
//     });

//     console.log(productsBySeller);

//     // Create or update admin order documents for each seller
//     const adminOrders = [];
//     for (const sellerId in productsBySeller) {
//       let adminOrder = await adminOrderModel.findOne({ seller: sellerId });

//       if (!adminOrder) {
//         // If admin order doesn't exist for this seller, create a new one
//         adminOrder = new adminOrderModel({
//           seller: sellerId,
//           products: productsBySeller[sellerId],
//         });
//       } else {
//         // If admin order exists, push new products to existing products array from cart we did loop bcoz the cart can contain multiple items
//         productsBySeller[sellerId].forEach((product) => {
//           adminOrder.products.push(product);
//         });
//       }

//       await adminOrder.save();
//       adminOrders.push(adminOrder);
//     }

//     // Respond with success message
//     res
//       .status(200)
//       .json({ message: "Admin orders placed successfully", adminOrders });
//   } catch (error) {
//     console.error("Error placing admin orders:", error);
//     res.status(500).json({ error: "Failed to place admin orders" });
//   }
// };
