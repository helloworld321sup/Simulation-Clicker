// --- Game state ---
let game = {
  coins: 0,
  coinsPerClick: 1,
  coinsPerSecond: 0,
  upgrades: {
    clickPower: { cost: 50, level: 0, effect: () => game.coinsPerClick++ },
    autoClicker: { cost: 100, level: 0, effect: () => game.coinsPerSecond++ }
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

// --- Click event ---
clickBtn.addEventListener("click", () => {
  game.coins += game.coinsPerClick;
  updateUI();
});

clickBtn.addEventListener("click", (e) => {
  game.coins += game.coinsPerClick;
  updateUI();
  saveGame();

  // --- Button pop animation ---
  clickBtn.classList.add("pop");
  setTimeout(() => clickBtn.classList.remove("pop"), 200);

  // --- Floating text (+coins) ---
  const floating = document.createElement("span");
  floating.className = "floating-text";
  floating.textContent = `+${game.coinsPerClick}`;
  
  // Position near the click button
  const rect = clickBtn.getBoundingClientRect();
  floating.style.left = rect.left + rect.width / 2 + "px";
  floating.style.top = rect.top + window.scrollY + "px";
  
  document.body.appendChild(floating);

  // Remove after animation
  setTimeout(() => floating.remove(), 1000);
});

// --- Render shop dynamically ---
function renderShop() {
  shopItemsEl.innerHTML = "";
  for (let key in game.upgrades) {
    const upgrade = game.upgrades[key];
    const btn = document.createElement("button");
    btn.className = "shop-item";
    btn.textContent = `${key} (Cost: ${upgrade.cost}, Lvl: ${upgrade.level})`;
    btn.disabled = game.coins < upgrade.cost;

    btn.addEventListener("click", () => buyUpgrade(key));
    shopItemsEl.appendChild(btn);
  }
}

// --- Buy upgrade ---
function buyUpgrade(key) {
  const upgrade = game.upgrades[key];
  if (game.coins >= upgrade.cost) {
    game.coins -= upgrade.cost;
    upgrade.level++;
    upgrade.effect();
    upgrade.cost = Math.floor(upgrade.cost * 1.5); // cost scaling
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
