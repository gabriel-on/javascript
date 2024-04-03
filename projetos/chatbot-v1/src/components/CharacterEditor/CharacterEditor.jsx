import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getDatabase, ref, get, update } from 'firebase/database';

function CharacterEditor() {
  const { characterId } = useParams();
  const [characterData, setCharacterData] = useState(null);
  const [editedCharacterName, setEditedCharacterName] = useState('');
  const [editedCharacterAge, setEditedCharacterAge] = useState('');
  const [editedCharacterRace, setEditedCharacterRace] = useState('');
  const [editedCharacterClass, setEditedCharacterClass] = useState('');
  const [raceOptions, setRaceOptions] = useState([]);
  const [classOptions, setClassOptions] = useState([]);
  const database = getDatabase();

  useEffect(() => {
    const fetchCharacterData = async () => {
      try {
        const characterRef = ref(database, `result/${characterId}`);
        const snapshot = await get(characterRef);
        if (snapshot.exists()) {
          const characterData = snapshot.val();
          setCharacterData(characterData);
          setEditedCharacterName(characterData.characterName);
          setEditedCharacterAge(characterData.age);
          setEditedCharacterRace(characterData.selectedRace);
          setEditedCharacterClass(characterData.selectedClass);
        } else {
          console.log('No character data available');
        }
      } catch (error) {
        console.error('Error fetching character data:', error);
      }
    };

    const fetchRaceOptions = async () => {
      try {
        const racesRef = ref(database, 'races');
        const snapshot = await get(racesRef);
        if (snapshot.exists()) {
          const racesData = snapshot.val();
          const racesArray = Object.keys(racesData).map((key) => racesData[key]);
          setRaceOptions(racesArray);
        } else {
          console.log('No race options available');
        }
      } catch (error) {
        console.error('Error fetching race options:', error);
      }
    };

    const fetchClassOptions = async () => {
      try {
        const classesRef = ref(database, 'classes');
        const snapshot = await get(classesRef);
        if (snapshot.exists()) {
          const classesData = snapshot.val();
          const classesArray = Object.keys(classesData).map((key) => classesData[key]);
          setClassOptions(classesArray);
        } else {
          console.log('No class options available');
        }
      } catch (error) {
        console.error('Error fetching class options:', error);
      }
    };

    fetchCharacterData();
    fetchRaceOptions();
    fetchClassOptions();
  }, [database, characterId]);

  const handleNameChange = (e) => {
    const { value } = e.target;
    setEditedCharacterName(value);
  };

  const handleAgeChange = (e) => {
    const { value } = e.target;
    setEditedCharacterAge(value);
  };

  const handleRaceChange = (e) => {
    const { value } = e.target;
    setEditedCharacterRace(value);
  };

  const handleClassChange = (e) => {
    const { value } = e.target;
    setEditedCharacterClass(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const characterRef = ref(database, `result/${characterId}`);
      await update(characterRef, { characterName: editedCharacterName, age: editedCharacterAge, selectedRace: editedCharacterRace, selectedClass: editedCharacterClass });
      console.log('Character details updated successfully:', { characterName: editedCharacterName, age: editedCharacterAge, selectedRace: editedCharacterRace, selectedClass: editedCharacterClass });
    } catch (error) {
      console.error('Error updating character details:', error);
    }
  };

  if (!characterData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Editar Personagem</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Nome:
            <input
              type="text"
              value={editedCharacterName}
              onChange={handleNameChange}
            />
          </label>
        </div>
        <div>
          <label>
            Idade:
            <input
              type="text"
              value={editedCharacterAge}
              onChange={handleAgeChange}
            />
          </label>
        </div>
        <div>
          <label>
            Raça:
            <select value={editedCharacterRace} onChange={handleRaceChange}>
              <option value="">Selecione uma raça</option>
              {raceOptions.map((race, index) => (
                <option key={index} value={race}>{race}</option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label>
            Classe:
            <select value={editedCharacterClass} onChange={handleClassChange}>
              <option value="">Selecione uma classe</option>
              {classOptions.map((className, index) => (
                <option key={index} value={className}>{className}</option>
              ))}
            </select>
          </label>
        </div>
        <button type="submit">Salvar</button>
      </form>
    </div>
  );
}

export default CharacterEditor;
