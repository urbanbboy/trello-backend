import mongoose from 'mongoose';


const ColumnSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    boardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BoardModel'
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TaskModel'
    }],
    order: {
        type: Number,
        required: true
    }
},
    { timestamps: true }
)

export default mongoose.model("ColumnModel", ColumnSchema)