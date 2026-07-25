const express = require("express");

const router = express.Router();

const {

    submitInvoices,
    getInvoices

} = require("../controllers/invoiceController");

router.get("/", getInvoices);

router.post("/", submitInvoices);

module.exports = router;