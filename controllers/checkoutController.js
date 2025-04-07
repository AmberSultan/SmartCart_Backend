import checkoutModel from '../models/checkoutModel.js';
import cartModel from '../models/cartModel.js';
import mongoose from 'mongoose';

// Create a new checkout order
export const createCheckout = async (req, res) => {
  try {
    const {
      userId,
      deliveryAddress,
      deliveryOption,
      personalInfo,
      paymentOption,
      orderDetails,
    } = req.body;

    if (
      !userId ||
      !deliveryAddress?.addressDetails ||
      !personalInfo?.name ||
      !personalInfo?.email ||
      !personalInfo?.phone ||
      !orderDetails?.items ||
      !orderDetails?.subtotal ||
      !orderDetails?.totalPrice
    ) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid userId format' });
    }

    if (!orderDetails.items.length) {
      const cart = await cartModel.find({ userId });
      if (!cart.length) {
        return res.status(400).json({ message: 'Cart is empty' });
      }
      orderDetails.items = cart.map(item => ({
        dishName: item.dishName,
        price: item.totalCost,
      }));
      orderDetails.subtotal = cart.reduce((acc, item) => acc + item.totalCost, 0);
      orderDetails.totalPrice =
        orderDetails.subtotal +
        (orderDetails.serviceFee || 10) +
        (orderDetails.packagingFee || 25);
    }

    const checkout = new checkoutModel({
      userId,
      deliveryAddress: {
        addressType: deliveryAddress.addressType || 'Home',
        addressDetails: deliveryAddress.addressDetails,
        riderNote: deliveryAddress.riderNote || '',
      },
      deliveryOption: {
        deliveryType: deliveryOption?.deliveryType || 'Standard Delivery',
        estimatedTime: deliveryOption?.estimatedTime || '10-20 mins',
      },
      personalInfo: {
        name: personalInfo.name,
        email: personalInfo.email,
        phone: personalInfo.phone,
      },
      paymentOption: {
        paymentMethod: paymentOption?.paymentMethod || 'Cash on Delivery',
      },
      orderDetails: {
        items: orderDetails.items,
        subtotal: orderDetails.subtotal,
        serviceFee: orderDetails.serviceFee || 10,
        packagingFee: orderDetails.packagingFee || 25,
        totalPrice: orderDetails.totalPrice,
      },
      orderStatus: 'Pending', // Default status
    });

    await checkout.save();
    await cartModel.deleteMany({ userId });

    res.status(201).json({ message: 'Checkout successful', checkout });
  } catch (error) {
    console.error('Error during checkout:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get all checkout orders for a user
export const getUserCheckouts = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid userId format' });
    }

    const checkouts = await checkoutModel.find({ userId }).sort({ createdAt: -1 });

    if (!checkouts.length) {
      return res.status(404).json({ message: 'No checkout orders found for this user' });
    }

    res.status(200).json({ checkouts });
  } catch (error) {
    console.error('Error fetching user checkouts:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get all checkout orders (for admin dashboard)
export const getAllCheckouts = async (req, res) => {
  try {
    const checkouts = await checkoutModel.find();
    if (!checkouts || checkouts.length === 0) {
      return res.status(200).json({ 
        message: 'No checkout orders found', 
        checkouts: [] 
      });
    }
    res.status(200).json({ 
      message: 'Checkout orders retrieved successfully', 
      checkouts 
    });
  } catch (error) {
    console.error('Error fetching all checkouts:', error);
    res.status(500).json({ message: 'Server error while fetching checkout orders', error: error.message });
  }
};

// Get a single checkout order by ID
export const getCheckoutById = async (req, res) => {
  try {
    const { checkoutId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(checkoutId)) {
      return res.status(400).json({ message: 'Invalid checkoutId format' });
    }

    const checkout = await checkoutModel.findById(checkoutId);

    if (!checkout) {
      return res.status(404).json({ message: 'Checkout order not found' });
    }

    res.status(200).json({ checkout });
  } catch (error) {
    console.error('Error fetching checkout by ID:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update a checkout order
export const updateCheckout = async (req, res) => {
  try {
    const { checkoutId } = req.params;
    const { deliveryAddress, deliveryOption, personalInfo, paymentOption, orderStatus } = req.body;

    if (!mongoose.Types.ObjectId.isValid(checkoutId)) {
      return res.status(400).json({ message: 'Invalid checkoutId format' });
    }

    const checkout = await checkoutModel.findById(checkoutId);
    if (!checkout) {
      return res.status(404).json({ message: 'Checkout order not found' });
    }

    if (deliveryAddress) {
      checkout.deliveryAddress = { ...checkout.deliveryAddress, ...deliveryAddress };
    }
    if (deliveryOption) {
      checkout.deliveryOption = { ...checkout.deliveryOption, ...deliveryOption };
    }
    if (personalInfo) {
      checkout.personalInfo = { ...checkout.personalInfo, ...personalInfo };
    }
    if (paymentOption) {
      checkout.paymentOption = { ...checkout.paymentOption, ...paymentOption };
    }
    if (orderStatus) {
      checkout.orderStatus = orderStatus;
    }

    await checkout.save();

    res.status(200).json({ message: 'Checkout updated successfully', checkout });
  } catch (error) {
    console.error('Error updating checkout:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete a checkout order
export const deleteCheckout = async (req, res) => {
  try {
    const { checkoutId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(checkoutId)) {
      return res.status(400).json({ message: 'Invalid checkoutId format' });
    }

    const checkout = await checkoutModel.findByIdAndDelete(checkoutId);
    if (!checkout) {
      return res.status(404).json({ message: 'Checkout order not found' });
    }

    res.status(200).json({ message: 'Checkout order deleted successfully', checkout });
  } catch (error) {
    console.error('Error deleting checkout:', error);
    res.status(500).json({ message: error.message });
  }
};