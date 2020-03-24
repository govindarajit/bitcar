/*
 * BitCar Server Core
 *
 * (C) 2018 mobytelab.com
 *
 */

const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema(
  {
    distance: {
      type: Number,
    },
    booking_status: {
      type: String,
      default: 'pending',
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    pickupAddress: {
      type: String,
    },
    dropAddress: {
      type: String,
    },
    approxPrice: {
      type: String,
    },
    approxDistance: {
      type: String,
    },
    rider_latitude: {
      type: String,
    },
    rider_longitude: {
      type: String,
    },
    seat_count: {
      type: Number,
      required: false,
    },
    total_fare: {
      type: String,
    },
    total_distance: {
      type: String,
    },
    note: {
      type: String,
    },
    payment_method: {
      type: String,
    },
    payment_type: {
      type: String,
      required: false,
    },
    rating: {
      type: Number,
    },
    pickupDate: {
      type: Date,
      required: false,
    },
    laterPickupDate: {
      type: Date,
      required: false,
    },
    requestId: {
      type: String,
    },
    latePickupDate: {
      type: Date,
      default: null,
    },
    actualPickuptime: {
      type: Date,
      default: null,
    },
    // rejection_reasons: [
    //   {
    //     rejected_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    //     message: { type: String },
    //     timestamp: { type: Number },
    //   },
    // ],
    cancellation_reason: {
      canceled_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      cancel_reason: { type: String },
      timestamp: { type: Number },
    },
    // created_by: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'User',
    // },
    estimate_time: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);

module.exports = mongoose.model('Trip', TripSchema);
