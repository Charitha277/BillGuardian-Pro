require('dotenv').config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

/* 🔗 CONNECT TO MONGODB ATLAS */
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

/* 📦 SCHEMA */
const BillSchema = new mongoose.Schema({
    totalBilled: Number,
    totalOvercharge: Number,
    fraudScore: Number,
    riskLevel: String,
    reasons: [String],
    itemsWithStatus: Array,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Bill = mongoose.model("Bill", BillSchema);

/* 🏠 HOME ROUTE */
app.get("/", (req, res) => {
    res.send("Backend is running 🚀");
});

/* 📥 SAVE BILL */
app.post("/save-bill", async (req, res) => {
    try {
        const newBill = new Bill(req.body);
        await newBill.save();

        res.json({
            message: "Saved to MongoDB Atlas"
        });

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

/* 📤 GET ALL BILLS */
app.get("/bills", async (req, res) => {
    try {
        const bills = await Bill.find().sort({ createdAt: -1 });

        res.json(bills);

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

/* 🚀 SERVER */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});