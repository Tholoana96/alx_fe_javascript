window.quotes = [
  {
    text: "The best way to get started is to quit talking and begin doing.",
    category: "Motivation",
  },
  {
    text: "Life is what happens when you're busy making other plans.",
    category: "Life",
  },
];

window.displayRandomQuote = function () {
  const quoteDisplay = document.getElementById("quoteDisplay");
  if (!window.quotes || window.quotes.length === 0) {
    quoteDisplay.innerText = "No quotes available.";
    return;
  }
  const randomIndex = Math.floor(Math.random() * window.quotes.length);
  const quote = window.quotes[randomIndex];
  quoteDisplay.innerText = `"${quote.text}" - [${quote.category}]`;
};

window.addQuote = function () {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");
  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (!text || !category) {
    alert("Please fill in both fields.");
    return;
  }

  window.quotes.push({ text, category });
  textInput.value = "";
  categoryInput.value = "";
  window.displayRandomQuote();
};

window.onload = function () {
  const newQuoteBtn = document.getElementById("newQuote");
  newQuoteBtn.addEventListener("click", window.displayRandomQuote);

  const addQuoteBtn = document.getElementById("addQuoteBtn");
  addQuoteBtn.addEventListener("click", window.addQuote);

  window.displayRandomQuote();
};
