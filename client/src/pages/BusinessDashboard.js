import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useHistory } from 'react-router-dom';
import '../css/BusinessDashboard.css'; // Assuming you have a separate CSS file



function BusinessDashboard() {
  const [orders, setOrders] = useState([]);
  const [userName, setUserName] = useState('');
  const [uniqueLink, setUniqueLink] = useState('');
  const { businessId, token, logout } = useContext(AuthContext);
  const history = useHistory();

  console.log("Rendering BusinessDashboard, businessId:", businessId);

  useEffect(() => {
    console.log("business dasboard token:", token)
    let config_user = {
      method: 'get',
      url: 'http://localhost:5001/user/details',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    axios.request(config_user)
      .then(response => {
        // console.log('Response:', response.data);
        setUserName(`${response.data.firstName} ${response.data.lastName}`);
        setUniqueLink(response.data.uniqueLink);


        // orders
        let config_order = {
          method: 'get',
          url: `http://localhost:5001/order/table/${response.data.uniqueLink}`,
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };
        return axios.request(config_order);

      })
      .then(response => {
        console.log('Response orders:', response.data);
        if (Array.isArray(response.data)) {
          const sortedOrders = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setOrders(sortedOrders);
        } else {
          setOrders([]); // Set to empty array if response is not an array
        }
      })
      .catch(error => {
        console.error('Error fetching user details:', error);
      });



  }, [token]);

  const isValidUPSTrackingNumber = (trackingNumber) => {
    return /^1Z[0-9A-Z]{16}$/.test(trackingNumber);
  };


  const handleLogout = () => {
    logout();
    history.push('/login');
  };

  const handleUpdateTrackingNumber = (orderId, trackingNumber) => {
    if (!isValidUPSTrackingNumber(trackingNumber)) {
      alert('Invalid UPS tracking number format.');
      return;
    }

    // Find the order to update
    const orderToUpdate = orders.find(order => order._id === orderId);
    if (!orderToUpdate) {
      console.error('Order not found');
      return;
    }

    // Set up your Axios config
    const config_patch = {
      method: 'patch',
      url: `http://localhost:5001/order/${orderId}`, // Update with your actual URL
      headers: {
        'Authorization': `Bearer ${token}`
      },
      data: {
        trackingNumber
      }
    };

    // Call your API to update the tracking number
    axios(config_patch)
      .then(response => {
        setOrders(orders.map(order => order._id === orderId ? { ...order, trackingNumber: response.data.trackingNumber } : order));
        // Now send the text message
        const config_text = {
          method: 'post',
          url: 'http://localhost:5001/user/send-text', // Update with your actual URL
          headers: {
            'Authorization': `Bearer ${token}`
          },
          data: {
            to: orderToUpdate.phoneNumber, // Ensure this is in E.164 formatting
            body: `Your order has been shipped. Tracking number: ${trackingNumber}`
          }
        };
        return axios(config_text);
      })
      .then(response => {
        console.log('Text message sent!', response.data);
      })
      .catch(error => {
        console.error('Error updating tracking number or sending text', error);
      });
  };

  const uniqueLinkURL = `http://localhost:3000/order/${uniqueLink}`;


  return (
    <div className="dashboard-container">
      <h1>Business Dashboard</h1>
      <div className="dashboard-header">
        {userName && <span>Welcome, {userName}</span>}
        {uniqueLink && (
          <div>
            Your unique link: <a href={uniqueLinkURL} target="_blank" rel="noopener noreferrer">{uniqueLinkURL}</a>
          </div>
        )}
        <button onClick={handleLogout}>Logout</button>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Address</th>
              <th>Phone Number</th>
              <th>Email</th>
              <th>Payment Amount</th>
              <th>Order Specification</th>
              <th>Tracking Number</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>{order.customerName}</td>
                <td>{order.address}</td>
                <td>{order.phoneNumber}</td>
                <td>{order.email}</td>
                <td>{order.paymentAmount}</td>
                <td>{order.orderSpecification}</td>
                <td>
                  <input
                    type="text"
                    value={order.trackingNumber || ''}
                    onChange={(e) => setOrders(orders.map(o => o._id === order._id ? { ...o, trackingNumber: e.target.value } : o))}
                  />
                </td>
                <td>
                  <button onClick={() => handleUpdateTrackingNumber(order._id, order.trackingNumber)}>Update</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


export default BusinessDashboard;
