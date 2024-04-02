import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get } from 'firebase/database';

function Home() {
  const [characterDataList, setCharacterDataList] = useState([]);
  const database = getDatabase();

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const resultRef = ref(database, 'result');
        const snapshot = await get(resultRef);
        if (snapshot.exists()) {
          const characterList = [];
          snapshot.forEach((childSnapshot) => {
            const characterData = childSnapshot.val();
            characterList.push(characterData);
          });
          setCharacterDataList(characterList);
        } else {
          console.log('No data available');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchResult();
  }, [database]);

  return (
    <div>
      <h1>Lista de Personagens</h1>
      <div className='character-list'>
        {characterDataList.map((character, index) => (
          <div key={index}>
            <h2>Personagem {index + 1}</h2>
            <ul>
              <li>Idade: {character.age}</li>
              <li>Nome: {character.characterName}</li>
              <li>Classe: {character.selectedClass}</li>
              <li>Raça: {character.selectedRace}</li>
              <li>Criador: {character.createdBy}</li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
