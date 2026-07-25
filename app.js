const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/database");
const invoiceRoutes = require("./routes/invoiceRoutes");

connectDB();

const app = express();

app.use(cors({
    origin: [
        "http://localhost:5500",
        "https://vendor-invoice-client.vercel.app"
    ]
}));

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Vendor Invoice API Running 🚀");
});

app.use("/api/invoices", invoiceRoutes);

module.exports = app;