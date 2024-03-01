export const placeOrder = async (req, res) => {
  try {
    const orderData = req.body.orderData;

    console.log(orderData);
    let userId = req.user._id;
    const cartItems = await userModel.findById(userId).populate({
      path: "cart",
      select: "-photo",
    });

    for (const item of orderData) {
      let id = item.productId;
      await productModel.findByIdAndUpdate(id, { $inc:{inStock:-(item.quantity)}  });
    }

    const products = cartItems.cart.map((item, index) => ({
      product: item._id,
      // buyer: userId, // Adding buyer ID to each product object
      status: "Not Process",
      quantity: req.body.orderData[index].quantity,
    }));

    const buyerExists = await orderModel.findOne({ buyer: userId });
    if (buyerExists) {
      //! here we are pushing individuals objects into productArr
      for (const product of products) {
        buyerExists.productArr.push(product);
      }
      await buyerExists.save();
    } else {
      const order = new orderModel({
        buyer: userId,
        productArr: products,
      });

      await order.save();
    }

    // // console.log(buyerExists)
    // //! Now we have placed an order and stored it in orderModel. Next, we need to store this order in adminOrderModel, where there will be a seller with associated products and associated buyer.

    // //! Task 1: Mapping products by seller
    // const productsBySeller = {};

    // cartItems.cart.forEach((item) => {
    //   const sellerId = item.seller;
    //   if (!productsBySeller[sellerId]) {
    //     productsBySeller[sellerId] = [];
    //   }
    //   productsBySeller[sellerId].push({
    //     product: item._id,
    //     buyer: userId,
    //     status: "Not Process",
    //     quantity:item.quantity

    //   });
    // });

    // console.log(productsBySeller);

    // Assuming quantity data is in req.body.orderData

    // Map over the orderData and group products by seller
    const productsBySeller = {};
    for (const item of orderData) {
      const productId = item.productId;

      // Retrieve the product from the database to get the seller ID
      const product = await productModel.findById(productId);
      // if (!product) {
      //   console.error(`Product with ID ${productId} not found.`);
      //   continue; // Skip to the next item if product not found
      // }

      const sellerId = product.seller; // Assuming seller ID is stored in the product document

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

    // console.log(productsBySeller);

    // //! Task 2: Storing in the database
    for (const sellerId in productsBySeller) {
      let adminOrder = await adminOrderModel.findOne({ seller: sellerId });

      if (!adminOrder) {
        adminOrder = new adminOrderModel({
          seller: sellerId,
          products: productsBySeller[sellerId],
        });
      } else {
        productsBySeller[sellerId].forEach((product) => {
          adminOrder.products.push(product);
        });
      }

      await adminOrder.save();

      //! After the order is saved in orderModel and adminModel, now we have to empty the cart

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