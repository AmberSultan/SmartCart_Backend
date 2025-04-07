import mongoose, { Schema } from 'mongoose';

const CheckoutSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Reference to User model
      required: true,
    },
    storeLocation: {
      type: String,
      default: ' DHA phase4', 
    },
    deliveryAddress: {
      addressType: {
        type: String,
        default: 'Home',
      },
      addressDetails: {
        type: String,
        required: true,
      },
      riderNote: {
        type: String,
        default: '',
      },
    },
    deliveryOption: {
      deliveryType: {
        type: String,
        default: 'Standard Delivery',
      },
      estimatedTime: {
        type: String,
        default: '10-20 mins',
      },
    },
    personalInfo: {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
    },
    paymentOption: {
      paymentMethod: {
        type: String,
        enum: ['Cash on Delivery', 'Online Payment'], // Add more methods as needed
        default: 'Cash on Delivery',
      },
    },
    orderDetails: {
      items: [
        {
          dishName: {
            type: String,
            required: true,
          },
          price: {
            type: Number,
            required: true,
          },
        },
      ],
      subtotal: {
        type: Number,
        required: true,
      },
      serviceFee: {
        type: Number,
        default: 10,
      },
      packagingFee: {
        type: Number,
        default: 25,
      },
      totalPrice: {
        type: Number,
        required: true,
      },
    },
    orderStatus: {
      type: String,
      enum: ['Pending', 'Processing', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt
);

export default mongoose.model('Checkout', CheckoutSchema);