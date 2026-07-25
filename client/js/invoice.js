const tbody = document.getElementById("invoiceBody");
const addButton = document.getElementById("addInvoice");
const form = document.getElementById("invoiceForm");


// =======================
// Hitung Total
// =======================

function calculateTotals() {

    let grandTotal = 0;

    const rows = document.querySelectorAll("#invoiceBody tr");

    rows.forEach(row => {

        const qty = Number(row.querySelector(".qty").value) || 0;

        const price = Number(row.querySelector(".unitPrice").value) || 0;

        const total = qty * price;

        row.querySelector(".total").value =
            total.toLocaleString("id-ID");

        grandTotal += total;

    });

    document.getElementById("grandTotal").innerText =
        "Rp " + grandTotal.toLocaleString("id-ID");

    document.getElementById("invoiceCount").innerText =
        rows.length;

}


// =======================
// Event Qty & Price
// =======================

document.addEventListener("input", function (e) {

    if (
        e.target.classList.contains("qty") ||
        e.target.classList.contains("unitPrice")
    ) {

        calculateTotals();

    }

});


// =======================
// Add Row
// =======================

addButton.addEventListener("click", function () {

    const row = document.createElement("tr");

    row.innerHTML = `

<td>

<input class="form-control invoiceNo">

</td>

<td>

<input type="date"
class="form-control invoiceDate">

</td>

<td>

<input class="form-control description">

</td>

<td>

<input
type="number"
class="form-control qty"
value="1"
min="1">

</td>

<td>

<input
type="number"
class="form-control unitPrice">

</td>

<td>

<input
class="form-control total"
readonly>

</td>

<td>

<select class="form-select status">

<option>Belum Bayar</option>

<option>Lunas</option>

</select>

</td>

<td>

<button
type="button"
class="btn btn-danger removeRow">

✕

</button>

</td>

`;

    tbody.appendChild(row);

    calculateTotals();

});


// =======================
// Remove Row
// =======================

document.addEventListener("click", function (e) {

    if (e.target.classList.contains("removeRow")) {

        const rows = document.querySelectorAll("#invoiceBody tr");

        if (rows.length === 1) {

            alert("Minimal harus ada satu invoice.");

            return;

        }

        e.target.closest("tr").remove();

        calculateTotals();

    }

});


// =======================
// Submit
// =======================

form.addEventListener("submit", async function (e) {

    e.preventDefault();

    const vendorName =
        document.getElementById("vendorName").value.trim();

    if (vendorName === "") {

        alert("Vendor Name wajib diisi.");

        return;

    }

    const invoices = [];

    document.querySelectorAll("#invoiceBody tr").forEach(row => {

        invoices.push({

            invoiceNo:
                row.querySelector(".invoiceNo").value,

            invoiceDate:
                row.querySelector(".invoiceDate").value,

            description:
                row.querySelector(".description").value,

            qty:
                Number(row.querySelector(".qty").value),

            unitPrice:
                Number(row.querySelector(".unitPrice").value),

            total:
                Number(
                    row.querySelector(".qty").value
                ) *
                Number(
                    row.querySelector(".unitPrice").value
                ),

            status:
                row.querySelector(".status").value

        });

    });

    const payload = {

        vendorName,

        invoices

    };

    console.log(payload);

    try {

        const response = await fetch("http://localhost:8443/api/invoices", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(payload)

        });

        const result = await response.json();

        alert(result.message);

    }

    catch (err) {

        console.log(err);

        alert("Gagal mengirim data.");

    }

});

calculateTotals();