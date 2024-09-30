const btcPrices = [
    63625.8, 65607.1, 65866.5, 65776.3, 65175.7, 63156.5, 64256.8, 63331.8, 
    63572.7, 63348.1, 63201.2, 62938.6, 61757.6, 60309.1, 58213.1, 59138.5, 
    59995.4, 60511.6, 58134.5, 57338.7, 57635.0, 57049.6, 54861.3, 54156.5, 
    53966.8, 56183.2, 57973.4, 57479.8, 59134.0, 57315.7, 58978.6, 59119.7
];

let cashBalance = 50000;
let btcHoldings = 0;
let currentPriceIndex = 0;
let btcPrice = btcPrices[currentPriceIndex];
let simulationInterval;
let totalPrices = btcPrices.length;  // Total prices in the list
let priceHistory = [btcPrice];

// Initialize chart
const ctx = document.getElementById('priceChart').getContext('2d');
let priceChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Start'],
        datasets: [{
            label: 'Bitcoin Price',
            data: priceHistory,
            borderColor: 'rgba(75, 192, 192, 1)',
            fill: false,
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAt: 50000, // Start the y-axis at 50k
                min: 50000,     // Minimum y-axis value
                max: Math.max(...btcPrices) + 1000, // Adjust the max to accommodate the largest price
                title: {
                    display: true,
                    text: 'Price (USD)'
                }
            },
            x: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Time (Updates)'
                }
            }
        }
    }
});

// Update the chart
function updateChart() {
    priceChart.data.labels.push(currentPriceIndex + 1);
    priceChart.data.datasets[0].data = priceHistory;
    priceChart.update();
}

// Update the portfolio and UI
function updateUI() {
    document.getElementById('btc-price').innerText = btcPrice.toFixed(2);
    document.getElementById('cash-balance').innerText = cashBalance.toFixed(2);
    document.getElementById('btc-holdings').innerText = btcHoldings.toFixed(4);
    let totalValue = cashBalance + btcHoldings * btcPrice;
    document.getElementById('portfolio-value').innerText = totalValue.toFixed(2);
}

// Function to handle buying Bitcoin
function buyBitcoin() {
    if (cashBalance > 0) {
        let buyAmount = cashBalance / btcPrice;
        btcHoldings += buyAmount;
        cashBalance = 0;
        updateUI();
    }
}

// Function to handle selling Bitcoin
function sellBitcoin() {
    if (btcHoldings > 0) {
        let sellValue = btcHoldings * btcPrice;
        cashBalance += sellValue;
        btcHoldings = 0;
        updateUI();
    }
}

// Function to update Bitcoin price every 6 seconds
function updatePrice() {
    currentPriceIndex++;
    if (currentPriceIndex >= totalPrices) {
        clearInterval(simulationInterval);
        document.getElementById('notification').style.display = 'block';  // Show end notification
        return;
    }
    btcPrice = btcPrices[currentPriceIndex];
    priceHistory.push(btcPrice);
    updateChart();
    updateUI();
}

// Start the simulation
function startSimulation() {
    updateUI();  // Initial UI update
    simulationInterval = setInterval(updatePrice, 6000);  // Update price every 6 seconds
}
