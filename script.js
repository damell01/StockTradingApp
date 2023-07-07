
let aaplPriceData = [];
let googlPriceData = [];

// Generate random price data
function generatePriceData() {
  return Math.random() * 1000;
}

// Function to create a chart
function createChart(chartId, label, priceData) {
  const ctx = document.getElementById(chartId).getContext('2d');
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: Array.from({ length: 10 }, (_, i) => `Day ${i + 1}`),
      datasets: [
        {
          label: label,
          data: priceData,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: 'Time',
          },
        },
        y: {
          display: true,
          title: {
            display: true,
            text: 'Price',
          },
          ticks: {
            stepSize: 5, // Set the desired step size for the y-axis labels
          },
        },
      },
    },
  });
}

// Generate initial data for AAPL and GOOGL
aaplPriceData = Array.from({ length: 10 }, () => generatePriceData());
googlPriceData = Array.from({ length: 10 }, () => generatePriceData());

// Create initial AAPL Chart
const aaplChart = createChart('aapl-chart', 'AAPL', aaplPriceData);

// Create initial GOOGL Chart
const googlChart = createChart('googl-chart', 'GOOGL', googlPriceData);

// Function to update chart interval
function changeChartInterval(interval) {
  // Generate new data based on the selected interval
  const numDays = 10;
  const dataInterval = interval === 'daily' ? 'Day' : interval === 'hourly' ? 'Hour' : 'Minute';
  const newData = Array.from({ length: numDays }, () => generatePriceData());

  // Update the chart data
  aaplChart.data.labels = Array.from({ length: numDays }, (_, i) => `${dataInterval} ${i + 1}`);
  aaplChart.data.datasets[0].data = newData;
  aaplPriceData = newData; // Update the price data array
  aaplChart.update();

  googlChart.data.labels = Array.from({ length: numDays }, (_, i) => `${dataInterval} ${i + 1}`);
  googlChart.data.datasets[0].data = newData;
  googlPriceData = newData; // Update the price data array
  googlChart.update();
}

function buyStock(stock) {
  let priceData;
  let stockPriceElement;
  let accountBalanceElement;

  if (stock === 'AAPL') {
    priceData = aaplPriceData;
    stockPriceElement = document.getElementById('aapl-price');
    accountBalanceElement = document.getElementById('account-balance');
  } else if (stock === 'GOOGL') {
    priceData = googlPriceData;
    stockPriceElement = document.getElementById('googl-price');
    accountBalanceElement = document.getElementById('account-balance');
  } else {
    // Handle other stocks if needed
    return;
  }

  const quantityInput = document.getElementById(`${stock.toLowerCase()}-quantity`);
  const quantity = parseInt(quantityInput.value);
  if (isNaN(quantity) || quantity < 1) {
    alert('Invalid quantity');
    return;
  }

  const stockPrice = priceData[priceData.length - 1]; // Retrieve the current price of the stock
  const totalCost = quantity * stockPrice;
  const accountBalance = parseFloat(accountBalanceElement.textContent.replace('$', ''));

  if (isNaN(totalCost) || isNaN(accountBalance)) {
    alert('Unable to retrieve stock price or account balance');
    return;
  }

  if (totalCost > accountBalance) {
    alert('Insufficient account balance');
    return;
  }

  const newBalance = accountBalance - totalCost;
  accountBalanceElement.textContent = '$' + newBalance.toFixed(2);
  alert(`Successfully bought ${quantity} shares of ${stock} for $${totalCost.toFixed(2)}`);
}

function sellStock(stock) {
  const quantityInput = document.getElementById(`${stock.toLowerCase()}-quantity`);
  const quantity = parseInt(quantityInput.value);

  if (isNaN(quantity) || quantity < 1) {
    alert('Invalid quantity');
    return;
  }

  let priceData;
  let stockPriceElement;
  let accountBalanceElement;
  if (stock === 'AAPL') {
    priceData = aaplPriceData;
    stockPriceElement = document.getElementById('aapl-price');
    accountBalanceElement = document.getElementById('account-balance');
  } else if (stock === 'GOOGL') {
    priceData = googlPriceData;
    stockPriceElement = document.getElementById('googl-price');
    accountBalanceElement = document.getElementById('account-balance');
  } else {
    // Handle other stocks if needed
    return;
  }

  if (priceData.length === 0) {
    alert('Unable to retrieve stock price or account balance');
    return;
  }

  const stockPrice = priceData[priceData.length - 1];
  const totalSale = quantity * stockPrice;
  const accountBalance = parseFloat(accountBalanceElement.textContent.replace('$', ''));

  if (isNaN(stockPrice) || isNaN(accountBalance)) {
    alert('Unable to retrieve stock price or account balance');
    return;
  }

  if (quantity > 0 && quantity <= quantityInput.max) {
    const newBalance = accountBalance + totalSale;
    accountBalanceElement.textContent = '$' + newBalance.toFixed(2);
    alert(`Successfully sold ${quantity} shares of ${stock} for $${totalSale.toFixed(2)}`);
    quantityInput.value = '';
  } else {
    alert('Invalid quantity');
  }
}
