const InvoiceBatch = require("../models/InvoiceBatch");
const nodemailer = require("nodemailer");

// =========================
// NODEMAILER TRANSPORTER
// =========================

const createTransporter = () => {
    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
};

// =========================
// SEND EMAIL (JSON format)
// =========================

const sendInvoiceEmail = async (vendorName, invoices, createdAt) => {

    const transporter = createTransporter();

    const grandTotal = invoices.reduce((sum, inv) => sum + inv.total, 0);

    const payload = {
        vendorName,
        submittedAt: new Date(createdAt).toISOString(),
        totalItems: invoices.length,
        grandTotal,
        invoices: invoices.map(inv => ({
            invoiceNo:   inv.invoiceNo,
            invoiceDate: inv.invoiceDate,
            description: inv.description,
            qty:         inv.qty,
            unitPrice:   inv.unitPrice,
            total:       inv.total,
            status:      inv.status,
        })),
    };

    await transporter.sendMail({
        from:    `"Vendor Invoice Portal" <${process.env.EMAIL_USER}>`,
        to:      process.env.EMAIL_RECEIVER,
        subject: `[Invoice] ${vendorName} — ${invoices.length} item | Rp ${grandTotal.toLocaleString("id-ID")}`,
        text:    JSON.stringify(payload, null, 2),
    });

};

// =========================
// POST — SUBMIT INVOICES
// =========================

const submitInvoices = async (req, res) => {

    try {
        // 1. Simpan ke database
        const batch = new InvoiceBatch(req.body);
        await batch.save();

        // 2. Kirim email (error email tidak gagalkan response)
        try {
            await sendInvoiceEmail(batch.vendorName, batch.invoices, batch.createdAt);
            console.log("Email sent OK for batch:", batch._id);
        } catch (emailErr) {
            console.error("Email failed (non-critical):", emailErr.message);
        }

        res.status(201).json({
            success: true,
            message: "Invoices berhasil disimpan.",
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }

};

// =========================
// GET ALL
// =========================

const getInvoices = async (req, res) => {

    try {
        const invoices = await InvoiceBatch.find().sort({ createdAt: -1 });
        res.json(invoices);
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }

};

module.exports = {
    submitInvoices,
    getInvoices,
};
