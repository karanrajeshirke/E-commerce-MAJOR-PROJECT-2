let newTransaction = await gateway.transaction.sale(
    {
      amount: totalAmount,
      paymentMethodNonce: nonce,
      options: {
        submitForSettlement: true,
      },
    },
    async function (err, result) {

      console.log(newTransaction);


      if (result) {
        const address = {
          country: orderDropDetails.country,
          houseadd: orderDropDetails.houseadd,
          city: orderDropDetails.city,
          state: orderDropDetails.state,
          postcode: orderDropDetails.postcode,
        };

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

        // let userId = req.user._id;

        // const user = await userModel.findById(userId);

        const formattedOrders = orderData.map((order) => ({
          product: order.productId,
          quantity: order.quantity,
          country: orderDropDetails.country,
          houseadd: orderDropDetails.houseadd,
          city: orderDropDetails.city,
          state: orderDropDetails.state,
          postcode: orderDropDetails.postcode,
        }));

        user.orders.push(formattedOrders);

        await user.save();

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
          let adminOrder = await adminOrderModel.findOne({
            seller: sellerId,
          });

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

        console.log(newTransaction);

        return res.status(200).send({
          message: "Order placed successfully",
        });
      } else {
        res.status(400).send({
          message: "Something went wrong in payment",
          err,
        });
      }
    }
  );