import { Schema, model } from "mongoose";
import { ICategory } from "../types/models/Category";
  
const categorySchema = new Schema<ICategory>(
  {
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
  },
  {
    timestamps: true, 
  }
);
 
const CategoryModel = model<ICategory>("Category", categorySchema);

export default CategoryModel;
