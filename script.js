let coins = 0;
let coinsPerClick = 1;
let coinsPerSecond = 0;

const coinsEl = document.getElementById("coins");
const cpcEl = document.getElementById("cpc");
const cpsEl = document.getElementById("cps");

const clickBtn = document.getElementById("click-btn");
const upgradeClickBtn = document.getElementById("upgrade-click");
const buyAutoClickBtn = document.getElementById("buy-autoclick");

clickBtn.addEventListener("click", () => {
  coins += coinsPerClick;
  updateUI();
});

upgradeClickBtn.addEventListener("click", () => {
  if (coins >= 50) {
    coins -= 50;
    coinsPerClick++;
    updateUI();
  } else {
    alert("Not enough coins!");
  }
});

buyAutoClickBtn.addEventListener("click", () => {
  if (coins >= 100) {
    coins -= 100;
    coinsPerSecond++;
    updateUI();
  } else {
    alert("Not enough coins!");
  }
});

function updateUI() {
  coinsEl.textContent = coins;
  cpcEl.textContent = coinsPerClick;
  cpsEl.textContent = coinsPerSecond;
}

// Auto clicker loop
setInterval(() => {
  coins += coinsPerSecond;
  updateUI();
}, 1000);
