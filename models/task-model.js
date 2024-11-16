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
        column: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ColumnModel"
        },
        position: {
            type: Number,
            required: true
        },
        assignees: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserModel'
        }],
    },
    { timestamps: true },
)

export default mongoose.model("TaskModel", TaskSchema)