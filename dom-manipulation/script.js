let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  {
    text: "The best way to get started is to quit talking and begin doing.",
    category: "Motivation",
  },
  {
    text: "Life is what happens when you're busy making other plans.",
    category: "Life",
  },
];

let lastViewedQuote = sessionStorage.getItem("lastViewedQuote");
const quoteDisplay = document.getElementById("quoteDisplay");

document
  .getElementById("newQuote")
  .addEventListener("click", displayRandomQuote);

function displayRandomQuote() {
  const selectedCategory = localStorage.getItem("lastCategory") || "all";
  const filtered =
    selectedCategory === "all"
      ? quotes
      : quotes.filter((q) => q.category === selectedCategory);
  const randomQuote = filtered[Math.floor(Math.random() * filtered.length)];
  if (randomQuote) {
    quoteDisplay.innerText = `"${randomQuote.text}" - [${randomQuote.category}]`;
    sessionStorage.setItem("lastViewedQuote", randomQuote.text);
  } else {
    quoteDisplay.innerText = "No quotes available in this category.";
  }
}

function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();
  if (!text || !category) return alert("Please fill in both fields.");

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
  displayRandomQuote();
}

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function populateCategories() {
  const dropdown = document.getElementById("categoryFilter");
  const existing = new Set(["all"]);
  quotes.forEach((q) => existing.add(q.category));
  dropdown.innerHTML = [...existing]
    .map((c) => `<option value="${c}">${c}</option>`)
    .join("");
  dropdown.value = localStorage.getItem("lastCategory") || "all";
}

function filterQuotes() {
  const selected = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastCategory", selected);
  displayRandomQuote();
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) {
        quotes.push(...imported);
        saveQuotes();
        populateCategories();
        alert("Quotes imported successfully!");
      } else throw new Error();
    } catch {
      alert("Invalid JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();
}

window.onload = () => {
  populateCategories();
  displayRandomQuote();
};

async function fetchQuotesFromServer() {
  const response = await fetch(
    "https://jsonplaceholder.typicode.com/posts?_limit=3"
  );
  const serverQuotes = await response.json();

  const formatted = serverQuotes.map((post) => ({
    text: post.title,
    category: "Server",
  }));

  const unique = formatted.filter(
    (sq) => !quotes.some((q) => q.text === sq.text)
  );
  quotes = [...unique, ...quotes];
  saveQuotes();
  populateCategories();
}

setInterval(fetchQuotesFromServer, 60000);
