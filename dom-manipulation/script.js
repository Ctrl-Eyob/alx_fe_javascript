// Quotes data
const quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
  { text: "Success is not final; failure is not fatal.", category: "Motivation" },
  { text: "First, solve the problem. Then, write the code.", category: "Programming" }
];

// DOM references
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const appContainer = document.getElementById("app");


// ----------------------------
// Create Category Selector
// ----------------------------
const categorySelect = document.createElement("select");

function updateCategories() {
  const categories = ["All", ...new Set(quotes.map(q => q.category))];

  categorySelect.innerHTML = "";
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });
}

categorySelect.addEventListener("change", showRandomQuote);
appContainer.appendChild(categorySelect);

// ----------------------------
// Create Add Quote Form
// ----------------------------
function createAddQuoteForm() {
  const form = document.createElement("div");

  const quoteInput = document.createElement("input");
  quoteInput.id = "newQuoteText";
  quoteInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";

  addButton.addEventListener("click", () => {
    addQuote(quoteInput.value, categoryInput.value);
    quoteInput.value = "";
    categoryInput.value = "";
  });

  form.appendChild(quoteInput);
  form.appendChild(categoryInput);
  form.appendChild(addButton);

  appContainer.appendChild(form);
}

// ----------------------------
// Add Quote Function
// ----------------------------
function addQuote(text, category) {
  if (!text || !category) {
    alert("Please enter both quote and category.");
    return;
  }

  quotes.push({ text, category });
  updateCategories();
  showRandomQuote();
}

// ----------------------------
// Event Listeners
// ----------------------------
newQuoteBtn.addEventListener("click", showRandomQuote);

// Initialize App
updateCategories();
createAddQuoteForm();
showRandomQuote();

function showRandomQuote() {
  var selectedCategory = categorySelect.value;
  var filteredQuotes;

  if (selectedCategory === "All") {
    filteredQuotes = quotes;
  } else {
    filteredQuotes = quotes.filter(function (q) {
      return q.category === selectedCategory;
    });
  }

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available for this category.";
    return;
  }

  var randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  quoteDisplay.textContent = '"' + filteredQuotes[randomIndex].text + '"';
}
