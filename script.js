let aaplPriceData = [];
let googlPriceData = [];
let aaplSharesOwned = 0;
let googlSharesOwned = 0;


// Function to generate random stock prices
function generateRandomPrices() {
  return Math.random() * 1000;
}

// Function to create a chart
function createChart(chartId, label, priceData) {
  const ctx = document.getElementById(chartId).getContext('2d');
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: Array.from({ length: priceData.length }, (_, i) => `Day ${i + 1}`),
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
          ticks: {
            maxTicksLimit: 10,
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

// Function to update stock prices every second
function updateStockPrices() {
  aaplPriceData.push(generateRandomPrices());
  googlPriceData.push(generateRandomPrices());

  // Keep the price data array limited to the last 10 prices
  if (aaplPriceData.length > 10) {
    aaplPriceData.shift();
  }
  if (googlPriceData.length > 10) {
    googlPriceData.shift();
  }

  // Update the AAPL and GOOGL charts with the new data
  aaplChart.data.datasets[0].data = aaplPriceData;
  aaplChart.data.labels = Array.from({ length: aaplPriceData.length }, (_, i) => `Day ${i + 1}`);
  aaplChart.options.scales.x.max = `Day ${aaplPriceData.length}`;
  aaplChart.update();

  googlChart.data.datasets[0].data = googlPriceData;
  googlChart.data.labels = Array.from({ length: googlPriceData.length }, (_, i) => `Day ${i + 1}`);
  googlChart.options.scales.x.max = `Day ${googlPriceData.length}`;
  googlChart.update();
}

// Function to change chart interval
function changeChartInterval(interval) {
  let numDataPoints;
  let dataInterval;
  let maxTicksLimit;

  if (interval === 'daily') {
    numDataPoints = 10;
    dataInterval = 'Day';
    maxTicksLimit = 10;
  } else if (interval === 'hourly') {
    numDataPoints = 24;
    dataInterval = 'Hour';
    maxTicksLimit = 24;
  } else if (interval === 'minute') {
    numDataPoints = 60;
    dataInterval = 'Minute';
    maxTicksLimit = 60;
  } else {
    return; // Invalid interval
  }

  // Generate new data based on the selected interval
  aaplPriceData = Array.from({ length: numDataPoints }, generateRandomPrices);
  googlPriceData = Array.from({ length: numDataPoints }, generateRandomPrices);

  // Update the chart data and options
  aaplChart.data.datasets[0].data = aaplPriceData;
  aaplChart.data.labels = Array.from({ length: numDataPoints }, (_, i) => `${dataInterval} ${i + 1}`);
  aaplChart.options.scales.x.ticks.maxTicksLimit = maxTicksLimit;
  aaplChart.update();

  googlChart.data.datasets[0].data = googlPriceData;
  googlChart.data.labels = Array.from({ length: numDataPoints }, (_, i) => `${dataInterval} ${i + 1}`);
  googlChart.options.scales.x.ticks.maxTicksLimit = maxTicksLimit;
  googlChart.update();
}

// Generate initial data for AAPL and GOOGL
aaplPriceData = Array.from({ length: 10 }, generateRandomPrices);
googlPriceData = Array.from({ length: 10 }, generateRandomPrices);

// Create initial AAPL Chart
const aaplChart = createChart('aapl-chart', 'AAPL', aaplPriceData);

// Create initial GOOGL Chart
const googlChart = createChart('googl-chart', 'GOOGL', googlPriceData);

// Start updating stock prices every 10 seconds
setInterval(updateStockPrices, 10000);
function buyStock(stock) {
    let priceData;
    let stockPriceElement;
    let accountBalanceElement;
    let sharesOwned;
  
    if (stock === 'AAPL') {
      priceData = aaplPriceData;
      stockPriceElement = document.getElementById('aapl-price');
      accountBalanceElement = document.getElementById('account-balance');
      sharesOwned = aaplSharesOwned;
    } else if (stock === 'GOOGL') {
      priceData = googlPriceData;
      stockPriceElement = document.getElementById('googl-price');
      accountBalanceElement = document.getElementById('account-balance');
      sharesOwned = googlSharesOwned;
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
  
    const stockPrice = priceData[priceData.length - 1];
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
  
    // Update shares owned
    if (stock === 'AAPL') {
      aaplSharesOwned += quantity;
    } else if (stock === 'GOOGL') {
      googlSharesOwned += quantity;
    }
  }
  
  function sellStock(stock) {
    const quantityInput = document.getElementById(`${stock.toLowerCase()}-quantity`);
    const quantity = parseInt(quantityInput.value);
    let priceData;
    let stockPriceElement;
    let accountBalanceElement;
    let sharesOwned;
  
    if (stock === 'AAPL') {
      priceData = aaplPriceData;
      stockPriceElement = document.getElementById('aapl-price');
      accountBalanceElement = document.getElementById('account-balance');
      sharesOwned = aaplSharesOwned;
    } else if (stock === 'GOOGL') {
      priceData = googlPriceData;
      stockPriceElement = document.getElementById('googl-price');
      accountBalanceElement = document.getElementById('account-balance');
      sharesOwned = googlSharesOwned;
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
  
    if (quantity > sharesOwned) {
      alert(`You can sell up to ${sharesOwned} shares of ${stock}`);
      return;
    }
  
    const newBalance = accountBalance + totalSale;
    accountBalanceElement.textContent = '$' + newBalance.toFixed(2);
    alert(`Successfully sold ${quantity} shares of ${stock} for $${totalSale.toFixed(2)}`);
  
    // Update shares owned
    if (stock === 'AAPL') {
      aaplSharesOwned -= quantity;
    } else if (stock === 'GOOGL') {
      googlSharesOwned -= quantity;
    }
  }
  function toggleChart(chartToShowId, chartToHideId) {
    const chartToShow = document.getElementById(chartToShowId);
    const chartToHide = document.getElementById(chartToHideId);
  
    chartToShow.style.display = 'block';
    chartToHide.style.display = 'none';
  }
  