
//!---------------------------------------------------------
//!place an order
export const placeOrder = async (req, res) => {
    try {
      const orderData = req.body.orderData;
  
      console.log(orderData);
  
      if (!orderData.length) {
        return res.status(500).send({
          message: "Cart is empty cannot place order",
        });
      }
  
  
      let userId = req.user._id;
  
  
  
  
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