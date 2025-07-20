let quotes = [
  {
    text: "Be yourself; everyone else is already taken.",
    category: "Inspiration",
  },
  {
    text: "Two things are infinite: the universe and human stupidity.",
    category: "Humor",
  },
  { text: "So many books, so little time.", category: "Books" },
  {
    text: "Be the change that you wish to see in the world.",
    category: "Inspiration",
  },
  {
    text: "If you tell the truth, you don't have to remember anything.",
    category: "Wisdom",
  },
];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");
const notification = document.getElementById("notification");

let filteredQuotes = [];
let currentCategory = "all";

const STORAGE_KEY_QUOTES = "dynamicQuoteGeneratorQuotes";
const STORAGE_KEY_CATEGORY = "dynamicQuoteGeneratorCategory";
const STORAGE_KEY_LAST_QUOTE = "dynamicQuoteGeneratorLastQuote";

function loadQuotes() {
  const stored = localStorage.getItem(STORAGE_KEY_QUOTES);
  if (stored) {
    try {
      quotes = JSON.parse(stored);
    } catch {}
  }
}

function saveQuotes() {
  localStorage.setItem(STORAGE_KEY_QUOTES, JSON.stringify(quotes));
}

function loadCategoryFilter() {
  const savedCategory = localStorage.getItem(STORAGE_KEY_CATEGORY);
  if (savedCategory) {
    currentCategory = savedCategory;
  }
}

function saveCategoryFilter() {
  localStorage.setItem(STORAGE_KEY_CATEGORY, currentCategory);
}

function populateCategories() {
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  const categoriesSet = new Set(
    quotes.map((q) => q.category.trim()).filter(Boolean)
  );
  categoriesSet.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
  categoryFilter.value = currentCategory || "all";
}

function showRandomQuote() {
  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes found in this category.";
    return;
  }
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  quoteDisplay.textContent = `"${quote.text}" — (${quote.category})`;
  sessionStorage.setItem(STORAGE_KEY_LAST_QUOTE, JSON.stringify(quote));
}

function filterQuotes() {
  currentCategory = categoryFilter.value;
  saveCategoryFilter();
  if (currentCategory === "all") {
    filteredQuotes = quotes;
  } else {
    filteredQuotes = quotes.filter(
      (q) => q.category.toLowerCase() === currentCategory.toLowerCase()
    );
  }
  showRandomQuote();
}

function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");
  const text = textInput.value.trim();
  const category = categoryInput.value.trim();
  if (!text || !category) {
    alert("Please enter both quote text and category.");
    return;
  }
  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  textInput.value = "";
  categoryInput.value = "";
  categoryFilter.value = category;
  filterQuotes();
  showNotification("Quote added successfully!");
}

function showNotification(message) {
  notification.textContent = message;
  notification.style.display = "block";
  setTimeout(() => {
    notification.style.display = "none";
  }, 3000);
}

function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (evt) {
    try {
      const importedQuotes = JSON.parse(evt.target.result);
      if (!Array.isArray(importedQuotes)) {
        alert("Invalid JSON format: Expected an array of quotes.");
        return;
      }
      for (const q of importedQuotes) {
        if (!q.text || !q.category) {
          alert(
            "Invalid quote format detected. Each quote must have 'text' and 'category'."
          );
          return;
        }
      }
      importedQuotes.forEach((iq) => {
        const exists = quotes.some(
          (q) => q.text === iq.text && q.category === iq.category
        );
        if (!exists) quotes.push(iq);
      });
      saveQuotes();
      populateCategories();
      filterQuotes();
      showNotification("Quotes imported successfully!");
    } catch (err) {
      alert("Failed to import JSON file: " + err.message);
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

async function syncWithServer() {
  try {
    const response = await fetch(SERVER_URL);
    const serverData = await response.json();
    showNotification("Data synced with server (simulation).");
  } catch {
    showNotification("Failed to sync with server.");
  }
}

function init() {
  loadQuotes();
  loadCategoryFilter();
  populateCategories();
  filterQuotes();
  newQuoteBtn.addEventListener("click", showRandomQuote);
  setInterval(syncWithServer, 120000);
}

init();
