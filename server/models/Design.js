import mongoose, { Schema } from "mongoose";

// Define the design schema
const DesignSchema = new Schema({
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  code: {
    type: Number,
    default: 1,
    unique: true
  },
  folder: {
    type: String,
    required: true,
    unique: true
  },
  selectedCategory: {
    type: String,
    required: true,
  },
  selectedPage: {
    type: String,
    required: true,
  },
  designType: {
    type: String,
    required: true,
    enum: ['motor', 'smiley'],
    message: '{VALUE} is not a valid design type'
  },
  designInfo: {
    type: Schema.Types.Mixed,
    required: true
  },
  structure: {
    type: Schema.Types.Mixed,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware to update the updatedAt field on save
DesignSchema.pre('save', async function (next) {

  const design = this;
  design.updatedAt = Date.now();

  if (design.isNew) {
    try {
      // Find the highest code value in the collection
      const lastDesign = await mongoose.model('Design').findOne().sort({ code: -1 });

      // Set the code as 1 if there is no design yet, otherwise increment the last code by 1
      design.code = lastDesign ? lastDesign.code + 1 : 1;
    } catch (error) {
      return next(error);
    }
  }

  next();
});

export default mongoose.model('Design', DesignSchema);
