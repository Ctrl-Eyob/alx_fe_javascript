// Initial array of quotes
let quotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Life is really simple, but we insist on making it complicated.", category: "Life" },
  { text: "Do not go where the path may lead, go instead where there is no path and leave a trail.", category: "Inspiration" }
];

// Populate category dropdown
function updateCategories() {
  const categorySelect = document.getElementById('categorySelect');
  const categories = new Set(["all"]);
  quotes.forEach(q => categories.add(q.category));

  // Clear and repopulate dropdown
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
  let filteredQuotes = selectedCategory === "all" ? quotes : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    document.getElementById('quoteDisplay').textContent = "No quotes in this category yet.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  document.getElementById('quoteDisplay').textContent = `"${filteredQuotes[randomIndex].text}" - (${filteredQuotes[randomIndex].category})`;
}

// Add a new quote
function addQuote() {
  const textInput = document.getElementById('newQuoteText');
  const categoryInput = document.getElementById('newQuoteCategory');
  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (text === "" || category === "") {
    alert("Please enter both a quote and a category.");
    return;
  }

  quotes.push({ text, category });
  textInput.value = '';
  categoryInput.value = '';
  updateCategories();
  alert("Quote added successfully!");
}

// Event Listeners
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Initialize categories on load
updateCategories();
