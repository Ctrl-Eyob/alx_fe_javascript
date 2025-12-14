/* =========================================================
   SECTION 1: WEB STORAGE (LocalStorage + SessionStorage)
   ========================================================= */

// Load quotes from localStorage
var storedQuotes = localStorage.getItem("quotes");

var quotes = storedQuotes
  ? JSON.parse(storedQuotes)
  : [
      { text: "Learning never exhausts the mind.", category: "Education" },
      { text: "Code is poetry.", category: "Programming" }
    ];

// Restore last selected category filter
var lastCategory = localStorage.getItem("lastCategory") || "all";

// DOM references
var quoteDisplay = document.getElementById("quoteDisplay");
var categoryFilter = document.getElementById("categoryFilter");

/* =========================================================
   SECTION 2: DISPLAY RANDOM QUOTE + SESSION STORAGE
   ========================================================= */

function showRandomQuote() {
  if (quotes.length === 0) return;

  var randomIndex = Math.floor(Math.random() * quotes.length);
  var quote = quotes[randomIndex];

  quoteDisplay.textContent = quote.text;

  // Store last viewed quote in sessionStorage (OPTIONAL TASK)
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(quote));
}

/* =========================================================
   SECTION 3: SAVE QUOTES TO LOCAL STORAGE (REQUIRED)
   ========================================================= */

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

/* =========================================================
   SECTION 4: ADD NEW QUOTE + UPDATE STORAGE
   ========================================================= */

function addQuote(text, category) {
  if (!text || !category) {
    alert("Please enter both quote and category.");
    return;
  }

  quotes.push({
    text: text,
    category: category
  });

  saveQuotes();
  populateCategories();
  filterQuotes();
}

/* =========================================================
   SECTION 5: POPULATE CATEGORY FILTER (MANDATORY)
   ========================================================= */

function populateCategories() {
  var categories = ["all"];

  for (var i = 0; i < quotes.length; i++) {
    if (!categories.includes(quotes[i].category)) {
      categories.push(quotes[i].category);
    }
  }

  categoryFilter.innerHTML = "";

  for (var j = 0; j < categories.length; j++) {
    var option = document.createElement("option");
    option.value = categories[j];
    option.textContent = categories[j];
    categoryFilter.appendChild(option);
  }

  categoryFilter.value = lastCategory;
}

/* =========================================================
   SECTION 6: FILTER QUOTES BY CATEGORY (MANDATORY)
   ========================================================= */

function filterQuotes() {
  var selectedCategory = categoryFilter.value;

  // Save selected filter
  localStorage.setItem("lastCategory", selectedCategory);

  var filteredQuotes = [];

  for (var i = 0; i < quotes.length; i++) {
    if (
      selectedCategory === "all" ||
      quotes[i].category === selectedCategory
    ) {
      filteredQuotes.push(quotes[i]);
    }
  }

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes found.";
    return;
  }

  quoteDisplay.textContent = filteredQuotes[0].text;
}

/* =========================================================
   SECTION 7: JSON EXPORT (MANDATORY)
   ========================================================= */

function exportToJson() {
  var jsonData = JSON.stringify(quotes, null, 2);
  var blob = new Blob([jsonData], { type: "application/json" });
  var url = URL.createObjectURL(blob);

  var link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();

  URL.revokeObjectURL(url);
}

/* =========================================================
   SECTION 8: JSON IMPORT (MANDATORY – EXACT STRUCTURE)
   ========================================================= */

function importFromJsonFile(event) {
  var fileReader = new FileReader();

  fileReader.onload = function (event) {
    var importedQuotes = JSON.parse(event.target.result);
    quotes.push.apply(quotes, importedQuotes);
    saveQuotes();
    populateCategories();
    alert("Quotes imported successfully!");
  };

  fileReader.readAsText(event.target.files[0]);
}

/* =========================================================
   SECTION 9: SERVER SYNC SIMULATION + CONFLICT RESOLUTION
   ========================================================= */

function syncWithServer() {
  fetch("https://jsonplaceholder.typicode.com/posts")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // SERVER DATA TAKES PRECEDENCE
      quotes = data.slice(0, 5).map(function (item) {
        return {
          text: item.title,
          category: "Server"
        };
      });

      saveQuotes();
      populateCategories();
      filterQuotes();

      alert("Quotes synced with server.");
    });
}

// Periodic sync every 30 seconds (simulation)
setInterval(syncWithServer, 30000);

/* =========================================================
   SECTION 10: EVENT LISTENERS + INITIALIZATION
   ========================================================= */

document
  .getElementById("newQuote")
  .addEventListener("click", showRandomQuote);

// Initialize app
populateCategories();
filterQuotes();
showRandomQuote();
function createAddQuoteForm() {
  var container = document.getElementById("formContainer");

  var quoteInput = document.createElement("input");
  quoteInput.id = "newQuoteText";
  quoteInput.placeholder = "Enter a new quote";

  var categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.placeholder = "Enter quote category";

  var button = document.createElement("button");
  button.textContent = "Add Quote";
  button.addEventListener("click", addQuote);

  container.innerHTML = "";
  container.appendChild(quoteInput);
  container.appendChild(categoryInput);
  container.appendChild(button);
}