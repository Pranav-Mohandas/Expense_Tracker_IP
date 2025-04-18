const DAILY_LIMIT = 1000;
let grandTotal = 0;

const categoryTotals = {
  Food: 0,
  Entertainment: 0,
  Groceries: 0,
  Others: 0
};

function addExpense() {
  const name = document.getElementById("name").value.trim();
  const amount = parseFloat(document.getElementById("amount").value);
  const category = document.getElementById("category").value;
  const grandTotalElement = document.getElementById("grand-total");

  if (!name || isNaN(amount) || amount <= 0) {
    alert("Please enter a valid name and a positive amount!");
    return;
  }

  const newTotal = grandTotal + amount;
  
  // Show warning if limit exceeded but still allow adding
  if (newTotal > DAILY_LIMIT) {
    showWarningAlert(`Daily spending limit of ₹${DAILY_LIMIT} exceeded!`);
  }

  const categoryKey = category.toLowerCase();
  const categoryListId = `list-${categoryKey}`;
  let ul = document.getElementById(categoryListId);

  // Create category block if it doesn't exist
  if (!ul) {
    const container = document.getElementById("categories-container");

    const block = document.createElement("div");
    block.className = "category-block";

    const heading = document.createElement("h2");
    heading.id = `heading-${categoryKey}`;
    heading.innerHTML = `${category} (₹<span id="total-${categoryKey}">0</span>)`;

    ul = document.createElement("ul");
    ul.className = "expense-list";
    ul.id = categoryListId;

    block.appendChild(heading);
    block.appendChild(ul);
    container.appendChild(block);
  }

  // Add expense item
  const li = document.createElement("li");
  li.textContent = `${name} - ₹${amount}`;
  ul.appendChild(li);

  // Update totals
  grandTotal = newTotal;
  categoryTotals[category] += amount;

  // Update displays
  grandTotalElement.textContent = grandTotal.toFixed(2);
  document.getElementById(`total-${categoryKey}`).textContent = 
    categoryTotals[category].toFixed(2);

  // Update grand total color
  grandTotalElement.classList.toggle('limit-exceeded', grandTotal > DAILY_LIMIT);

  // Clear inputs
  document.getElementById("name").value = "";
  document.getElementById("amount").value = "";
  document.getElementById("category").value = "Food";
}

function showWarningAlert(message) {
  const existingAlert = document.querySelector('.alert-warning');
  if (existingAlert) existingAlert.remove();

  const alertDiv = document.createElement('div');
  alertDiv.className = 'alert-warning';
  alertDiv.innerHTML = `⚠️ ${message}`;

  const container = document.querySelector('.container');
  container.insertBefore(alertDiv, document.getElementById('categories-container'));
  
  setTimeout(() => {
    alertDiv.style.opacity = '0';
    setTimeout(() => alertDiv.remove(), 300);
  }, 3000);
}