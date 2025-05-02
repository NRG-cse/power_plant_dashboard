const fields = [
  { label: 'Voltage (Line-to-Line)', unit: 'V' },
  { label: 'Voltage (Line-to-Neutral)', unit: 'V' },
  { label: 'Current (per phase)', unit: 'A' },
  { label: 'Frequency', unit: 'Hz' },
  { label: 'Power Factor', unit: '' },
  { label: 'Active Power', unit: 'kW' },
  { label: 'Reactive Power', unit: 'kVAR' },
  { label: 'Apparent Power', unit: 'kVA' },
  { label: 'Energy Generated', unit: 'kWh' },
  { label: 'Running Status', unit: '' },
  { label: 'Mode', unit: '' },
  { label: 'Fuel Level', unit: '%' },
  { label: 'Engine Speed', unit: 'RPM' },
  { label: 'Battery Voltage', unit: 'V' },
  { label: 'Coolant Temperature', unit: '°C' },
  { label: 'Oil Pressure', unit: 'Bar' },
  { label: 'Vibration Level', unit: 'mm/s' },
  { label: 'Maintenance Due', unit: '' },
  { label: 'Alarms', unit: '' },
  { label: 'Breaker Status', unit: '' },
  { label: 'Load Connected', unit: 'kW' },
  { label: 'Grid Synchronization', unit: '' },
  { label: 'Phase Angle', unit: '°' },
  { label: 'Transfer Switch Status', unit: '' },
  { label: 'Timestamp', unit: '' },
  { label: 'Uptime', unit: 'Hours' }
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
    div.innerHTML = `<strong>${field.label}:</strong> <span>${getRandomValue()} ${field.unit}</span>`;
    container.appendChild(div);
  });
}

function getRandomValue() {
  return (Math.random() * 100).toFixed(2);
}

setInterval(generateDataFields, 3000);
generateDataFields();

function printReport() {
  window.print();
}
