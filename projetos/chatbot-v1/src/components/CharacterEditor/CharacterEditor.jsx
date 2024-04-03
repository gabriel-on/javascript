import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getDatabase, ref, get, update } from 'firebase/database';

function CharacterEditor() {
  const { characterId } = useParams();
  const [characterData, setCharacterData] = useState(null);
  const [editedCharacterName, setEditedCharacterName] = useState('');
  const database = getDatabase();

  useEffect(() => {
    const fetchCharacterData = async () => {
      try {
        const characterRef = ref(database, `result/${characterId}`);
        const snapshot = await get(characterRef);
        if (snapshot.exists()) {
          const characterData = snapshot.val();
          setCharacterData(characterData);
          setEditedCharacterName(characterData.characterName); // Preencher o estado inicial com o nome atual do personagem
        } else {
          console.log('No character data available');
        }
      } catch (error) {
        console.error('Error fetching character data:', error);
      }
    };

    fetchCharacterData();
  }, [database, characterId]);

  const handleChange = (e) => {
    const { value } = e.target;
    setEditedCharacterName(value); // Atualizar o estado com o valor do campo de entrada
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const characterRef = ref(database, `result/${characterId}`);
      await update(characterRef, { characterName: editedCharacterName }); // Atualizar apenas o campo 'characterName' no banco de dados
      console.log('Nome do personagem atualizado com sucesso:', editedCharacterName);
    } catch (error) {
      console.error('Error updating character name:', error);
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
              onChange={handleChange}
            />
          </label>
        </div>
        <button type="submit">Salvar</button>
      </form>
    </div>
  );
}

export default CharacterEditor;
