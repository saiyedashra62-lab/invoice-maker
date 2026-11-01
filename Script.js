const products = document.getElementById("products");

function addProduct() {

  const row = document.createElement("div");

  row.className = "product";

  row.innerHTML = `
    <input class="pname" placeholder="Product Name">
    <input class="qty" type="number" min="1" value="1">
    <input class="price" type="number" min="0" placeholder="Price">
    <button type="button" onclick="removeProduct(this)">X</button>
  `;

  products.appendChild(row);

  row.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", calculate);
  });

  calculate();
}

function removeProduct(button) {
  button.parentElement.remove();
  calculate();
}

function calculate() {

  let subtotal = 0;

  document.querySelectorAll(".product").forEach(row => {

    const qty = Number(row.querySelector(".qty").value) || 0;
    const price = Number(row.querySelector(".price").value) || 0;

    subtotal += qty * price;

  });

  const rate = Number(document.getElementById("gst").value);

  const tax = subtotal * rate / 100;

  const total = subtotal + tax;

  document.getElementById("subtotal").textContent =
    subtotal.toFixed(2);

  document.getElementById("tax").textContent =
    tax.toFixed(2);

  document.getElementById("grandTotal").textContent =
    total.toFixed(2);

}

function generateInvoice() {

  const business = document.getElementById("business").value;
  const customer = document.getElementById("customer").value;

  if (!business || !customer) {
    alert("Please enter business and customer names.");
    return;
  }

  const invoiceNo =
    document.getElementById("invoiceNo").value || "INV-001";

  const date =
    document.getElementById("invoiceDate").value;

  let rows = "";

  document.querySelectorAll(".product").forEach(row => {

    const name = row.querySelector(".pname").value;
    const qty = Number(row.querySelector(".qty").value) || 0;
    const price = Number(row.querySelector(".price").value) || 0;

    if (!name || qty <= 0 || price < 0) return;

    rows += `
      <tr>
        <td>${escapeHTML(name)}</td>
        <td>${qty}</td>
        <td>₹${price.toFixed(2)}</td>
        <td>₹${(qty * price).toFixed(2)}</td>
      </tr>
    `;

  });

  if (!rows) {
    alert("Please add at least one valid product.");
    return;
  }

  const subtotal =
    Number(document.getElementById("subtotal").textContent);

  const tax =
    Number(document.getElementById("tax").textContent);

  const total =
    Number(document.getElementById("grandTotal").textContent);

  document.getElementById("preview").innerHTML = `

    <div class="invoice">

      <h1>INVOICE</h1>

      <h2>${escapeHTML(business)}</h2>

      <p>${escapeHTML(document.getElementById("businessEmail").value)}</p>

      <hr>

      <p><b>Invoice:</b> ${escapeHTML(invoiceNo)}</p>
      <p><b>Date:</b> ${escapeHTML(date)}</p>

      <h3>Bill To: ${escapeHTML(customer)}</h3>

      <p>${escapeHTML(document.getElementById("customerEmail").value)}</p>

      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Amount</th>
          </tr>
        </thead>

        <tbody>${rows}</tbody>

      </table>

      <br>

      <h3>Subtotal: ₹${subtotal.toFixed(2)}</h3>
      <h3>GST: ₹${tax.toFixed(2)}</h3>
      <h2>Grand Total: ₹${total.toFixed(2)}</h2>

      <br>

      <p>Thank you for your business!</p>

    </div>

  `;

  document.getElementById("preview").scrollIntoView({
    behavior: "smooth"
  });

}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

addProduct();
