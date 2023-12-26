import React from 'react';
import '../form/Form.css'

const developersList = [
  "Naughty Dog", "Rockstar Games", "Blizzard Entertainment", "Ubisoft", "Electronic Arts", "Bethesda Game Studios", "Square Enix", "Capcom", "BioWare", "CD Projekt", "Nintendo", "Valve Corporation", "Respawn Entertainment", "Gearbox Software", "2K Games", "Kojima Productions", "NetherRealm Studios", "Crystal Dynamics", "Obsidian Entertainment", "PlatinumGames",
  "Avalanche Studios Group", "Moon Studios", "SCS Software", "Outras"
  // Adicione mais desenvolvedoras conforme necessário
];

const DevelopersList = ({ selectedDevelopers, onDeveloperToggle }) => {
  return (
    <div className=''>
      <h3>Desenvolvedoras:</h3>
      <ul className='developer-list'>
        {developersList.map((developer, index) => (
          <li key={index}>
            <div className='developer'>
              <input
                type="checkbox"
                id={`developer-${index}`}
                value={developer}
                checked={selectedDevelopers && selectedDevelopers.includes(developer)}
                onChange={() => onDeveloperToggle(developer)}
              />
              <label htmlFor={`developer-${index}`}>{developer}</label>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DevelopersList;
