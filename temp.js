import { useEffect, useState } from "react";
import Layout from "../../src/components/layout/Layout";
import axios from "axios";
import DropIn from "braintree-web-drop-in-react";
import { useAuth } from "../../src/context/Auth";
const CheckOut = () => {
  const [auth] = useAuth();
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState(null);

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

  const handlePayment = async () => {
    try {
      const { nonce } = await instance.requestPaymentMethod();
      const response = await axios.post(
        "http://localhost:8080/api/v1/product/braintree/payment",
        { nonce },
        {
          headers: {
            Authorization: auth.token,
          },
        }
      );
      console.log("working");
      console.log(response);
      

      localStorage.removeItem("__paypal_storage__");
    } catch (error) {
      console.log("----------ERROR-------------");
      console.log(error);
    }
  };

  return (
    <Layout>
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
        <button onClick={handlePayment}>Make payment</button>
      </div>
    </Layout>
  );
};

export default CheckOut;




//!------------------------


export const brainTreePaymentController = async (req,res) => {

  const {nonce}=req.body;

  console.log(nonce);
  try
  {
    let transactionResponse = await gateway.transaction.sale({
      amount: 1,
      paymentMethodNonce: nonce,
      options: {
        submitForSettlement: true,
      },
    });
  
    console.log(transactionResponse);
      res.status(200).send({transactionResponse});
  }
  catch(error)
  {
    console.log(error);
  }

};