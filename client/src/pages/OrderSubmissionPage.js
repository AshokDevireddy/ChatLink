import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';

function OrderSubmissionPage() {
  const { uniqueLink } = useParams();
  const history = useHistory();
  const [error, setError] = useState('');
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    customerName: '',
    address: '',
    paymentAmount: '',
    orderSpecification: '',
    uniqueLink: uniqueLink
  });

  const resetAndRedirect = () => {
    setOrderDetails({
      customerName: '',
      address: '',
      paymentAmount: '',
      orderSpecification: '',
      uniqueLink: uniqueLink
    });
    setError('');
    setOrderSubmitted(false);
    history.push(`/order/${uniqueLink}`);
  };

    const handleChange = (e) => {
      setOrderDetails({ ...orderDetails, [e.target.name]: e.target.value });
    };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!orderDetails.customerName || !orderDetails.address || !orderDetails.paymentAmount) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      let data = JSON.stringify(orderDetails);

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:5001/order/submit',
        headers: {
          'Content-Type': 'application/json'
        },
        data : data
      };

      axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setOrderSubmitted(true);

      })

      // Handle successful order submission
    } catch (error) {
      console.log('Error submitting order', error);
      setError('Failed to submit the order');
    }
  };

  if (orderSubmitted) {

    return (
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p>Order submitted successfully!</p>
        <button onClick={resetAndRedirect}>Would you like to submit another order?</button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <form onSubmit={handleSubmit} style={{ width: '300px' }}>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div>
          <label>Name:</label>
          <input type="text" name="customerName" value={orderDetails.customerName} onChange={handleChange} />
        </div>
        <div>
          <label>Address:</label>
          <input type="text" name="address" value={orderDetails.address} onChange={handleChange} />
        </div>
        <div>
          <label>Payment Amount:</label>
          <input type="number" name="paymentAmount" value={orderDetails.paymentAmount} onChange={handleChange} />
        </div>
        <div>
          <label>Order Specification:</label>
          <textarea name="orderSpecification" value={orderDetails.orderSpecification} onChange={handleChange} />
        </div>
        <button type="submit">Submit Order</button>
      </form>
    </div>
  );
}

export default OrderSubmissionPage;
