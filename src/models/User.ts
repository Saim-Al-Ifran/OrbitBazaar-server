import mongoose, { CallbackError, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { IUser } from '../types/models/User';

// User Schema
const UserSchema: Schema = new Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firebaseUID: {
        type: String,  
    },
    phoneNumber: {
        type: String,
        required: true
    },
    role: {
      type: String,
      enum: ['user', 'vendor', 'admin', 'super-admin'],
      default: 'user',
    },
    status: {
      type: String,
      enum: ['block','active'],
      default: 'active',
    },
    vendorRequestStatus: {
      type: String,
      enum: ['none', 'requested', 'approved', 'declined'],
      default: 'none',
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    refreshTokens: [
        {
         token: String,
        }
      ]
  },
 
  { timestamps: true }
);

// Pre-save hook to hash the password before saving
UserSchema.pre<IUser>('save', async function (next: (err?: CallbackError) => void) {
  if (!this.isModified('password')) {
    return next(); 
  }

  try {
    const salt = await bcrypt.genSalt(10);  
    this.password = await bcrypt.hash(this.password, salt);  
    next();
  } catch (error) {
    next(error as CallbackError );
  }
});

// Compare password method for login
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Export User Model
export default mongoose.model<IUser>('User', UserSchema);
