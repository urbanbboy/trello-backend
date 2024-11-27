import mongoose from "mongoose";

const BoardSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        // columns: [{
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: "ColumnModel"
        // }],
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "UserModel",
            required: true
        },
        members: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserModel',
        }]
    },
    { timestamps: true },
)

export default mongoose.model('BoardModel', BoardSchema)