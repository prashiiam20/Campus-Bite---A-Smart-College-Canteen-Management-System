import React, { useEffect, useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
//import { updatePaymentStatus } from '../services/api';

function PaymentPage () {
  const { token } = useAuth();
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);
  const { amount, paymentMethod } = location.state || {};


  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      if (paymentMethod === 'cash-on-pickup') {
        navigate(`/orders/${orderId}`);
      } else {
        setTimeout(async () => {
          await updatePaymentStatus(token ?? '', Number(orderId), 'Paid');
          navigate(`/orders/${orderId}`);
        }, 2000);
      }
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  useEffect(() => {
    if (!paymentMethod) navigate('/products');
  }, [paymentMethod]);

  return (
    <PayPalScriptProvider options={{ clientId: "AQGF87VItQaiLSMKTKGlv49pYLb2ljPqEsKfo6xA7qOaYPcSoA_1q9iS8-xkbScDN3hcGPyAMu8n5l8q&currency=USD" }}>
      <div className="max-w-3xl mx-auto py-16 text-center">
        <h1 className="text-3xl font-bold mb-8">Payment for Order #{orderId}</h1>
        <p className="text-lg mb-8">Payment Method: {paymentMethod}</p>

        {paymentMethod === 'cash-on-pickup' ? (
          <button
            onClick={handlePayment}
            className="px-6 py-3 rounded bg-black text-white hover:bg-gray-800"
          >
            Confirm Cash on Pickup
          </button>
        ) : (
          <div style={{marginLeft: '350px'}}>
          <PayPalButtons
            style={{ layout: 'vertical', }}
            createOrder={(data, actions) => {
                if (!actions.order) {
                  console.error("PayPal actions.order is undefined.");
                  return Promise.reject();
                }
                return actions.order.create({
                  intent: "CAPTURE", // 👈 required field!
                  purchase_units: [
                    {
                      amount: {
                        currency_code: "USD",
                        value: amount ? amount.toString() : "0",
                      },
                    },
                  ],
                });
              }}
              
             onApprove={(data, actions) => {
              if (!actions.order) {
                console.error("PayPal actions.order is undefined.");
                return Promise.reject();
              }
              return actions.order.capture().then(() => {
                navigate(`/orders/${orderId}`);
              });
            }}
          />
          </div>
        )}
      </div>
    </PayPalScriptProvider>
  );
};

export default PaymentPage;
