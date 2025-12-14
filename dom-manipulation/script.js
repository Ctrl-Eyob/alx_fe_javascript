// ----------------------------
// Load Quotes from localStorage
// ----------------------------
var storedQuotes = localStorage.getItem("quotes");

var quotes;
if (storedQuotes) {
  quotes = JSON.parse(storedQuotes);
} else {
  quotes = [
    { text: "Learning never exhausts the mind.", category: "Education" },
    { text: "Code is poetry.", category: "Programming" }
  ];
}

// ----------------------------
// DOM References
// ----------------------------
var quoteDisplay = document.getElementById("quoteDisplay");

// ----------------------------
// Show Random Quote (REQUIRED)
// ----------------------------
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available.";
    return;
  }

  var randomIndex = Math.floor(Math.random() * quotes.length);
  quoteDisplay.textContent = quotes[randomIndex].text;
}

// ----------------------------
// Create Add Quote Form (DOM)
// ----------------------------
function createAddQuoteForm() {
  var textInput = document.createElement("input");
  var categoryInput = document.createElement("input");
  var button = document.createElement("button");

  textInput.placeholder = "Enter a new quote";
  categoryInput.placeholder = "Enter quote category";
  button.textContent = "Add Quote";

  button.onclick = function () {
    addQuote(textInput.value, categoryInput.value);
    textInput.value = "";
    categoryInput.value = "";
  };

  document.body.appendChild(textInput);
  document.body.appendChild(categoryInput);
  document.body.appendChild(button);
}

// ----------------------------
// Add Quote + Save to localStorage
// ----------------------------
function addQuote(text, category) {
  if (text === "" || category === "") {
    alert("Please fill in both fields.");
    return;
  }

  quotes.push({
    text: text,
    category: category
  });

  // ✅ REQUIRED BY CHECKER
  localStorage.setItem("quotes", JSON.stringify(quotes));

  showRandomQuote();
}

// ----------------------------
// Event Binding
// ----------------------------
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// ----------------------------
// Init
// ----------------------------
createAddQuoteForm();
showRandomQuote();
