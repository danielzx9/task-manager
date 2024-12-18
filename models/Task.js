const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,

    },
    completed: {
        type: Boolean,
        default: false,
    },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
    dueDate: {
        type: Date,
        required: false,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true, // Este campo es obligatorio
        ref: 'User' // Referencia al modelo de usuario
    },
    tags: {
        type: [String],
        required: false
    }
});

const Task = mongoose.model('Task', TaskSchema);
module.exports = Task;