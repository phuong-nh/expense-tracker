const totalBalance = document.querySelector("#dashboard .balance__total");
const totalIncome = document.getElementById("income-amount");
const totalExpense = document.getElementById("expense-amount");
const buttonCreate = document.querySelector(".static .button__create");
const listTracking = document.getElementById("tracking");
const detail = document.getElementById("detail");
const detailName = document.querySelector("#detail h2");
const detailAmount = document.querySelector("#detail h3");
const detailDescription = document.querySelector("#detail p");
const detailButton = document.querySelector("#detail .detail__close");
const create = document.getElementById("create");
const inputName = document.getElementById("new-name");
const inputAmount = document.getElementById("new-amount");
const inputDescription = document.getElementById("new-description");
const inputCancel = document.getElementById("cancel");
const inputAdd = document.getElementById("add");
const sectionPopup = document.querySelector(".popup");

var transactions = [];

function storageInit() {
  const local = window.localStorage.getItem("transactions");
  console.log(local);
  if (!local) return [];
  else return JSON.parse(local);
}

function historyInit() {
  transactions.slice().reverse().forEach((transaction) => {
    addToHistory(transaction);
  });
}

function addToHistory(transaction) {
  const newList = document.createElement("li");
  const info = document.createElement("button");
  const name = document.createElement("span");
  const amount = document.createElement("span");
  const del = document.createElement("button");

  newList.classList.add("transaction");
  info.classList.add("transaction__info");
  name.classList.add("transaction__name");
  amount.classList.add("transaction__amount");
  del.classList.add("transaction__delete");

  name.textContent = transaction.name;
  amount.textContent = transaction.amount;

  if (transaction.amount >= 0) {
    amount.classList.add("positive");
    amount.textContent = "+" + amount.textContent;
  } else {
    amount.classList.add("negative");
  }

  info.appendChild(name);
  info.appendChild(amount);

  info.addEventListener('click', (event) => {
    detailName.textContent = name.textContent;
    detailAmount.textContent = amount.textContent;
    detailDescription.textContent = transaction.description;

    if (transaction.amount >= 0) {
      detailAmount.classList.remove("negative");
      detailAmount.classList.add("positive");
    } else {
      detailAmount.classList.remove("positive");
      detailAmount.classList.add("negative");
    }

    toggleDetailPopup();
  });
  del.addEventListener('click', (event) => {
    listTracking.removeChild(newList);
    transactions = transactions.filter(e => e !== transaction);
    updateBalance();
    saveToLocal();
  });

  newList.appendChild(info);
  newList.appendChild(del);

  listTracking.insertBefore(newList, listTracking.firstChild);
}

function saveToLocal() {
  window.localStorage.setItem("transactions", JSON.stringify(transactions));
}

function calculateBalance() {
  var expense = 0;
  var income = 0;
  transactions.forEach((transaction) => {
    if (transaction.amount < 0) {
      expense += transaction.amount * (-1);
    } else {
      income += transaction.amount;
    }
  })
  return {
    income,
    expense,
    balance: income - expense,
  }
}

function updateBalance() {
  const balance = calculateBalance();
  totalBalance.textContent = balance.balance;
  totalExpense.textContent = balance.expense;
  totalIncome.textContent = balance.income;
}

function addTransaction() {
  const name = String(inputName.value);
  const amount = Number(inputAmount.value);
  const description = String(inputDescription.value);

  transactions.unshift({ name, amount, description });
  addToHistory({ name, amount, description });
  updateBalance();

  inputName.value = "";
  inputAmount.value = "";
  inputDescription.value = "";
}

function toggleDetailPopup() {
  if (detail.hidden) {
    detail.hidden = false;
    sectionPopup.classList.remove("hide");
  } else {
    detail.hidden = true;
    sectionPopup.classList.add("hide");
  }
}

function toggleCreatePopup() {
  if (create.hidden) {
    create.hidden = false;
    sectionPopup.classList.remove("hide");
  } else {
    create.hidden = true;
    sectionPopup.classList.add("hide");
  }
}

detailButton.addEventListener('click', (event) => {
  toggleDetailPopup();
})

buttonCreate.addEventListener('click', (event) => {
  toggleCreatePopup();
})

inputCancel.addEventListener('click', (event) => {
  inputName.value = "";
  inputAmount.value = "";
  inputDescription.value = "";

  toggleCreatePopup();
})

inputAdd.addEventListener('click', (event) => {
  addTransaction();
  saveToLocal();
  toggleCreatePopup();
})

transactions = storageInit();
historyInit();
updateBalance();