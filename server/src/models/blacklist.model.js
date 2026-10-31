import mongoose from "mongoose";
const blackListSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, "Token is required to be blacklisted"]
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600 // Token will be removed after 1 hour
    }
});

const BlackList = mongoose.model('BlackList', blackListSchema);

export default BlackList;