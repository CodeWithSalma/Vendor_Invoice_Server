const mongoose = require("mongoose");

const invoiceItemSchema = new mongoose.Schema({

    invoiceNo: {

        type: String,

        required: true

    },

    invoiceDate: {

        type: String

    },

    description: {

        type: String

    },

    qty: {

        type: Number,

        required: true

    },

    unitPrice: {

        type: Number,

        required: true

    },

    total: {

        type: Number,

        required: true

    },

    status: {

        type: String,

        enum: ["Belum Bayar", "Lunas"],

        default: "Belum Bayar"

    }

});

const invoiceBatchSchema = new mongoose.Schema({

    vendorName: {

        type: String,

        required: true

    },

    invoices: [invoiceItemSchema],

    createdAt: {

        type: Date,

        default: Date.now

    }

});

module.exports = mongoose.model("InvoiceBatch", invoiceBatchSchema);