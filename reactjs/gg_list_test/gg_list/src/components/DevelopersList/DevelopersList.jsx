import React, { useEffect, useState } from 'react';
import { api } from '../../axios/config';

const DevelopersList = ({ onSelectDeveloper, selectedGameId }) => {
  const [developers, setDevelopers] = useState([]);
  const [selectedDeveloper, setSelectedDeveloper] = useState('');

  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        const response = await api.get('/developers');
        setDevelopers(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDevelopers();
  }, []);

  const handleDeveloperChange = (developerName) => {
    setSelectedDeveloper(developerName);
    onSelectDeveloper(developerName, selectedGameId);
  };

  return (
    <div>
      <label>Desenvolvedora:</label>
      <select onChange={(e) => handleDeveloperChange(e.target.value)} value={selectedDeveloper}>
        <option value="" disabled>Selecione uma desenvolvedora</option>
        {developers.map((developer) => (
          <option key={developer.id} value={developer.name}>
            {developer.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DevelopersList;
