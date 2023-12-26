import React, { useState, useEffect } from 'react';
import '../form/Form.css';

const DevelopersList = ({ selectedDevelopers, onDeveloperToggle }) => {
  const [developersList, setDevelopersList] = useState([]);

  useEffect(() => {
    // Fetch the developers from the json-server
    fetch('http://localhost:8000/developers')
      .then(response => response.json())
      .then(data => setDevelopersList(data))
      .catch(error => console.error('Error fetching developers:', error));
  }, []);

  return (
    <div className=''>
      <h3>Desenvolvedoras:</h3>
      <ul className='developer-list'>
        {developersList.map((developer) => (
          <li key={developer.id}>
            <div className='developer'>
              <input
                type="checkbox"
                id={`developer-${developer.id}`}
                value={developer.name}
                checked={selectedDevelopers && selectedDevelopers.includes(developer.name)}
                onChange={() => onDeveloperToggle(developer.name)}
              />
              <label htmlFor={`developer-${developer.id}`}>{developer.name}</label>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DevelopersList;
