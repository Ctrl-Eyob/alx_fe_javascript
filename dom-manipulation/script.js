let quotes = [];

// ✅ FETCH quotes from API
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json();

    // Convert API data to quote format
    const formatted = data.slice(0, 10).map(post => ({
      text: post.title,
      category: "Server"
    }));

    return formatted;
  } catch (error) {
    console.error("Failed to fetch from server:", error);
    return [];
  }
}

// ✅ POST quote to API
async function postQuoteToServer(quote) {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST", // ✅ required
      headers: {
        "Content-Type": "application/json" // ✅ required
      },
      body: JSON.stringify(quote)
    });

    const data = await response.json();
    console.log("Quote posted to server:", data);
  } catch (error) {
    console.error("Failed to post quote:", error);
  }
}

// ✅ REQUIRED: syncQuotes() replaces syncWithServer()
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];

  const isDifferent = JSON.stringify(serverQuotes) !== JSON.stringify(localQuotes);

  if (isDifferent) {
    localStorage.setItem('quotes', JSON.stringify(serverQuotes));
    quotes = [...serverQuotes];
    populateCategories();
    showConflictNotice("Quotes synced from server (server version used).");
  }
}

// Load local quotes
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

// Save local quotes and refresh UI
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
  populateCategories();
}

// Show notice
function showConflictNotice(message) {
  let notice = document.getElementById('conflictNotice');
  if (!notice) {
    notice = document.createElement('div');
    notice.id = 'conflictNotice';
    notice.style.background = '#ffcccc';
    notice.style.padding = '10px';
    notice.style.margin = '10px';
    notice.style.border = '1px solid #ff0000';
    document.body.insertBefore(notice, document.body.firstChild);
  }
  notice.textContent = message;
}

// Build category filter
function populateCategories() {
  const filterDropdown = document.getElementById('categoryFilter');
  const categories = ["all", ...new Set(quotes.map(q => q.category))];

  filterDropdown.innerHTML = '';

  categories.map(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    filterDropdown.appendChild(option);
  });

  const lastSelected = localStorage.getItem('lastFilter');
  if (lastSelected && categories.includes(lastSelected)) {
    filterDropdown.value = lastSelected;
  }
}

// Filter and display quote
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  localStorage.setItem('lastFilter', selectedCategory);

  const filtered = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  if (filtered.length === 0) {
    document.getElementById('quoteDisplay').textContent = "No quotes available in this category.";
    return;
  }

  const rand = Math.floor(Math.random() * filtered.length);
  const quote = filtered[rand];

  const display = `"${quote.text}" - (${quote.category})`;
  document.getElementById('quoteDisplay').textContent = display;

  sessionStorage.setItem('lastQuote', display);
}

// Add quote + POST to server
function addQuote() {
  const text = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim();

  if (!text || !category) {
    alert("Please enter both a quote and category.");
    return;
  }

  const newQuote = { text, category };

  quotes.push(newQuote);
  saveQuotes();
  postQuoteToServer(newQuote); // ✅ Send to server

  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
  alert("Quote added and synced to server.");
}

// Create form for adding quote
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

// Start sync loop every 30s
function startSyncInterval() {
  setInterval(syncQuotes, 30000);
}

// Export to JSON
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

// Import from file
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

// App entry
window.onload = function () {
  loadQuotes();
  createAddQuoteForm();
  populateCategories();

  document.getElementById('newQuote').addEventListener('click', filterQuotes);

  const lastQuote = sessionStorage.getItem('lastQuote');
  if (lastQuote) {
    document.getElementById('quoteDisplay').textContent = lastQuote;
  }

  syncQuotes();        // ✅ Now uses required name
  startSyncInterval(); // Repeats every 30s
};
