import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        username: {
            type: String,
            required: true,
            unique: true
        },
        image: {
            type: String,
        },
        password: {
            type: String,
            required: true
        }, 
        activationLink: {
            type: String,
        },
        isActivated: {
            type: Boolean,
        }
    },
    { timestamps: true },
)

export default mongoose.model('UserModel', UserSchema)