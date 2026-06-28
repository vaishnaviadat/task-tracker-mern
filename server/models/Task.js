const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Task title is required"],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed'],
        default: 'Pending'
    }
}, { timestamps: true }); // यामुळे task कधी तयार झाली आणि कधी अपडेट झाली ती वेळ समजेल

module.exports = mongoose.model('Task', TaskSchema);