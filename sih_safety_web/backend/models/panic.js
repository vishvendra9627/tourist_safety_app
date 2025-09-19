import mongoose from "mongoose";

const LocationSchema = new mongoose.Schema({
  coordinates: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: {
      type: [Number],
      required: true // [lon, lat]
    }
  },
  state: String,
  city: String,
  district: String,
  place_id: String,
  type: String,
  detailed_address: String,
  postcode: String
}, { _id: false }); // prevent extra _id for each location

const PanicSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "DigitalId" },
  email: { type: String, required: true },
  name: { type: String, required: true },
  contact_number: { type: String, required: true },
  kyc: {
    aadhaar: {
      number: { type: String }
    },
    passport: {
      number: { type: String },
      country: { type: String }
    }
  },
  emergency_contacts: [
    {
      name: { type: String },
      phone: { type: String },
      relation: { type: String }
    }
  ],
  locations: [LocationSchema] // ✅ use subschema
}, { timestamps: true });

export default mongoose.model("Panic", PanicSchema);
