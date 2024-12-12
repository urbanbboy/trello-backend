import mongoose from "mongoose";

const BoardSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "UserModel",
            required: true
        },
        members: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserModel',
        }],
        imageId: {
            type: String,
        },
        imageThumbUrl: {
            type: String
        },
        imageFullUrl: {
            type: String
        },
        imageUserName: {
            type: String
        },
        imageLinkHTML: {
            type: String,
        }
    },
    { timestamps: true },
)

export default mongoose.model('BoardModel', BoardSchema)