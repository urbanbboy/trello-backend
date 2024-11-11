import mongoose from 'mongoose';


const ColumnSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    board: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BoardModel'
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TaskModel'
    }],
    position: {
        type: Number,
        required: true
    }
})

export default mongoose.model("ColumnModel", ColumnSchema)