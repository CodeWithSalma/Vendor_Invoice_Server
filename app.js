const Invoice = require("./models/Invoice");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/database");

const invoiceRoutes = require("./routes/invoiceRoutes");

dotenv.config();

connectDB();

const express = require("express");
const app = express();

app.use(cors({

    origin: [

        "http://localhost:5500",

        "https://vendor-invoice-client.vercel.app"

    ]

}));

app.use(express.json());

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {

    res.send("Vendor Invoice API Running 🚀");

});

app.use("/api/invoices", invoiceRoutes);

const PORT = process.env.PORT || 8443;

module.exports = app;