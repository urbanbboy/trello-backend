import mongoose from 'mongoose';

const TaskSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
        },
        columnId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ColumnModel"
        },
        boardId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "BoardModel"
        },
        order: {
            type: Number,
            required: true
        },
        assignee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserModel'
        },
    },
    { timestamps: true },
)

export default mongoose.model("TaskModel", TaskSchema)