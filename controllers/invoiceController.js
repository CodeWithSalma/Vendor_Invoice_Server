// const InvoiceBatch = require("../models/InvoiceBatch");

// const submitInvoices = async (req, res) => {

//     try {

//         const batch = new InvoiceBatch(req.body);

//         await batch.save();

//         res.status(201).json({
//             success: true,
//             message: "Invoices berhasil disimpan."
//         });

//     } catch (err) {

//         console.log(err);

//         res.status(500).json({
//             success: false,
//             message: err.message
//         });

//     }

// };

// // =========================
// // GET ALL
// // =========================

// const getInvoices = async (req, res) => {

//     try {

//         const invoices = await InvoiceBatch.find().sort({
//             createdAt: -1
//         });

//         res.json(invoices);

//     } catch (err) {

//         res.status(500).json({
//             success: false,
//             message: err.message
//         });

//     }

// };

// module.exports = {

//     submitInvoices,
//     getInvoices

// };

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
            pass: process.env.EMAIL_PASS,   // App Password Gmail (bukan password biasa)
        },
    });
};

// =========================
// GENERATE EMAIL HTML
// =========================

const generateEmailHTML = (vendorName, invoices, createdAt) => {

    const grandTotal = invoices.reduce((sum, inv) => sum + inv.total, 0);

    const rows = invoices.map((inv, i) => `
        <tr style="background-color: ${i % 2 === 0 ? "#f9f9f9" : "#ffffff"};">
            <td style="padding: 8px 12px; border: 1px solid #ddd;">${inv.invoiceNo}</td>
            <td style="padding: 8px 12px; border: 1px solid #ddd;">${inv.invoiceDate || "-"}</td>
            <td style="padding: 8px 12px; border: 1px solid #ddd;">${inv.description || "-"}</td>
            <td style="padding: 8px 12px; border: 1px solid #ddd; text-align: center;">${inv.qty}</td>
            <td style="padding: 8px 12px; border: 1px solid #ddd; text-align: right;">
                Rp ${inv.unitPrice.toLocaleString("id-ID")}
            </td>
            <td style="padding: 8px 12px; border: 1px solid #ddd; text-align: right;">
                Rp ${inv.total.toLocaleString("id-ID")}
            </td>
            <td style="padding: 8px 12px; border: 1px solid #ddd; text-align: center;">
                <span style="
                    background-color: ${inv.status === "Lunas" ? "#d4edda" : "#fff3cd"};
                    color: ${inv.status === "Lunas" ? "#155724" : "#856404"};
                    padding: 2px 8px;
                    border-radius: 4px;
                    font-size: 12px;
                    font-weight: bold;
                ">
                    ${inv.status}
                </span>
            </td>
        </tr>
    `).join("");

    return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"></head>
    <body style="font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0; background-color: #f4f4f4;">
        <div style="max-width: 750px; margin: 30px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">

            <!-- HEADER -->
            <div style="background-color: #1B2A41; padding: 24px 32px;">
                <h2 style="color: #ffffff; margin: 0;">📄 Invoice Submission</h2>
                <p style="color: #aab4c4; margin: 6px 0 0;">Vendor Invoice Portal</p>
            </div>

            <!-- BODY -->
            <div style="padding: 28px 32px;">
                <p style="font-size: 15px;">Invoice baru telah dikirim dan disimpan ke sistem.</p>

                <table style="width: 100%; border-collapse: collapse; margin-bottom: 8px;">
                    <tr>
                        <td style="padding: 6px 0; color: #666; width: 140px;">Vendor</td>
                        <td style="padding: 6px 0; font-weight: bold;">${vendorName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px 0; color: #666;">Tanggal Submit</td>
                        <td style="padding: 6px 0;">${new Date(createdAt).toLocaleString("id-ID", { dateStyle: "long", timeStyle: "short" })}</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px 0; color: #666;">Jumlah Invoice</td>
                        <td style="padding: 6px 0;">${invoices.length} item</td>
                    </tr>
                </table>

                <!-- TABEL INVOICE -->
                <h3 style="margin: 24px 0 12px; font-size: 15px; border-bottom: 2px solid #1B2A41; padding-bottom: 6px;">
                    Detail Invoice
                </h3>

                <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                    <thead>
                        <tr style="background-color: #1B2A41; color: #ffffff;">
                            <th style="padding: 10px 12px; border: 1px solid #ddd; text-align: left;">No Invoice</th>
                            <th style="padding: 10px 12px; border: 1px solid #ddd; text-align: left;">Tanggal</th>
                            <th style="padding: 10px 12px; border: 1px solid #ddd; text-align: left;">Deskripsi</th>
                            <th style="padding: 10px 12px; border: 1px solid #ddd; text-align: center;">Qty</th>
                            <th style="padding: 10px 12px; border: 1px solid #ddd; text-align: right;">Harga Satuan</th>
                            <th style="padding: 10px 12px; border: 1px solid #ddd; text-align: right;">Total</th>
                            <th style="padding: 10px 12px; border: 1px solid #ddd; text-align: center;">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows}
                    </tbody>
                </table>

                <!-- GRAND TOTAL -->
                <div style="text-align: right; margin-top: 16px;">
                    <span style="font-size: 15px; color: #666;">Grand Total: </span>
                    <span style="font-size: 18px; font-weight: bold; color: #1B2A41;">
                        Rp ${grandTotal.toLocaleString("id-ID")}
                    </span>
                </div>
            </div>

            <!-- FOOTER -->
            <div style="background-color: #f4f4f4; padding: 16px 32px; text-align: center; font-size: 12px; color: #999;">
                Email ini dikirim otomatis oleh Vendor Invoice Portal. Jangan balas email ini.
            </div>

        </div>
    </body>
    </html>
    `;
};

// =========================
// SEND EMAIL
// =========================

const sendInvoiceEmail = async (vendorName, invoices, createdAt) => {

    const transporter = createTransporter();

    const grandTotal = invoices.reduce((sum, inv) => sum + inv.total, 0);

    await transporter.sendMail({
        from: `"Vendor Invoice Portal" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_RECEIVER,        // email tujuan (tim finance/AP)
        subject: `[Invoice] ${vendorName} — ${invoices.length} item | Rp ${grandTotal.toLocaleString("id-ID")}`,
        html: generateEmailHTML(vendorName, invoices, createdAt),
    });

};

// =========================
// POST — SUBMIT INVOICES
// =========================

const submitInvoices = async (req, res) => {
    try {
        const batch = new InvoiceBatch(req.body);
        await batch.save();

        // Sementara: blocking untuk debug
        try {
            await sendInvoiceEmail(batch.vendorName, batch.invoices, batch.createdAt);
            console.log("Email sent OK");
        } catch (emailErr) {
            console.error("Email error detail:", emailErr.message);
        }

        res.status(201).json({
            success: true,
            message: "Invoices berhasil disimpan.",
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
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
