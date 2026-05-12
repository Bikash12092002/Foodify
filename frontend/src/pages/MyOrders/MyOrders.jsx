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
                {order.status === "Food Processing" ? (
                    <button onClick={() => handleCancel(order._id)} className="cancel-btn" style={{backgroundColor: '#FFE1E1', color: 'red', border: '1px solid red'}}>
                        Cancel Order
                    </button>
                ) : (
                    <button>Track Order</button>
                )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MyOrders
