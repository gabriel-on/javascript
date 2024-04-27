import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get } from 'firebase/database';
import '../Home/Home.css';
import { Link } from 'react-router-dom';

function Home() {
  const [characterDataList, setCharacterDataList] = useState([]);
  const database = getDatabase();

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const charactersRef = ref(database, 'characters');
        const snapshot = await get(charactersRef);
        if (snapshot.exists()) {
          const characterList = [];
          snapshot.forEach((userSnapshot) => {
            const userId = userSnapshot.key;
            userSnapshot.forEach((characterSnapshot) => {
              const characterData = characterSnapshot.val();
              characterList.push({
                id: characterSnapshot.key, // ID do personagem
                userId: userId, // ID do usuário
                ...characterData
              });
            });
          });
          // Revertendo a ordem para colocar o mais recente em primeiro lugar
          characterList.reverse();
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
    <div className='character-list-container'>
      <h1>Lista de Personagens</h1>
      <div className='character-list'>
        {characterDataList.map((character, index) => (
          <div key={index}>
            <h2>Personagem {index + 1}</h2>
            <ul>
              <li>Nome: {character.characterName}</li>
              <li>Idade: {character.age}</li>
              <li>Classe: {character.selectedClass}</li>
              <li>Raça: {character.selectedRace}</li>
              <li>Criador: {character.createdBy}</li>
            </ul>
            <Link className='btn-details' to={`/character-details/${character.id}`}>Ver Detalhes</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
