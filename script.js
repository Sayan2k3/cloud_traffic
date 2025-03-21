// Simulate traffic data
const vehicleData = {
    vehicleId: 0,
    speed: 0,
    location: '',
    timestamp: ''
};

// Variables for analytics
let totalSpeed = 0;
let count = 0;
let congestionCount = 0;
let congestionThreshold = 30; // Speed below which it's considered congested (30 km/h)

// Data for charts
let speedData = [];
let congestionData = [];
let timeData = [];

// Function to generate random traffic data
const generateTrafficData = () => {
    vehicleData.vehicleId = Math.floor(Math.random() * 1000); // Vehicle ID between 0 and 1000
    vehicleData.speed = Math.floor(Math.random() * 100); // Speed between 0 and 100 km/h
    vehicleData.location = `${(Math.random() * (90 - (-90)) + (-90)).toFixed(6)}, ${(Math.random() * (180 - (-180)) + (-180)).toFixed(6)}`; // Random location (latitude, longitude)
    vehicleData.timestamp = new Date().toLocaleString(); // Current timestamp
};

// Function to update the displayed traffic data and analytics
const updateTrafficData = () => {
    generateTrafficData();

    // Update HTML content
    document.getElementById('vehicleId').innerText = `Vehicle ID: ${vehicleData.vehicleId}`;
    document.getElementById('vehicleSpeed').innerText = `Speed: ${vehicleData.speed} km/h`;
    document.getElementById('vehicleLocation').innerText = `Location: ${vehicleData.location}`;
    document.getElementById('timestamp').innerText = `Timestamp: ${vehicleData.timestamp}`;

    // Update average speed
    totalSpeed += vehicleData.speed;
    count++;
    const avgSpeed = (totalSpeed / count).toFixed(2);
    document.getElementById('avgSpeed').innerText = `Average Speed: ${avgSpeed} km/h`;

    // Detect congestion (speed below the threshold)
    if (vehicleData.speed < congestionThreshold) {
        congestionCount++;
    }

    // Display congestion level
    const congestionLevel = ((congestionCount / count) * 100).toFixed(2);
    document.getElementById('congestionLevel').innerText = `Congestion Level: ${congestionLevel}%`;

    // Update charts
    updateCharts(avgSpeed, congestionLevel);
    provideTrafficRecommendations(vehicleData.speed, avgSpeed, congestionLevel);
};

// Function to update the charts
const updateCharts = (avgSpeed, congestionLevel) => {
    const currentTime = new Date().toLocaleTimeString();

    // Add data for the charts
    timeData.push(currentTime);
    speedData.push(avgSpeed);
    congestionData.push(congestionLevel);

    // Limit data to 10 points (optional)
    if (timeData.length > 10) {
        timeData.shift();
        speedData.shift();
        congestionData.shift();
    }

    // Update Speed Chart
    speedChart.update();
    
    // Update Congestion Chart
    congestionChart.update();
};

// Traffic Recommendations
const provideTrafficRecommendations = (speed, avgSpeed, congestionLevel) => {
    let recommendation = '';

    if (congestionLevel > 50) {
        recommendation = 'Warning: High congestion detected! Consider alternative routes.';
    } else if (speed < 20) {
        recommendation = 'Traffic is moving slowly. Consider waiting or finding a less congested route.';
    } else if (avgSpeed > 80) {
        recommendation = 'Traffic is flowing well. Keep up the good speed!';
    } else {
        recommendation = 'Traffic is moderate. Stay aware of any upcoming delays.';
    }

    document.getElementById('recommendation').innerText = `Recommendation: ${recommendation}`;
};

// Create charts using Chart.js
const speedChart = new Chart(document.getElementById('speedChart'), {
    type: 'line',
    data: {
        labels: timeData,
        datasets: [{
            label: 'Average Speed (km/h)',
            data: speedData,
            borderColor: 'rgba(75, 192, 192, 1)',
            fill: false,
            tension: 0.1
        }]
    },
    options: {
        responsive: true,
        scales: {
            x: { 
                title: {
                    display: true,
                    text: 'Time'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Speed (km/h)'
                }
            }
        }
    }
});

const congestionChart = new Chart(document.getElementById('congestionChart'), {
    type: 'bar',
    data: {
        labels: timeData,
        datasets: [{
            label: 'Congestion Level (%)',
            data: congestionData,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        scales: {
            x: { 
                title: {
                    display: true,
                    text: 'Time'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Congestion Level (%)'
                }
            }
        }
    }
});

// Call updateTrafficData every 3 seconds to simulate real-time updates
setInterval(updateTrafficData, 3000);

