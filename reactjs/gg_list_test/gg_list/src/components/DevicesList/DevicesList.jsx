import React, { useState, useEffect } from 'react';
import '../form/Form.css'

const DevicesList = ({ selectedDevices, onDeviceToggle }) => {
  const [devicesList, setDevicesList] = useState([]);

  useEffect(() => {
    // Fetch the devices from the json-server
    fetch('http://localhost:8000/devices')
      .then(response => response.json())
      .then(data => setDevicesList(data))
      .catch(error => console.error('Error fetching devices:', error));
  }, []);

  return (
    <div className=''>
      <h3>Plataformas:</h3>
      <ul className='device-list'>
        {devicesList.map((device) => (
          <li key={device.id}>
            <div className='device'>
              <input
                type="checkbox"
                id={`device-${device.id}`}
                value={device.name}
                checked={selectedDevices && selectedDevices.includes(device.name)}
                onChange={() => onDeviceToggle(device.name)}
              />
              <label htmlFor={`device-${device.id}`}>{device.name}</label>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DevicesList;
