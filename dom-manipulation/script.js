let quotes = [];

// Load quotes from localStorage
function loadQuotes() {
  const stored = localStorage.getItem('quotes');
  if (stored) {
    quotes = JSON.parse(stored);
  } else {
    quotes = [
      { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
      { text: "Life is really simple, but we insist on making it complicated.", category: "Life" },
      { text: "Do not go where the path may lead, go instead where there is no path and leave a trail.", category: "Inspiration" }
    ];
  }
}

// Save quotes and categories to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
  populateCategories();
}

// Populate category filter dropdown
function populateCategories() {
  const filterDropdown = document.getElementById('categoryFilter');
  const categories = new Set(["all"]);
  quotes.forEach(q => categories.add(q.category));

  // Clear existing options
  filterDropdown.innerHTML = '';

  // Add each category
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    filterDropdown.appendChild(option);
  });

  // Restore last selected filter if available
  const lastSelected = localStorage.getItem('lastFilter');
  if (lastSelected && categories.has(lastSelected)) {
    filterDropdown.value = lastSelected;
  }
}

// Filter and display quotes
function filterQuotes() {
  const selected = document.getElementById('categoryFilter').value;
  localStorage.setItem('lastFilter', selected); // persist preference

  const filtered = selected === "all"
    ? quotes
    : quotes.filter(q => q.category === selected);

  if (filtered.length === 0) {
    document.getElementById('quoteDisplay').textContent = "No quotes available in this category.";
    return;
  }

  // Optional: pick random
  const rand = Math.floor(Math.random() * filtered.length);
  const quote = filtered[rand];

  const display = `"${quote.text}" - (${quote.category})`;
  document.getElementById('quoteDisplay').textContent = display;

  // Save last shown quote
  sessionStorage.setItem('lastQuote', display);
}

// Add a new quote and update categories
function addQuote() {
  const text = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim();

  if (!text || !category) {
    alert("Please enter both a quote and category.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();

  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
  alert("Quote added!");
}

// Dynamic quote form
function createAddQuoteForm() {
  const container = document.getElementById('formContainer');

  const quoteInput = document.createElement('input');
  quoteInput.id = 'newQuoteText';
  quoteInput.placeholder = 'Enter a new quote';

  const categoryInput = document.createElement('input');
  categoryInput.id = 'newQuoteCategory';
  categoryInput.placeholder = 'Enter quote category';

  const button = document.createElement('button');
  button.textContent = 'Add Quote';
  button.addEventListener('click', addQuote);

  container.innerHTML = '';
  container.appendChild(quoteInput);
  container.appendChild(categoryInput);
  container.appendChild(button);
}

// Export quotes to JSON
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

// Import quotes from JSON
function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const newQuotes = JSON.parse(e.target.result);
      if (Array.isArray(newQuotes)) {
        quotes.push(...newQuotes);
        saveQuotes();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format.");
      }
    } catch {
      alert("Failed to parse JSON.");
    }
  };
  reader.readAsText(file);
}

// On Load
window.onload = function () {
  loadQuotes();
  createAddQuoteForm();
  populateCategories();

  document.getElementById('newQuote').addEventListener('click', filterQuotes);

  // Restore last shown quote from sessionStorage
  const lastQuote = sessionStorage.getItem('lastQuote');
  if (lastQuote) {
    document.getElementById('quoteDisplay').textContent = lastQuote;
  }
};
