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

  function truncateString(str, maxLength) {
    if (str.length > maxLength) {
      return str.substring(0, maxLength) + '...';
    } else {
      return str;
    }
  }

  return (
    <div className='character-list-container'>
      <h1>Lista de Personagens</h1>
      <div className='character-list'>
        {characterDataList.map((character, index) => (
          <div key={index}>
            <h2>Personagem {index + 1}</h2>
            <div className='character-item'>
              <div className='character-image'>
                <img src={character.characterImage} alt={`Imagem do ${character.characterName}`} />
              </div>
              <ul>
              <li>
                <p>Nome:</p>
                <span>{truncateString(character.characterName, 14)}</span>
              </li>
                <li>
                  <p>Idade:</p> <span>{character.age}</span>
                </li>
                <li>
                  <p>Classe:</p> <span>{character.selectedClass}</span></li>
                <li><
                  p>Raça:</p> <span>{character.selectedRace}</span>
                </li>
                <li>
                  <p>Criador:</p> <span>{character.createdBy}</span>
                </li>
              </ul>
            </div>
            <Link className='btn-details' to={`/character-details/${character.id}`}>Ver Detalhes</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
