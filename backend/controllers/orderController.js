// import Stripe from "stripe";
// import orderModel from "../models/orderModel.js";
// import userModel from "../models/userModel.js";
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// // config variables
// const currency = "inr";
// const deliveryCharge = 50;
// const frontend_URL = 'https://food-delivery-frontend-ip98.onrender.com';
// // const frontend_URL = "http://localhost:5173"

// // Placing User Order for Frontend
// const placeOrder = async (req, res) => {

//     try {
//         const newOrder = new orderModel({
//             userId: req.body.userId,
//             items: req.body.items,
//             amount: req.body.amount,
//             address: req.body.address,
//         })
//         await newOrder.save();
//         await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

//         const line_items = req.body.items.map((item) => ({
//             price_data: {
//               currency: "inr",
//               product_data: {
//                 name: item.name
//               },
//               unit_amount: item.price*100*80
//                 // unit_amount: item.price*100*(80/80)
//             },
//             quantity: item.quantity
//           }))

//         line_items.push({
//             price_data:{
//                 currency:"inr",
//                 product_data:{
//                     name:"Delivery Charge"
//                 },
//                 unit_amount: 5*80*100
//                 // unit_amount: 5*100*(80/80)
//             },
//             quantity:1
//         })
        
//           const session = await stripe.checkout.sessions.create({
//             // success_url: `http://localhost:5173/verify?success=true&orderId=${newOrder._id}`,
//               success_url: `https://food-delivery-frontend-ip98.onrender.com/verify?success=true&orderId=${newOrder._id}`,
//             cancel_url: `http://localhost:5173/verify?success=false&orderId=${newOrder._id}`,
//             line_items: line_items,
//             mode: 'payment',
//           });
      
//           res.json({success:true,session_url:session.url});

//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: "Error" })
//     }
// }

// // Listing Order for Admin panel
// const listOrders = async (req, res) => {
//     try {
//         const orders = await orderModel.find({});
//         res.json({ success: true, data: orders })
//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: "Error" })
//     }
// }

// // User Orders for Frontend
// const userOrders = async (req, res) => {
//     try {
//         const orders = await orderModel.find({ userId: req.body.userId });
//         res.json({ success: true, data: orders })
//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: "Error" })
//     }
// }

// const updateStatus = async (req, res) => {
//     console.log(req.body);
//     try {
//         await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
//         res.json({ success: true, message: "Status Updated" })
//     } catch (error) {
//         res.json({ success: false, message: "Error" })
//     }

// }

// const verifyOrder = async (req, res) => {
//     const {orderId , success} = req.body;
//     try {
//         if (success==="true") {
//             await orderModel.findByIdAndUpdate(orderId, { payment: true });
//             res.json({ success: true, message: "Paid" })
//         }
//         else{
//             await orderModel.findByIdAndDelete(orderId)
//             res.json({ success: false, message: "Not Paid" })
//         }
//     } catch (error) {
//         res.json({ success: false, message: "Not  Verified" })
//     }

// }

// export { listOrders, placeOrder, updateStatus, userOrders, verifyOrder };


import Stripe from "stripe";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// config variables
const currency = "inr";
const deliveryCharge = 50;
const frontend_URL = 'https://foodify-frontend-a9kt.onrender.com';
 //const frontend_URL = "http://localhost:5173"

// Placing User Order for Frontend
const placeOrder = async (req, res) => {
    const { userId, items, amount, address, paymentMethod } = req.body;
    try {
        const newOrder = new orderModel({
            userId: userId,
            items: items,
            amount: amount,
            address: address,
            paymentMethod: paymentMethod // Save the payment method
        })
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        // Stripe expects amounts in paise (1 INR = 100 paise)
        if (paymentMethod === "cod") {
            // If COD, just send success. No Stripe needed.
            res.json({ success: true, message: "Order placed successfully (COD)" });
        } 
        else if (paymentMethod === "stripe") {
            // If Stripe, create the payment session
            const line_items = req.body.items.map((item) => ({
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: item.name
                    },
                    unit_amount: Math.round(item.price * 100)
                },
                quantity: item.quantity
            }))

        // Add delivery charge
        line_items.push({
            price_data: {
                currency: "inr",
                product_data: {
                    name: "Delivery Charge"
                },
                unit_amount: deliveryCharge * 100 // 50 INR in paise
            },
            quantity: 1
        })
        
        const session = await stripe.checkout.sessions.create({
            success_url: `${frontend_URL}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_URL}/verify?success=false&orderId=${newOrder._id}`,
            line_items: line_items,
            mode: 'payment',
            payment_method_types: ['card', 'upi'],
        });

        res.json({ success: true, session_url: session.url });
        }
        else {
            res.json({ success: false, message: "Invalid payment method" });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// Listing Order for Admin panel
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// User Orders for Frontend
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId });
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// backend/controllers/orderController.js

const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        
        // 1. Find the current order first
        const order = await orderModel.findById(orderId);

        // 2. BLOCK the update if the order is already cancelled
        if (order.status === "Cancelled") {
            return res.json({ 
                success: false, 
                message: "Cannot update status: This order is already cancelled and refunded." 
            });
        }

        // 3. Otherwise, proceed with the update
        await orderModel.findByIdAndUpdate(orderId, { status: status });
        res.json({ success: true, message: "Status Updated Successfully" });
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error updating status" });
    }
}

const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({ success: true, message: "Paid" })
        }
        else {
            await orderModel.findByIdAndDelete(orderId)
            res.json({ success: false, message: "Not Paid" })
        }
    } catch (error) {
        res.json({ success: false, message: "Not Verified" })
    }
}

// backend/controllers/orderController.js

const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.body;
        const order = await orderModel.findById(orderId);

        if (!order) {
            return res.json({ success: false, message: "Order not found" });
        }

        // Only allow cancellation if order is in a cancellable status (e.g., "Food Processing")
        if (order.status === "Food Processing") {
            
            // Check if payment was made via Stripe
            if (order.payment === true && order.paymentMethod === "stripe") {
                try {
                    // Create a refund using the PaymentIntent ID
                    const refund = await stripe.refunds.create({
                        payment_intent: order.paymentIntentId, // Retrieved from your orderModel
                        reason: 'requested_by_customer' // Optional reason
                    });
                    console.log("Refund successful:", refund.id);
                } catch (stripeError) {
                    console.error("Stripe Refund Error:", stripeError.message);
                    return res.json({ success: false, message: "Refund failed, please contact support" });
                }
            }

            // Update status in your database
            await orderModel.findByIdAndUpdate(orderId, { 
                status: "Cancelled", 
                payment: false // Reset payment status to reflect the refund
            });

            res.json({ success: true, message: "Order cancelled and refund initiated." });
        } else {
            res.json({ success: false, message: "Order cannot be cancelled at this stage." });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Server error during cancellation" });
    }
};

export { listOrders, placeOrder, updateStatus, userOrders, verifyOrder,cancelOrder };
