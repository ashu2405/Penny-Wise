// Initialize income and expenses arrays from localStorage
let incomes = JSON.parse(localStorage.getItem('incomes')) || [];
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let savingsGoal = parseFloat(localStorage.getItem('savingsGoal')) || 0;
let selectedCurrency = localStorage.getItem('currency') || 'IND';  // Default is Indian Rupee (₹)

// Currency symbols mapping
const currencySymbols = {
  'USD': '$',
  'INR': '₹',
  'EUR': '€'
};

// Currency Selector DOM element
const currencySelector = document.getElementById('currency');

// Update the dropdown to reflect the stored currency on page load
currencySelector.value = selectedCurrency;

// Selecting DOM elements for income inputs
const incomeInput = document.getElementById('income-input');
const addIncomeBtn = document.getElementById('add-income');
const incomeList = document.getElementById('income-list');

// Selecting DOM elements for expense inputs
const reasonInput = document.getElementById('reason-input');
const expenseInput = document.getElementById('expense-input');
const dateInput = document.getElementById('date-input');
const addExpenseBtn = document.getElementById('add-expense');
const expenseList = document.getElementById('expense-list');

// Selecting DOM elements for savings goal
const goalInput = document.getElementById('goal-input');
const setGoalBtn = document.getElementById('set-goal');
const goalStatus = document.getElementById('goal-status'); 

// Clear Data button
const clearDataBtn = document.getElementById('clear-data');

// Function to update displayed currency symbol
function updateDisplayedCurrency() {
  displayIncomes();
  displayExpenses();
  updateGoalStatus();
  renderChart();
}

// Listen for changes in currency selection
currencySelector.addEventListener('change', () => {
  selectedCurrency = currencySelector.value;
  localStorage.setItem('currency', selectedCurrency);  // Save the selected currency to localStorage
  updateDisplayedCurrency();  // Update all the displayed amounts
});

// Display Incomes with Currency Symbol
function displayIncomes() {
  incomeList.innerHTML = '';
  incomes.forEach(income => {
    const li = document.createElement('li');
    li.textContent = `${currencySymbols[selectedCurrency]}${income}`;
    incomeList.appendChild(li);
  });
}

// Display Expenses with Currency Symbol
function displayExpenses() {
  expenseList.innerHTML = '';
  expenses.forEach(({ amount, reason, date }) => {
    const li = document.createElement('li');
    li.textContent = `Date: ${date}, Reason: ${reason}, 
    Amount: ${currencySymbols[selectedCurrency]}${amount}`;
    expenseList.appendChild(li);
  });
}

// Add Income
addIncomeBtn.addEventListener('click', () => {
  const amount = parseFloat(incomeInput.value);
  if (!isNaN(amount) && amount > 0) {
    incomes.push(amount);
    localStorage.setItem('incomes', JSON.stringify(incomes)); // Persist in local storage
    displayIncomes();
    incomeInput.value = ''; // Clear input after adding
    renderChart(); // Update chart after adding income
  } else {
    alert("Please enter a valid income amount.");
  }
});

// Add Expense
addExpenseBtn.addEventListener('click', () => {
  const amount = parseFloat(expenseInput.value);
  const reason = reasonInput.value;
  const date = dateInput.value;

  if (!isNaN(amount) && amount > 0 && reason && date) {
    const expense = { amount, reason, date }; // Create an expense object
    expenses.push(expense);
    localStorage.setItem('expenses', JSON.stringify(expenses)); // Persist in local storage
    displayExpenses();
    expenseInput.value = ''; // Clear input after adding
    reasonInput.value = ''; // Clear input after adding
    dateInput.value = '';   // Clear input after adding
    renderChart();          // Update chart after adding expense
  } else {
    alert("Please enter valid expense details.");
  }
});

// Savings Goal
setGoalBtn.addEventListener('click', () => {
  savingsGoal = parseFloat(goalInput.value);
  localStorage.setItem('savingsGoal', savingsGoal);
  updateGoalStatus();
});

// Update goal status with currency
function updateGoalStatus() {
  const totalIncome = incomes.reduce((acc, income) => acc + income, 0);
  const totalExpense = expenses.reduce((acc, expense) => acc + expense.amount, 0);
  const savings = totalIncome - totalExpense;
  goalStatus.textContent = `Savings: ${currencySymbols[selectedCurrency]}${savings} 
  / Goal: ${currencySymbols[selectedCurrency]}${savingsGoal}`;
}

// Clear Data button functionality
clearDataBtn.addEventListener('click', () => {
    // Confirm if the user really wants to clear the data
  const confirmation = confirm("Are you sure you want to clear all your saved data?");
  
  if (confirmation) {
    // Clear the incomes, expenses, and savings goal from localStorage
    localStorage.removeItem('incomes');
    localStorage.removeItem('expenses');
    localStorage.removeItem('savingsGoal');

    // Clear the arrays and reset the goal
    incomes = [];
    expenses = [];
    savingsGoal = 0;

    // Clear the UI
    incomeList.innerHTML = '';
    expenseList.innerHTML = '';
    goalStatus.textContent = '';
    
    // Refresh the chart
    renderChart();

    // Notify the user
    alert("All saved data has been cleared!");
  }
});

// Prompt user to save or reset data on page reload
window.onbeforeunload = function() {
  return "Do you want to save your data before leaving?";
};

// Chart.js setup
const ctx = document.getElementById('myChart').getContext('2d');

function renderChart() {
  const totalIncome = incomes.reduce((acc, income) => acc + income, 0);
  const totalExpense = expenses.reduce((acc, expense) => acc + expense.amount, 0);

  // Clear the canvas before re-rendering
  ctx.clearRect(0, 0, ctx.width, ctx.height);

  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Income', 'Expenses'],
      datasets: [{
        label: 'Income vs Expenses',
        data: [totalIncome, totalExpense],
        backgroundColor: ['#28a745', '#dc3545'],
        borderColor: ['#28a745', '#dc3545'],
        borderWidth: 1
      }]
    }
  });
}

// Initial display of data from localStorage
displayIncomes();
displayExpenses();
updateGoalStatus();
renderChart(); // Render chart on page load
