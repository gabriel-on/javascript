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

  const handleRadioChange = (name) => {
    onClassificationChange(name);
  };

  return (
    <div>
      <h2>Classificação Indicativa:</h2>
      <div className='device-list'>
        {classificationsList.map(classification => (
          <div key={classification.id} className='device'>
            <input
              type="radio"
              id={`classification-${classification.id}`}
              name="classification"
              checked={classificationInicial === classification.name}
              onChange={() => handleRadioChange(classification.name)}
            />
            <label htmlFor={`classification-${classification.id}`}>{classification.name}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassificationsList;
