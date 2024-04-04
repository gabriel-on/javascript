import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getDatabase, ref, get, update } from 'firebase/database';
import '../CharacterEditor/CharacterEditor.css'

function CharacterEditor() {
  const { characterId } = useParams();
  const [characterData, setCharacterData] = useState(null);
  const [editedCharacterName, setEditedCharacterName] = useState('');
  const [editedCharacterAge, setEditedCharacterAge] = useState('');
  const [editedCharacterRace, setEditedCharacterRace] = useState('');
  const [editedCharacterClass, setEditedCharacterClass] = useState('');
  const [editedCharacterAttributes, setEditedCharacterAttributes] = useState({});
  const [editedCharacterPowersDescription, setEditedCharacterPowersDescription] = useState('');
  const [editedCharacterOrigin, setEditedCharacterOrigin] = useState('');
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
          setEditedCharacterAttributes(characterData.attributes);
          setEditedCharacterPowersDescription(characterData.powersDescription);
          setEditedCharacterOrigin(characterData.origin);
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

  const handleAttributeChange = (attribute, value) => {
    // Verifica se o novo valor excede o limite de 10 pontos por habilidade
    if (value <= 10) {
      const currentTotal = Object.values(editedCharacterAttributes).reduce((total, val) => total + val, 0);

      // Verifica se o novo valor excede o limite total de pontos (36)
      if (currentTotal + (value - (editedCharacterAttributes[attribute] || 0)) <= 36) {
        const updatedValue = Math.max(0, value);
        setEditedCharacterAttributes(prevAttributes => ({
          ...prevAttributes,
          [attribute]: updatedValue
        }));
      } else {
        alert("O limite total de pontos (36) foi excedido!");
      }
    } else {
      alert("Cada habilidade do atributo só pode ter no máximo 10 pontos!");
    }
  };

  const handleIncrement = (attribute) => {
    handleAttributeChange(attribute, (editedCharacterAttributes[attribute] || 0) + 1);
  };

  const handleDecrement = (attribute) => {
    handleAttributeChange(attribute, Math.max((editedCharacterAttributes[attribute] || 0) - 1, 0));
  };

  const handlePowersDescriptionChange = (e) => {
    const { value } = e.target;
    setEditedCharacterPowersDescription(value);
  };

  const handleOriginChange = (e) => {
    const { value } = e.target;
    setEditedCharacterOrigin(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const characterRef = ref(database, `result/${characterId}`);
      await update(characterRef, {
        characterName: editedCharacterName,
        age: editedCharacterAge,
        selectedRace: editedCharacterRace,
        selectedClass: editedCharacterClass,
        attributes: editedCharacterAttributes,
        powersDescription: editedCharacterPowersDescription,
        origin: editedCharacterOrigin,
      });
      console.log('Character details updated successfully:', {
        characterName: editedCharacterName,
        age: editedCharacterAge,
        selectedRace: editedCharacterRace,
        selectedClass: editedCharacterClass,
        attributes: editedCharacterAttributes,
        powersDescription: editedCharacterPowersDescription,
        origin: editedCharacterOrigin,
      });
    } catch (error) {
      console.error('Error updating character details:', error);
    }
  };

  if (!characterData) {
    return <div>Loading...</div>;
  }

  return (
    <div className='edit-Character-container'>
      <h2>Editar Personagem</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <div className='field-character'>
            <div className="field">
              <label className='details-character-name details-character'>
                <p>Nome:</p>
                <input
                  type="text"
                  value={editedCharacterName}
                  onChange={handleNameChange}
                />
              </label>
            </div>
            <div className="field">
              <label className='details-character-age details-character'>
                <p>Idade:</p>
                <input
                  type="text"
                  value={editedCharacterAge}
                  onChange={handleAgeChange}
                />
              </label>
            </div>
          </div>
          <div className='field-character'>
            <div className="field">
              <label className='details-character'>
                <p>Raça:</p>
                <select value={editedCharacterRace} onChange={handleRaceChange}>
                  <option value="">Selecione uma raça</option>
                  {raceOptions.map((race, index) => (
                    <option key={index} value={race}>{race}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="field">
              <label className='details-character'>
                <p>Classe:</p>
                <select value={editedCharacterClass} onChange={handleClassChange}>
                  <option value="">Selecione uma classe</option>
                  {classOptions.map((className, index) => (
                    <option key={index} value={className}>{className}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </div>
        <div className='attribute-powers-origin'>
          <div className="field">
            <div className="attribute-table attribute-container">
              <h3>Atributos</h3>
              <table>
                <tbody>
                  {Object.entries(editedCharacterAttributes).map(([attribute, value], index) => (
                    <tr key={attribute}>
                      <td>{attribute}:</td>
                      <td>
                        <button type="button" onClick={() => handleDecrement(attribute)}>-</button>
                        <span>{value}</span>
                        <button type="button" onClick={() => handleIncrement(attribute)}>+</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className='powers-origin'>
            <div className="field powersDescription">
              <label className=''>
                <h3>Descrição de Poderes:</h3>
                <textarea
                  name="powersDescription"
                  value={editedCharacterPowersDescription}
                  onChange={handlePowersDescriptionChange}
                ></textarea>
              </label>
            </div>
            <div className="field origin">
              <label>
                <h3>Origem:</h3>
                <textarea
                  name="origin"
                  value={editedCharacterOrigin}
                  onChange={handleOriginChange}
                ></textarea>
              </label>
            </div>
          </div>
        </div>
        <button className='change-btn' type="submit">Salvar</button>
      </form>
    </div>
  );
}

export default CharacterEditor;
