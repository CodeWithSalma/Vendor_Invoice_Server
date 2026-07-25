const InvoiceBatch = require("../models/InvoiceBatch");

const submitInvoices = async (req, res) => {

    try {

        const batch = new InvoiceBatch(req.body);

        await batch.save();

        res.status(201).json({
            success: true,
            message: "Invoices berhasil disimpan."
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// =========================
// GET ALL
// =========================

const getInvoices = async (req, res) => {

    try {

        const invoices = await InvoiceBatch.find().sort({
            createdAt: -1
        });

        res.json(invoices);

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

module.exports = {

    submitInvoices,
    getInvoices

};