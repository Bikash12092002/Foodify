

import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { StoreContext } from '../../Context/StoreContext';
import './PlaceOrder.css';

const PlaceOrder = () => {
    const [paymentMethod, setPaymentMethod] = useState("cod");

    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zipcode: "",
        country: "",
        phone: ""
    })

    const { getTotalCartAmount, token, food_list, cartItems, url, setCartItems } = useContext(StoreContext);

    const navigate = useNavigate();

    const onChangeHandler = (event) => {
        const name = event.target.name
        const value = event.target.value
        setData(data => ({ ...data, [name]: value }))
    }

    const placeOrder = async (e) => {
        e.preventDefault()
        if (!/^\d{10}$/.test(data.phone)) {
            toast.error("Phone number must be exactly 10 digits");
            return;
        }
        let orderItems = [];
        food_list.map(((item) => {
            if (cartItems[item._id] > 0) {
                let itemInfo = item;
                itemInfo["quantity"] = cartItems[item._id];
                orderItems.push(itemInfo)
            }
        }))
        let deliveryFee = getTotalCartAmount() === 0 ? 0 : 50;
        let orderData = {
            address: data,
            items: orderItems,
            amount: getTotalCartAmount() + deliveryFee,
            paymentMethod: paymentMethod
        }
        let response = await axios.post(url + "/api/order/place", orderData, { headers: { token } });
        if (response.data.success) {
        if (response.data.session_url) {
            // This was a Stripe payment, redirect to Stripe
            window.location.replace(response.data.session_url);
        }
        else {
            // This was a COD payment
            toast.success("Order Placed Successfully (Cash on Delivery)");
            setCartItems({}); // Clear the cart
            navigate("/myorders"); // Go to "My Orders" page
        }
    }
    else {
        toast.error("Something Went Wrong")
    }
}

    useEffect(() => {
        if (!token) {
            toast.error("to place an order sign in first")
            navigate('/cart')
        }
        else if (getTotalCartAmount() === 0) {
            navigate('/cart')
        }
    }, [token])

    return (
        <form onSubmit={placeOrder} className='place-order'>
            <div className="place-order-left">
                <p className='title'>Delivery Information</p>
                <div className="multi-field">
                    <input type="text" name='firstName' onChange={onChangeHandler} value={data.firstName} placeholder='First name' required />
                    <input type="text" name='lastName' onChange={onChangeHandler} value={data.lastName} placeholder='Last name' required />
                </div>
                <input type="email" name='email' onChange={onChangeHandler} value={data.email} placeholder='Email address' required />
                <input type="text" name='street' onChange={onChangeHandler} value={data.street} placeholder='Street' required />
                <div className="multi-field">
                    <input type="text" name='city' onChange={onChangeHandler} value={data.city} placeholder='City' required />
                    <input type="text" name='state' onChange={onChangeHandler} value={data.state} placeholder='State' required />
                </div>
                <div className="multi-field">
                    <input type="text" name='zipcode' onChange={onChangeHandler} value={data.zipcode} placeholder='Zip code' required />
                    <input type="text" name='country' onChange={onChangeHandler} value={data.country} placeholder='Country' required />
                </div>
                <input type="text" name='phone' onChange={onChangeHandler} value={data.phone} placeholder='Phone' required />
            </div>
            <div className="place-order-right">
                <div className="cart-total">
                    <h2>Cart Totals</h2>
                    <div>
                        <div className="cart-total-details"><p>Subtotal</p><p>₹ {getTotalCartAmount()}</p></div>
                        <hr />
                        <div className="cart-total-details"><p>Delivery Fee</p><p>₹ {getTotalCartAmount() === 0 ? 0 : 50}</p></div>
                        <hr />
                        <div className="cart-total-details"><b>Total</b><b>₹ {getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 50}</b></div>
                    </div>
                </div>
                <div className="payment-options">
                    <h3>Payment Method</h3>
                    <div className="payment-option">
                        <input type="radio" id="cod" name="payment" value="cod"
                            checked={paymentMethod === "cod"}
                            onChange={() => setPaymentMethod("cod")} />
                        <label htmlFor="cod">Cash on Delivery (COD)</label>
                    </div>
                    <div className="payment-option">
                        <input type="radio" id="stripe" name="payment" value="stripe"
                            checked={paymentMethod === "stripe"}
                            onChange={() => setPaymentMethod("stripe")} />
                        <label htmlFor="stripe">Pay Online (Stripe)</label>
                    </div>
                </div>
                <button className='place-order-submit' type='submit'>
                    {paymentMethod === "cod" ? "Place Order (COD)" : "Proceed To Payment"}
                </button>
            </div>
        </form>
    )
}

export default PlaceOrder
