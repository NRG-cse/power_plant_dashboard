// Configuration
const plants = {
  A: { name: "Arif Knitspin Ltd. Power Plant", generators: 8 },
  B: { name: "NRG Spinning Mills Ltd. Power Plant", generators: 10 },
  C: { name: "NRG Hometex Ltd. Power Plant", generators: 8 },
  D: { name: "A.T & T Spinning Mill Ltd. Power Plant", generators: 10 },
  E: { name: "NRG Composite Yarn Dyeing 1", generators: 8 },
  F: { name: "NRG Composite Yarn Dyeing 2", generators: 10 }
};

const statusFields = [
  { label: 'Running Status', unit: '', options: ['Running', 'Stopped', 'Maintenance'] },
  { label: 'Maintenance Due', unit: '', options: ['No', 'Soon', 'Critical'] },
  { label: 'Alarms', unit: '', options: ['None', 'Low Fuel', 'Over Temp', 'Overload'] },
  { label: 'Grid Sync', unit: '', options: ['Synchronized', 'Not Synced'] },
  { label: 'Transfer Status', unit: '', options: ['Grid', 'Generator', 'Transition'] },
  { label: 'Timestamp', unit: '', isDate: true },
  { label: 'Uptime', unit: 'Hours', min: 0, max: 8760 }
];

const dataFields = {
  'voltage-ll': { label: 'Voltage (L-L)', unit: 'V', min: 380, max: 420, color: 'rgba(255, 99, 132, 1)' },
  'voltage-ln': { label: 'Voltage (L-N)', unit: 'V', min: 220, max: 240, color: 'rgba(54, 162, 235, 1)' },
  'current': { label: 'Current', unit: 'A', min: 50, max: 300, color: 'rgba(255, 159, 64, 1)' },
  'power-factor': { label: 'Power Factor', unit: '', min: 0.85, max: 1.0, color: 'rgba(153, 102, 255, 1)' },
  'active-power': { label: 'Active Power', unit: 'kW', min: 100, max: 1000, color: 'rgba(255, 205, 86, 1)' },
  'reactive-power': { label: 'Reactive Power', unit: 'kVAR', min: 50, max: 500, color: 'rgba(201, 203, 207, 1)' },
  'apparent-power': { label: 'Apparent Power', unit: 'kVA', min: 120, max: 1100, color: 'rgba(54, 162, 235, 1)' },
  'frequency': { label: 'Frequency', unit: 'Hz', min: 49.8, max: 50.2, color: 'rgba(75, 192, 192, 1)' },
  'energy-generated': { label: 'Energy Generated', unit: 'kWh', min: 5000, max: 50000, color: 'rgba(255, 99, 132, 1)' },
  'fuel-level-value': { label: 'Fuel Level', unit: '%', min: 0, max: 100, color: 'rgba(75, 192, 192, 1)' },
  'engine-speed': { label: 'Engine Speed', unit: 'RPM', min: 1480, max: 1500, color: 'rgba(255, 159, 64, 1)' },
  'battery-voltage': { label: 'Battery Voltage', unit: 'V', min: 23, max: 28, color: 'rgba(153, 102, 255, 1)' },
  'coolant-temp': { label: 'Coolant Temp', unit: '°C', min: 70, max: 95, color: 'rgba(255, 99, 132, 1)' },
  'oil-pressure': { label: 'Oil Pressure', unit: 'Bar', min: 3.5, max: 4.5, color: 'rgba(54, 162, 235, 1)' }
};

// State
let currentPlant = 'A';
let currentGenerator = 1;
let efficiencyChart;
let currentEfficiencyView = 'day';
let autoRotateInterval;
let leafInterval;
let isFuelLow = false;
let tabRotationInterval;

// Initialize
function initDashboard() {
  updateClock();
  setInterval(updateClock, 1000);
  
  populateGeneratorSelect();
  updateCurrentUnit();
  generateStatusFields();
  updateDataCards();
  initEfficiencyChart();
  
  setInterval(updateData, 5000);
  autoRotateInterval = setInterval(autoRotateGenerator, 10000);
  startTabRotation();
}

// Clock
function updateClock() {
  const now = new Date();
  document.getElementById('clock').textContent = 
    now.toLocaleTimeString() + ' ' + now.toLocaleDateString();
}

// Generator rotation
function autoRotateGenerator() {
  const select = document.getElementById('generator-select');
  const generatorCount = plants[currentPlant].generators;
  currentGenerator = currentGenerator % generatorCount + 1;
  select.value = currentGenerator;
  updateGenerator();
}

// Tab rotation function
function startTabRotation() {
  const tabs = ['day', 'week', 'month', 'year'];
  let currentTabIndex = tabs.indexOf(currentEfficiencyView);
  
  if (tabRotationInterval) {
    clearInterval(tabRotationInterval);
  }
  
  tabRotationInterval = setInterval(() => {
    currentTabIndex = (currentTabIndex + 1) % tabs.length;
    changeEfficiencyView(tabs[currentTabIndex]);
  }, 10000); // 10 seconds
}

function populateGeneratorSelect() {
  const select = document.getElementById('generator-select');
  select.innerHTML = '';
  
  for (let i = 1; i <= plants[currentPlant].generators; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = `Generator ${i}`;
    select.appendChild(option);
  }
}

function updateCurrentUnit() {
  document.getElementById('current-unit').textContent = 
    `${plants[currentPlant].name} - Generator ${currentGenerator}`;
}

// Status fields
function generateStatusFields() {
  const container = document.getElementById('status-fields');
  container.innerHTML = '';
  
  statusFields.forEach(field => {
    const div = document.createElement('div');
    div.className = 'status-field';
    
    let value;
    if (field.options) {
      value = field.options[Math.floor(Math.random() * field.options.length)];
    } else if (field.isDate) {
      value = new Date().toLocaleString();
    } else {
      value = (Math.random() * (field.max - field.min) + field.min).toFixed(2);
    }
    
    div.innerHTML = `<strong>${field.label}:</strong> <span>${value} ${field.unit}</span>`;
    container.appendChild(div);
  });
}

// Data cards
function updateDataCards() {
  Object.keys(dataFields).forEach(id => {
    const field = dataFields[id];
    const value = (Math.random() * (field.max - field.min) + field.min).toFixed(2);
    const element = document.getElementById(id);
    if (element) {
      element.textContent = `${value} ${field.unit}`;
      element.style.color = field.color;
    }
  });
  
  updateFuelDisplay();
}

// Efficiency chart
function initEfficiencyChart() {
  const ctx = document.getElementById('efficiencyChart').getContext('2d');
  
  efficiencyChart = new Chart(ctx, {
    type: 'line',
    data: generateEfficiencyData('day'),
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { 
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `Efficiency: ${context.parsed.y}%`;
            }
          }
        }
      },
      scales: { 
        y: { 
          min: 70, 
          max: 100,
          title: {
            display: true,
            text: 'Efficiency %'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Time Period'
          }
        }
      }
    }
  });
  
  updateEfficiencyStats();
}

function generateEfficiencyData(view) {
  const now = new Date();
  let labels = [];
  let data = [];
  let baseEfficiency = 80 + Math.random() * 15; // Base between 80-95%
  
  switch(view) {
    case 'day':
      // 24 hours
      for (let i = 0; i < 24; i++) {
        labels.push(`${i}:00`);
        data.push(Math.max(70, Math.min(100, baseEfficiency + (Math.random() * 6 - 3))));
      }
      break;
    case 'week':
      // 7 days
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      for (let i = 0; i < 7; i++) {
        labels.push(days[i]);
        data.push(Math.max(70, Math.min(100, baseEfficiency + (Math.random() * 6 - 3))));
      }
      break;
    case 'month':
      // 4 weeks
      for (let i = 1; i <= 4; i++) {
        labels.push(`Week ${i}`);
        data.push(Math.max(70, Math.min(100, baseEfficiency + (Math.random() * 6 - 3))));
      }
      break;
    case 'year':
      // 12 months
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      for (let i = 0; i < 12; i++) {
        labels.push(months[i]);
        data.push(Math.max(70, Math.min(100, baseEfficiency + (Math.random() * 6 - 3))));
      }
      break;
  }
  
  return {
    labels: labels,
    datasets: [{
      label: 'Efficiency %',
      data: data,
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderWidth: 2,
      tension: 0.1,
      fill: true
    }]
  };
}

function changeEfficiencyView(view) {
  currentEfficiencyView = view;
  
  // Update active tab
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.textContent.toLowerCase() === view);
  });
  
  // Update chart data
  efficiencyChart.data = generateEfficiencyData(view);
  efficiencyChart.update();
  
  updateEfficiencyStats();
  
  // Reset tab rotation timer when user manually changes tab
  if (tabRotationInterval) {
    clearInterval(tabRotationInterval);
    startTabRotation();
  }
}

function updateEfficiencyStats() {
  const data = efficiencyChart.data.datasets[0].data;
  const current = data[data.length - 1];
  const previous = data[data.length - 2] || current;
  const change = ((current - previous) / previous * 100).toFixed(1);
  const avg = (data.reduce((a, b) => a + b, 0) / data.length).toFixed(1);
  
  document.getElementById('efficiency-stats').innerHTML = `
    <div class="stat-item">
      <div>Current</div>
      <div class="stat-value">${current}%</div>
    </div>
    <div class="stat-item">
      <div>Previous</div>
      <div class="stat-value">${previous}%</div>
    </div>
    <div class="stat-item">
      <div>Change</div>
      <div class="stat-value" style="color: ${change >= 0 ? 'green' : 'red'}">${change}%</div>
    </div>
    <div class="stat-item">
      <div>Average</div>
      <div class="stat-value">${avg}%</div>
    </div>
    <div class="stat-item">
      <div>Peak</div>
      <div class="stat-value">${Math.max(...data).toFixed(1)}%</div>
    </div>
    <div class="stat-item">
      <div>Low</div>
      <div class="stat-value">${Math.min(...data).toFixed(1)}%</div>
    </div>
  `;
}

// Fuel display
function updateFuelDisplay() {
  const fuelLevel = Math.random() * 100;
  const fuelFill = document.getElementById('fuel-level');
  const fuelPercent = document.getElementById('fuel-percent');
  const leaves = document.querySelector('.leaves');
  
  fuelFill.style.width = `${fuelLevel}%`;
  fuelPercent.textContent = `${Math.round(fuelLevel)}%`;
  
  if (fuelLevel < 20) {
    fuelFill.style.background = 'linear-gradient(to right, var(--danger), #ff758f)';
    leaves.style.background = 'var(--warning)';
    leaves.style.boxShadow = `
      -10px -8px 0 -4px var(--warning),
      10px -8px 0 -4px var(--warning),
      -8px 8px 0 -4px var(--warning),
      8px 8px 0 -4px var(--warning)
    `;
    if (!isFuelLow) startLeafFall();
    isFuelLow = true;
  } else if (fuelLevel < 50) {
    fuelFill.style.background = 'linear-gradient(to right, var(--warning), #ffd166)';
    leaves.style.background = '#a5d6a7';
    leaves.style.boxShadow = `
      -10px -8px 0 -4px #a5d6a7,
      10px -8px 0 -4px #a5d6a7,
      -8px 8px 0 -4px #a5d6a7,
      8px 8px 0 -4px #a5d6a7
    `;
    if (isFuelLow) stopLeafFall();
    isFuelLow = false;
  } else {
    fuelFill.style.background = 'linear-gradient(to right, var(--success), #7ae582)';
    leaves.style.background = 'var(--success)';
    leaves.style.boxShadow = `
      -10px -8px 0 -4px var(--success),
      10px -8px 0 -4px var(--success),
      -8px 8px 0 -4px var(--success),
      8px 8px 0 -4px var(--success)
    `;
    if (isFuelLow) stopLeafFall();
    isFuelLow = false;
  }
}

function startLeafFall() {
  stopLeafFall();
  const container = document.querySelector('.falling-leaves');
  
  leafInterval = setInterval(() => {
    const leaf = document.createElement('div');
    leaf.className = 'falling-leaf';
    leaf.style.left = `${Math.random() * 50}px`;
    leaf.style.animationDelay = `${Math.random() * 2}s`;
    container.appendChild(leaf);
    
    setTimeout(() => leaf.remove(), 3000);
  }, 800);
}

function stopLeafFall() {
  clearInterval(leafInterval);
  document.querySelector('.falling-leaves').innerHTML = '';
}

// Data updates
function updateData() {
  // Update status fields
  generateStatusFields();
  
  // Update data cards
  updateDataCards();
  
  // Update efficiency data occasionally
  if (Math.random() > 0.7) {
    efficiencyChart.data = generateEfficiencyData(currentEfficiencyView);
    efficiencyChart.update();
    updateEfficiencyStats();
  }
}

// Plant/generator changes
function updatePlant() {
  currentPlant = document.getElementById('plant-select').value;
  currentGenerator = 1;
  resetDashboard();
}

function updateGenerator() {
  currentGenerator = parseInt(document.getElementById('generator-select').value);
  resetDashboard();
}

function resetDashboard() {
  clearInterval(autoRotateInterval);
  updateCurrentUnit();
  generateStatusFields();
  updateDataCards();
  efficiencyChart.data = generateEfficiencyData(currentEfficiencyView);
  efficiencyChart.update();
  updateEfficiencyStats();
  autoRotateInterval = setInterval(autoRotateGenerator, 10000);
  startTabRotation();
}

// Initialize
window.onload = initDashboard;