import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import '../css/OrderSubmissionPage.css'; // Assuming you have a separate CSS file

function OrderSubmissionPage() {
  const { uniqueLink } = useParams();
  const [error, setError] = useState('');
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    customerName: '',
    address: '',
    phoneNumber: '',
    email: '',
    paymentAmount: '',
    orderSpecification: '',
    uniqueLink: uniqueLink
  });

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return regex.test(email);
  };

  // const formatPhoneNumber = (value) => {
  //   if (!value) return value;
  //   const phoneNumber = value.replace(/[^\d]/g, '');
  //   if (phoneNumber.length < 4) return phoneNumber;
  //   if (phoneNumber.length < 7) {
  //     return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
  //   }
  //   return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  // };

  // useEffect(() => {
  //   setOrderDetails(prevState => ({
  //     ...prevState,
  //     phoneNumber: formatPhoneNumber(prevState.phoneNumber)
  //   }));
  // }, [orderDetails.phoneNumber]);

  const handleChange = (e) => {
    if (e.target.name === "orderSpecification") {
      setOrderDetails({ ...orderDetails, [e.target.name]: e.target.value });
    } else {
      setOrderDetails({ ...orderDetails, [e.target.name]: e.target.value.trim() });
    }
  };

  const handleAddressChange = (address) => {
    // Ensure that we're setting a string in the state, not an object.
    // If the component returns an object, you might need to use address.description.
    setOrderDetails({ ...orderDetails, address: address.label});
  };

  const handlePhoneNumberChange = (e) => {
    setOrderDetails({ ...orderDetails, phoneNumber: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { phoneNumber, email, customerName, address, paymentAmount } = orderDetails;
    console.log(address)
    if (!phoneNumber.trim() || !email.trim() || !customerName.trim() || !address.trim() || !paymentAmount.toString().trim()) {      setError('Please fill in all required fields');
      return;
    }

    if (!validateEmail(orderDetails.email)) {
      setError('Invalid email format');
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

      await axios.request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
          setOrderSubmitted(true);
        });
    } catch (error) {
      console.error('Error submitting order', error);
      setError('Failed to submit the order');
    }
  };

  if (orderSubmitted) {
    return (
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p>Order submitted successfully!</p>
        <p>Reload to submit another order</p>
        {/* <button onClick={() => history.push(`/order/${uniqueLink}`)}>Would you like to submit another order?</button> */}
      </div>
    );
  }



  return (
    <div className="order-submission-container">
      <form onSubmit={handleSubmit} className="order-form">
        {error && <p className="error">{error}</p>}
        <div className="form-group">
          <label>Name:</label>
          <input type="text" name="customerName" value={orderDetails.customerName} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Address:</label>
          <GooglePlacesAutocomplete
            apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
            selectProps={{
              value: orderDetails.address.label,
              onChange: handleAddressChange,
            }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number:</label>
          <input
            id="phoneNumber"
            type="tel"
            name="phoneNumber"
            value={orderDetails.phoneNumber}
            onChange={handlePhoneNumberChange}
            placeholder="+12345678900"
            className="phone-input"
          />
        </div>
        <div className="form-group">
          <label>Email Address:</label>
          <input type="email" name="email" value={orderDetails.email} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Payment Amount:</label>
          <input type="number" name="paymentAmount" value={orderDetails.paymentAmount} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Order Specification:</label>
          <textarea name="orderSpecification" value={orderDetails.orderSpecification} onChange={handleChange} />
        </div>
        <button type="submit" className="submit-button">Submit Order</button>
      </form>
    </div>
  );
}

export default OrderSubmissionPage;
