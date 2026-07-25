const Invoice = require("./models/Invoice");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/database");

const invoiceRoutes = require("./routes/invoiceRoutes");

connectDB();

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {

    res.send("Vendor Invoice API Running 🚀");

});

app.use("/api/invoices", invoiceRoutes);

const PORT = process.env.PORT || 8443;

app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

});