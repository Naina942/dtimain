// Initialize stress data from localStorage or create empty array
let stressData = JSON.parse(localStorage.getItem('stressData')) || [];

// Initialize Chart.js
const ctx = document.getElementById('stressChart').getContext('2d');
let stressChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Stress Level',
            data: [],
            borderColor: '#4CAF50',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            tension: 0.4,
            fill: true
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                max: 5,
                ticks: {
                    stepSize: 1
                }
            }
        },
        plugins: {
            legend: {
                display: false
            }
        }
    }
});

// Update chart with current data
function updateChart() {
    const labels = stressData.map(entry => entry.date);
    const data = stressData.map(entry => entry.level);
    
    stressChart.data.labels = labels;
    stressChart.data.datasets[0].data = data;
    stressChart.update();
}

// Update statistics
function updateStats() {
    if (stressData.length === 0) {
        document.getElementById('averageStress').textContent = '0';
        document.getElementById('highestStress').textContent = '0';
        document.getElementById('lowestStress').textContent = '0';
        return;
    }

    const levels = stressData.map(entry => entry.level);
    const average = (levels.reduce((a, b) => a + b, 0) / levels.length).toFixed(1);
    const highest = Math.max(...levels);
    const lowest = Math.min(...levels);

    document.getElementById('averageStress').textContent = average;
    document.getElementById('highestStress').textContent = highest;
    document.getElementById('lowestStress').textContent = lowest;
}

// Add new stress level entry
function addStressLevel(level) {
    const date = new Date().toLocaleDateString();
    stressData.push({ date, level });
    
    // Keep only last 7 entries
    if (stressData.length > 7) {
        stressData = stressData.slice(-7);
    }
    
    // Save to localStorage
    localStorage.setItem('stressData', JSON.stringify(stressData));
    
    // Update UI
    updateChart();
    updateStats();
}

// Add click event listeners to stress level buttons
document.querySelectorAll('.stress-btn').forEach(button => {
    button.addEventListener('click', () => {
        const level = parseInt(button.dataset.level);
        addStressLevel(level);
        
        // Visual feedback
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 100);
    });
});

// Initialize the dashboard
updateChart();
updateStats(); 