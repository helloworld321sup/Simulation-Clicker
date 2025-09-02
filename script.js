// --- Game state with GIFs ---
let game = {
  coins: 0,
  coinsPerClick: 1,
  coinsPerSecond: 0,
  upgrades: {
    clickPower: { 
      cost: 50, 
      level: 0, 
      effect: () => game.coinsPerClick++, 
      img: "https://i.giphy.com/feio2yIUMtdqWjRiaF.webp" // hammer gif
    },
    autoClicker: { 
      cost: 100, 
      level: 0, 
      effect: () => game.coinsPerSecond++, 
      img: "https://media4.giphy.com/media/v1.Y2lkPTZjMDliOTUyZGx6bmdweXJlZzdrdGlxd3loZmQxMHRqdTFpOXl3Mmk1YWNra2pmbyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/svsszftgqEEM0pnpAc/source.gif" // robot gif
    }
  }
};

// --- DOM elements ---
const coinsEl = document.getElementById("coins");
const cpcEl = document.getElementById("cpc");
const cpsEl = document.getElementById("cps");
const clickBtn = document.getElementById("click-btn");
const shopItemsEl = document.getElementById("shop-items");
const saveStatusEl = document.getElementById("save-status");

// --- Update UI ---
function updateUI() {
  coinsEl.textContent = game.coins;
  cpcEl.textContent = game.coinsPerClick;
  cpsEl.textContent = game.coinsPerSecond;
  renderShop();
}

// --- Click event with animation ---
clickBtn.addEventListener("click", () => {
  game.coins += game.coinsPerClick;
  updateUI();
  saveGame();

  // Button pop animation
  clickBtn.classList.add("pop");
  setTimeout(() => clickBtn.classList.remove("pop"), 200);

  // Floating text
  const floating = document.createElement("span");
  floating.className = "floating-text";
  floating.textContent = `+${game.coinsPerClick}`;

  const rect = clickBtn.getBoundingClientRect();
  floating.style.left = rect.left + rect.width / 2 + "px";
  floating.style.top = rect.top + window.scrollY + "px";

  document.body.appendChild(floating);
  setTimeout(() => floating.remove(), 1000);
});

// --- Render shop dynamically ---
function renderShop() {
  shopItemsEl.innerHTML = "";
  for (let key in game.upgrades) {
    const upgrade = game.upgrades[key];

    const container = document.createElement("div");
    container.className = "shop-item";

    const img = document.createElement("img");
    img.src = upgrade.img;

    const text = document.createElement("span");
    text.textContent = `${key} (Cost: ${upgrade.cost}, Lvl: ${upgrade.level})`;

    container.appendChild(img);
    container.appendChild(text);

    container.addEventListener("click", () => buyUpgrade(key, container));

    if (game.coins < upgrade.cost) {
      container.style.opacity = 0.5;
      container.style.pointerEvents = "none";
    }

    shopItemsEl.appendChild(container);
  }
}

// --- Buy upgrade (merged) ---
function buyUpgrade(key, element) {
  const upgrade = game.upgrades[key];
  if (game.coins >= upgrade.cost) {
    game.coins -= upgrade.cost;
    upgrade.level++;
    upgrade.effect();
    upgrade.cost = Math.floor(upgrade.cost * 1.5);

    // Flash animation
    element.classList.add("flash");
    setTimeout(() => element.classList.remove("flash"), 500);

    updateUI();
    saveGame();
  }
}

// --- Auto coins loop ---
setInterval(() => {
  game.coins += game.coinsPerSecond;
  updateUI();
}, 1000);

// --- Save & load ---
function saveGame() {
  localStorage.setItem("clickerGame", JSON.stringify(game));
  showSaveStatus();
}

function loadGame() {
  const saved = localStorage.getItem("clickerGame");
  if (saved) game = JSON.parse(saved);
}

function showSaveStatus() {
  saveStatusEl.style.display = "block";
  setTimeout(() => (saveStatusEl.style.display = "none"), 1000);
}

// Auto-save every 5 seconds
setInterval(saveGame, 5000);

// --- Start ---
loadGame();
updateUI();
