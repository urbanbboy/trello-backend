import mongoose from 'mongoose';

const InviteTokenSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    inviteToken: {
        type: String,
        required: true
    },
    boardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BoardModel"
    },
    used: {
        type: Boolean,
    }
})

export default mongoose.model("InviteTokenModel", InviteTokenSchema)