import mongoose from 'mongoose';


const TaskSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    desciption: {
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
    completed: {
        type: Boolean,
        default: false,
    },
    assignees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel'
    }],
    dueDate: {
        type: Date
    }
})

export default mongoose.model("TaskModel", TaskSchema)