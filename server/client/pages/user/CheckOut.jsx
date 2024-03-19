import { useEffect, useState } from "react";
import Layout from "../../src/components/layout/Layout";
import { useAuth } from "../../src/context/Auth";
import axios from "axios";
import { useCart } from "../../src/context/Cart";
import { Select } from "antd";
import DropIn from "braintree-web-drop-in-react";

const CheckOut = () => {
  const [cartGlobal, setCartGlobal] = useCart();
  const [orderData, setOrderData] = useState();
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState("");
  const [total, setTotal] = useState(0);
  const [auth] = useAuth();

  const [orderDropDetails, setOrderDropDetails] = useState({
    country: "",
    houseadd: "",
    city: "",
    state: "",
    postcode: "",
  });

  const handleInput = (event) => {
    setOrderDropDetails((prev) => {
      return {
        ...prev,
        [event.target.name]: event.target.value,
      };
    });
  };

  useEffect(() => {
    setOrderData(cartGlobal);
    if (cartGlobal) {
      calculateTotal(cartGlobal.frontendCart);
    }
  }, []);

  useEffect(() => {
    const fetchClientToken = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/product/braintree/token"
        );
        setClientToken(response.data.clientToken);
      } catch (error) {
        console.error("Error fetching client token:", error);
      }
    };

    fetchClientToken();
  }, []);

  const handleInstance = (newInstance) => {
    setInstance(newInstance);
  };

  const PlaceOrder = async (event) => {


    try {

      event.preventDefault();

      if (!orderDropDetails.country) {
        return alert("country is required");
      }
      if (!orderDropDetails.houseadd) {
        return alert("houseadd is required");
      }
      if (!orderDropDetails.city) {
        return alert("city is required");
      }
      if (!orderDropDetails.state) {
        return alert("state is required");
      }
      if (!orderDropDetails.postcode) {
        return alert("postcode is required");
      }
      const { nonce } = await instance.requestPaymentMethod();


      const response = await axios.post(
        "http://localhost:8080/api/v1/product/place-order",
        { orderData: orderData.backendCart, orderDropDetails,nonce },
        {
          headers: {
            Authorization: auth.token,
          },
        }
      );
      alert(response.data.message);


      //! we have done this to clear our local Storage
      localStorage.removeItem("Globalcart");
      localStorage.removeItem("__paypal_storage__");

      window.location.reload();
    } catch (error) {
      if (error?.response?.data?.message) {
        alert(error.response.data.message);
      }
    }




  };

  

  const calculateTotal = (itemsArray) => {
    let totalAmount = 0;
    for (const item of itemsArray) {
      totalAmount += parseInt(item.price) * parseInt(item.quantity);
    }
    setTotal(totalAmount);
  };

  const getINR = (amount) => {
    const price = amount.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    });

    return price;
  };

  return (
    <Layout>
      <div className="checkout-container">
        <div className="checkout-title">
          <h2>Product Order Form</h2>
        </div>
        <div className="checkout-d-flex" style={{ height: "800px" }}>
          <form className="checkout-form">
            <label className="checkout-label">
              <span>
                Country <span className="checkout-required">*</span>
              </span>

              <Select
                name="country"
                showSearch
                className="w-50"
                optionFilterProp="children"
                onChange={(val) =>
                  setOrderDropDetails((prev) => {
                    return {
                      ...prev,
                      country: val,
                    };
                  })
                }
              >
                <Select.Option value="Afghanistan">Afghanistan</Select.Option>
                <Select.Option value="Åland Islands">
                  Åland Islands
                </Select.Option>
                <Select.Option value="Albania">Albania</Select.Option>
                <Select.Option value="Algeria">Algeria</Select.Option>
                <Select.Option value="American Samoa">
                  American Samoa
                </Select.Option>
                <Select.Option value="Andorra">Andorra</Select.Option>
              </Select>
            </label>
            <label className="checkout-label">
              <span>
                Street Address <span className="checkout-required">*</span>
              </span>
              <input
                className="checkout-input"
                type="text"
                name="houseadd"
                placeholder="House number and street name"
                required
                onChange={(event) => handleInput(event)}
              />
            </label>
            <label className="checkout-label">
              <span>&nbsp;</span>
              <input
                className="checkout-input"
                type="text"
                name="apartment"
                placeholder="Apartment, suite, unit etc. (Select.Optional)"
              />
            </label>
            <label className="checkout-label">
              <span>
                Town / City <span className="checkout-required">*</span>
              </span>
              <input
                className="checkout-input"
                type="text"
                name="city"
                onChange={(event) => handleInput(event)}
              />
            </label>
            <label className="checkout-label">
              <span>
                State <span className="checkout-required">*</span>
              </span>
              <input
                className="checkout-input"
                type="text"
                name="state"
                onChange={(event) => handleInput(event)}
              />
            </label>
            <label className="checkout-label">
              <span>
                Postcode / ZIP <span className="checkout-required">*</span>
              </span>
              <input
                className="checkout-input"
                type="text"
                name="postcode"
                onChange={(event) => handleInput(event)}
              />
            </label>
          </form>
          <div className="checkout-Yorder" style={{ height: "100%" }}>
            <table className="checkout-table">
              <tbody>
                <tr>
                  <th className="checkout-th" colSpan={2}>
                    Your order
                  </th>
                </tr>
                {orderData &&
                  orderData.frontendCart &&
                  orderData.frontendCart.map((item) => {
                    return (
                      <tr key={item._id}>
                        <td className="checkout-td">
                          {item.name} x {item.quantity}(Qty)
                        </td>
                        <td className="checkout-td">
                          {getINR(item.price * item.quantity)}
                        </td>
                      </tr>
                    );
                  })}

                <tr>
                  <td className="checkout-td">Subtotal</td>
                  <td className="checkout-td">{getINR(total)}</td>
                </tr>
                <tr>
                  <td className="checkout-td">Shipping</td>
                  <td className="checkout-td">Free shipping</td>
                </tr>
              </tbody>
            </table>

            <br />

            <div className="d-flex flex-column justify-content-between">
              <div>
                {clientToken && (
                  <DropIn
                    options={{
                      authorization: clientToken,
                      // paypal: {
                      //   flow: "vault",
                      // },
                    }}
                    onInstance={handleInstance}
                  />
                )}
              </div>
              <button
                className="checkout-button"
                type="button"
                onClick={(event)=>PlaceOrder(event)}
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckOut;
