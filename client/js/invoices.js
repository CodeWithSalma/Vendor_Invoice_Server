fetch("https://vendor-invoice-portal.vercel.app/api/invoices")
.then(res => res.json())
.then(data => {

    const tbody = document.getElementById("invoiceTable");

    tbody.innerHTML = "";

let no = 1;

data.forEach(batch => {

    batch.invoices.forEach(invoice => {

        tbody.innerHTML += `
        <tr>
            <td>${no++}</td>
            <td>${invoice.invoiceNo}</td>
            <td>${invoice.invoiceDate}</td>
            <td>${batch.vendorName}</td>
            <td>${invoice.description}</td>
            <td>${invoice.qty}</td>
            <td>Rp ${invoice.unitPrice.toLocaleString("id-ID")}</td>
            <td>Rp ${invoice.total.toLocaleString("id-ID")}</td>
            <td>${invoice.status}</td>
        </tr>
        `;

    });

});

});