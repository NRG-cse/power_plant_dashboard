const fields = [
  { label: 'Voltage (Line-to-Line)', unit: 'V', min: 380, max: 420 },
  { label: 'Voltage (Line-to-Neutral)', unit: 'V', min: 220, max: 240 },
  { label: 'Current (per phase)', unit: 'A', min: 50, max: 300 },
  { label: 'Frequency', unit: 'Hz', min: 49.8, max: 50.2 },
  { label: 'Power Factor', unit: '', min: 0.85, max: 1.0 },
  { label: 'Active Power', unit: 'kW', min: 100, max: 1000 },
  { label: 'Reactive Power', unit: 'kVAR', min: 50, max: 500 },
  { label: 'Apparent Power', unit: 'kVA', min: 120, max: 1100 },
  { label: 'Energy Generated', unit: 'kWh', min: 5000, max: 50000 },
  { label: 'Running Status', unit: '', options: ['Running', 'Stopped', 'Maintenance'] },
  { label: 'Mode', unit: '', options: ['Auto', 'Manual', 'Test'] },
  { label: 'Fuel Level', unit: '%', min: 20, max: 100 },
  { label: 'Engine Speed', unit: 'RPM', min: 1480, max: 1500 },
  { label: 'Battery Voltage', unit: 'V', min: 23, max: 28 },
  { label: 'Coolant Temperature', unit: '°C', min: 70, max: 95 },
  { label: 'Oil Pressure', unit: 'Bar', min: 3.5, max: 4.5 },
  { label: 'Vibration Level', unit: 'mm/s', min: 0.1, max: 2.5 },
  { label: 'Maintenance Due', unit: '', options: ['No', 'Yes - Soon', 'Yes - Critical'] },
  { label: 'Alarms', unit: '', options: ['None', 'Low Fuel', 'Over Temp', 'Overload'] },
  { label: 'Breaker Status', unit: '', options: ['Closed', 'Open', 'Tripped'] },
  { label: 'Load Connected', unit: 'kW', min: 50, max: 950 },
  { label: 'Grid Synchronization', unit: '', options: ['Synchronized', 'Not Synced'] },
  { label: 'Phase Angle', unit: '°', min: -5, max: 5 },
  { label: 'Transfer Switch Status', unit: '', options: ['Grid', 'Generator', 'Transition'] },
  { label: 'Timestamp', unit: '', isDate: true },
  { label: 'Uptime', unit: 'Hours', min: 0, max: 8760 }
];

function updateClock() {
  const now = new Date();
  document.getElementById('clock').textContent = now.toLocaleString();
}
setInterval(updateClock, 1000);
updateClock();

function generateDataFields() {
  const container = document.getElementById('data-fields');
  container.innerHTML = '';
  
  fields.forEach(field => {
    const div = document.createElement('div');
    div.className = 'data-field';
    
    let value;
    if (field.options) {
      value = field.options[Math.floor(Math.random() * field.options.length)];
    } else if (field.isDate) {
      value = new Date().toLocaleString();
    } else {
      value = (Math.random() * (field.max - field.min) + field.min).toFixed(2);
    }
    
    div.innerHTML = `
      <strong>${field.label}:</strong> 
      <span class="value">${value} ${field.unit}</span>
    `;
    container.appendChild(div);
  });
}

// Initial generation and periodic update
generateDataFields();
setInterval(generateDataFields, 3000);

function printReport() {
  window.print();
}