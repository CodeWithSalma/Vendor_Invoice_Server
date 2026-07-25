const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema({
    invoiceNo: String,
    invoiceDate: Date,
    vendorName: String,
    description: String,
    qty: Number,
    unitPrice: Number,
    total: Number,
    status: String
}, {
    timestamps: true
});

module.exports = mongoose.model("Invoice", InvoiceSchema);