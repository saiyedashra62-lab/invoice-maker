const products = document.getElementById("products");
const preview = document.getElementById("preview");

const fields = [
  "invoiceNo",
  "invoiceDate",
  "business",
  "businessEmail",
  "customer",
  "customerEmail",
  "gst"
];

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function addProduct() {
  const row = document.createElement("div");
  row.className = "product-row";

  row.innerHTML = `
    <input class="pname" placeholder="Item name">
    <input class="qty" type="number" min="1" value="1">
    <input class="price" type="number" min="0" step="0.01" placeholder="Price">
    <button type="button" class="remove-item" aria-label="Remove item">×</button>
  `;

  products.appendChild(row);

  row.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", updatePreview);
  });

  row.querySelector(".remove-item").addEventListener("click", () => {
    row.remove();
    updatePreview();
  });

  updatePreview();
}

function getData() {
  const items = [];

  document.querySelectorAll(".product-row").forEach(row => {
    const name = row.querySelector(".pname").value.trim();
    const qty = Number(row.querySelector(".qty").value);
    const price = Number(row.querySelector(".price").value);

    if (name && Number.isFinite(qty) && qty > 0 &&
        Number.isFinite(price) && price >= 0) {
      items.push({
        name,
        qty,
        price,
        amount: qty * price
      });
    }
  });

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const rate = Number(document.getElementById("gst").value);
  const tax = subtotal * rate / 100;

  return {
    business: document.getElementById("business").value,
    businessEmail: document.getElementById("businessEmail").value,
    customer: document.getElementById("customer").value,
    customerEmail: document.getElementById("customerEmail").value,
    invoiceNo: document.getElementById("invoiceNo").value,
    date: document.getElementById("invoiceDate").value,
    items,
    subtotal,
    rate,
    tax,
    total: subtotal + tax
  };
}

function money(value) {
  return "₹" + value.toFixed(2);
}

function updatePreview() {
  const data = getData();

  const itemRows = data.items.map(item => `
    <tr>
      <td>${escapeHTML(item.name)}</td>
      <td>${item.qty}</td>
      <td>${money(item.price)}</td>
      <td>${money(item.amount)}</td>
    </tr>
  `).join("");

  preview.innerHTML = `
    <div class="invoice-header">
      <div>
        <h2>${escapeHTML(data.business || "Your Business")}</h2>
        <p style="font-size:11px;color:#7b8495">
          ${escapeHTML(data.businessEmail)}
        </p>
      </div>
      <div class="invoice-title">INVOICE</div>
    </div>

    <div class="invoice-meta">
      <strong>Invoice:</strong> ${escapeHTML(data.invoiceNo || "INV-001")}<br>
      <strong>Date:</strong> ${escapeHTML(data.date || "—")}
    </div>

    <div class="bill-to">
      BILL TO<br>
      <strong>${escapeHTML(data.customer || "Customer name")}</strong><br>
      ${escapeHTML(data.customerEmail)}
    </div>

    <table class="invoice-table">
      <thead>
        <tr>
          <th>Item</th>
          <th>Qty</th>
          <th>Price</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        ${itemRows || '<tr><td colspan="4">No items added</td></tr>'}
      </tbody>
    </table>

    <div class="totals">
      <div class="total-row">
        <span>Subtotal</span>
        <strong>${money(data.subtotal)}</strong>
      </div>
      <div class="total-row">
        <span>GST (${data.rate}%)</span>
        <strong>${money(data.tax)}</strong>
      </div>
      <div class="total-row grand-total">
        <span>Total</span>
        <strong>${money(data.total)}</strong>
      </div>
    </div>

    <div class="thank-you">
      Thank you for your business.
    </div>
  `;
}

fields.forEach(id => {
  document.getElementById(id).addEventListener("input", updatePreview);
  document.getElementById(id).addEventListener("change", updatePreview);
});

document.getElementById("addProduct").addEventListener("click", addProduct);

// Download button with ad-redirect logic on first click
document.getElementById("download").addEventListener("click", (e) => {
  const data = getData();

  if (!data.business.trim() || !data.customer.trim() || !data.items.length) {
    alert("Enter business name, customer name and at least one valid item.");
    return;
  }

  // Check if user already clicked once for ad redirection in this session
  const hasClickedAd = sessionStorage.getItem('ad_redirected');

  if (!hasClickedAd) {
    // Set flag and open ad link on first click
    sessionStorage.setItem('ad_redirected', 'true');
    window.open('https://bauval.org/22/6964d7ca14dd51a0e8d81ea393ff89da', '_blank');
    e.preventDefault();
    return;
  }

  // Second click: Reset flag for future downloads and proceed to print/download
  sessionStorage.removeItem('ad_redirected');
  window.print();
});

document.getElementById("invoiceDate").value =
  new Date().toISOString().slice(0, 10);

document.getElementById("invoiceNo").value = "INV-001";

addProduct();
        
