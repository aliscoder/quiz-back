import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface TourInterface extends Document {
  type: number;
  start: number;
  end: number;
  image: string;
  avatars: string[];
}

const tourSchema: Schema = new mongoose.Schema<TourInterface>({
  type: {
    type: Number,
    required: true,
  },
  start: {
    type: Number,
    required: true,
  },
  end: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  avatars: {
    type: [String],
    required: true,
  },
});

//@ts-ignore
const Tour: Model<TourInterface> = mongoose.model("Tour", tourSchema);

export default Tour;
