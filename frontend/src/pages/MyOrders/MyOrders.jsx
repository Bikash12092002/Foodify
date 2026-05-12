import React, { useContext, useEffect, useState } from 'react'
import './MyOrders.css'
import axios from 'axios'
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';

const MyOrders = () => {
  
  const [data,setData] =  useState([]);
  const {url,token} = useContext(StoreContext);

  const fetchOrders = async () => {
    const response = await axios.post(url+"/api/order/userorders",{},{headers:{token}});
    setData(response.data.data)
  }

  const handleCancel = async (orderId) => {
    if (window.confirm("Are you sure you want to cancel and refund this order?")) {
        const response = await axios.post(url + "/api/order/cancel", { orderId }, { headers: { token } });
        if (response.data.success) {
            toast.success(response.data.message);
            fetchOrders(); // Refresh order list to show "Cancelled" status
        } else {
            toast.error(response.data.message);
        }
    }
  };

  useEffect(()=>{
    if (token) {
      fetchOrders();
    }
  },[token])

  return (
    <div className='my-orders'>
      <h2>My Orders</h2>
      <div className="container">
        {data.map((order,index)=>{
          return (
            <div key={index} className='my-orders-order'>
                <img src={assets.parcel_icon} alt="" />
                <p>{order.items.map((item,index)=>{
                  if (index === order.items.length-1) {
                    return item.name+" x "+item.quantity
                  }
                  else{
                    return item.name+" x "+item.quantity+", "
                  }
                  
                })}</p>
                <p>₹ {order.amount}.00</p>
                <p>Items: {order.items.length}</p>
                <p><span>&#x25cf;</span> <b>{order.status}</b></p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <button onClick={fetchOrders}>Track Order</button>
            
            {/* Show Cancel button only if the Admin hasn't moved the order past 'Food Processing' */}
            {order.status === "Food Processing" && (
                <button 
                    onClick={() => handleCancel(order._id)} 
                    style={{ backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Cancel Order
                </button>
            )}
        </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MyOrders
