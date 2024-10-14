import { Schema, model, InferSchemaType } from "mongoose";

const suggestionSchema = new Schema(
  {
    hash: { type: String, required: false },  
    category: { type: String, required: true },  
    suggestion: { type: String, required: true },  
    dateTime: { type: String, required: true },  
    employeeId: { type: String, required: false },  
    status: { type: String, enum: ['read', 'unread'], default: 'unread' },
  },
  { timestamps: true }  
);

type Suggestions = InferSchemaType<typeof suggestionSchema>;

export default model<Suggestions>("Suggestions", suggestionSchema);