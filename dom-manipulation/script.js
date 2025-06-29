let quotes = [];

// Load quotes from localStorage
function loadQuotes() {
  const stored = localStorage.getItem('quotes');
  if (stored) {
    quotes = JSON.parse(stored);
  } else {
    // Default quotes
    quotes = [
      { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
      { text: "Life is really simple, but we insist on making it complicated.", category: "Life" },
      { text: "Do not go where the path may lead, go instead where there is no path and leave a trail.", category: "Inspiration" }
    ];
  }
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
  updateCategories();
}

// Populate category dropdown
function updateCategories() {
  const categorySelect = document.getElementById('categorySelect');
  const categories = new Set(["all"]);
  quotes.forEach(q => categories.add(q.category));

  categorySelect.innerHTML = '';
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    categorySelect.appendChild(option);
  });
}

// Display a random quote
function showRandomQuote() {
  const selectedCategory = document.getElementById('categorySelect').value;
  let filtered = selectedCategory === "all" ? quotes : quotes.filter(q => q.category === selectedCategory);

  if (filtered.length === 0) {
    document.getElementById('quoteDisplay').textContent = "No quotes in this category yet.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filtered.length);
  const quote = filtered[randomIndex];

  const quoteText = `"${quote.text}" - (${quote.category})`;
  document.getElementById('quoteDisplay').textContent = quoteText;

  // Store in session storage
  sessionStorage.setItem('lastQuote', quoteText);
}

// Add a new quote
function addQuote() {
  const text = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim();

  if (text === "" || category === "") {
    alert("Please enter both quote text and category.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();

  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
  alert("Quote added!");
}

// Dynamically create the add-quote form
function createAddQuoteForm() {
  const formContainer = document.getElementById('formContainer');

  const quoteInput = document.createElement('input');
  quoteInput.id = 'newQuoteText';
  quoteInput.type = 'text';
  quoteInput.placeholder = 'Enter a new quote';

  const categoryInput = document.createElement('input');
  categoryInput.id = 'newQuoteCategory';
  categoryInput.type = 'text';
  categoryInput.placeholder = 'Enter quote category';

  const addButton = document.createElement('button');
  addButton.textContent = 'Add Quote';
  addButton.addEventListener('click', addQuote);

  formContainer.innerHTML = '';
  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);
}

// Export quotes as JSON file
function exportToJsonFile() {
  const data = JSON.stringify(quotes, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();

  URL.revokeObjectURL(url);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format.");
      }
    } catch (error) {
      alert("Error parsing JSON.");
    }
  };
  reader.readAsText(file);
}

// On load
window.onload = function () {
  loadQuotes();
  updateCategories();
  createAddQuoteForm();

  // Restore last quote from session
  const last = sessionStorage.getItem('lastQuote');
  if (last) {
    document.getElementById('quoteDisplay').textContent = last;
  }

  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
};
