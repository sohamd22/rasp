import mongoose, { Schema } from 'mongoose';

const messageSchema = new mongoose.Schema({
    sender: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    senderName: {
        type: String,
        required: true
    },
    chat: {
        type: Schema.Types.ObjectId,
        ref: 'Chat', 
        required: true
    },
    content: { 
        type: String, 
        required: true 
    }, 
    timestamp: { 
        type: Date, 
        default: Date.now 
    }
});

export default mongoose.model("Message", messageSchema);