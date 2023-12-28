// ClassificationsList.jsx
import React, { useEffect, useState } from 'react';

const ClassificationsList = ({ classificationInicial, onClassificationChange }) => {
  const [classificationsList, setClassificationsList] = useState([]);

  useEffect(() => {
    // Substitua a URL pelo endpoint real do seu servidor
    fetch('http://localhost:8000/classifications')
      .then(response => response.json())
      .then(data => setClassificationsList(data))
      .catch(error => console.error('Error fetching classifications:', error));
  }, []);

  const handleRadioChange = (id) => {
    onClassificationChange(id);
  };

  return (
    <div>
      <h2>Classifications List</h2>
      <div className='device-list'>
        {classificationsList.map(classification => (
          <div key={classification.id} className='device'>
            <input
              type="radio"
              id={`classification-${classification.id}`}
              name="classification"
              checked={classificationInicial === classification.id}
              onChange={() => handleRadioChange(classification.id)}
            />
            <label htmlFor={`classification-${classification.id}`}>{classification.name}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassificationsList;
