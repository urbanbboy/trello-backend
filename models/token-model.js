import mongoose, { Schema } from 'mongoose';

const TokenSchema = new mongoose.Schema({
    user: { type: Schema.Types.ObjectId, ref: "UserModel" },
    refreshToken: { type: String, required: true }
})

export default mongoose.model("TokenModel", TokenSchema)