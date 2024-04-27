import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getDatabase, ref, get, remove } from 'firebase/database';

// CSS
import '../CharacterDetails/CharacterDetails.css';

function CharacterDetails({ userId }) {
  const { characterId } = useParams();
  const [characterDetails, setCharacterDetails] = useState(null);
  const database = getDatabase();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCharacterDetails = async () => {
      try {
        const charactersRef = ref(database, 'characters');
        const snapshot = await get(charactersRef);
        if (snapshot.exists()) {
          const characterList = [];
          snapshot.forEach((userSnapshot) => {
            userSnapshot.forEach((characterSnapshot) => {
              const characterData = characterSnapshot.val();
              characterList.push({
                id: characterSnapshot.key, // ID do personagem
                ...characterData
              });
            });
          });
          const character = characterList.find(character => character.id === characterId);
          if (character) {
            setCharacterDetails(character);
          } else {
            console.log('Character not found');
          }
        } else {
          console.log('No character data available');
        }
      } catch (error) {
        console.error('Error fetching character details:', error);
      }
    };

    fetchCharacterDetails();
  }, [database, characterId]);

  const handleExport = () => {
    if (characterDetails) {
      // Preparar os detalhes do personagem em formato JSON
      const characterDataJson = JSON.stringify(characterDetails);

      // Criar um Blob com os dados JSON
      const blob = new Blob([characterDataJson], { type: 'application/json' });

      // Criar uma URL para o Blob
      const url = URL.createObjectURL(blob);

      // Criar um link para o download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'character_details.json');

      // Adicionar o link ao documento e clicá-lo para iniciar o download
      document.body.appendChild(link);
      link.click();

      // Limpar a URL e remover o link
      URL.revokeObjectURL(url);
      document.body.removeChild(link);
    }
  };

  const handleDelete = async () => {
    try {
      const characterRef = ref(database, `characters/${userId}/${characterId}`);
      await remove(characterRef);
      console.log('Character deleted successfully');
      // Redirecionar após a exclusão
      navigate('/');
    } catch (error) {
      console.error('Error deleting character:', error);
    }
  };

  const confirmDeleteAction = () => {
    setConfirmDelete(true);
  };

  const cancelDeleteAction = () => {
    setConfirmDelete(false);
  };

  const confirmDeleteActionFinal = () => {
    setConfirmDelete(false);
    handleDelete();
  };

  if (!characterDetails) {
    return <div>Loading...</div>;
  }

  // Formatação da data no formato brasileiro
  const formattedDate = new Date(characterDetails.createdAt).toLocaleString('pt-BR');

  // Verificar se o usuário atual é o dono do personagem
  const isOwner = characterDetails.userId === userId;

  return (
    <div className="character-details">
      <h2>Detalhes do Personagem:</h2>
      <table>
        <tbody>
          <tr>
            <td>Nome:</td>
            <td>{characterDetails.characterName}</td>
          </tr>
          <tr>
            <td>Classe:</td>
            <td>{characterDetails.selectedClass}</td>
          </tr>
          <tr>
            <td>Raça:</td>
            <td>{characterDetails.selectedRace}</td>
          </tr>
          <tr>
            <td>Idade:</td>
            <td>{characterDetails.age}</td>
          </tr>
          <tr>
            <td>Poderes:</td>
            <td>{characterDetails.powersDescription}</td>
          </tr>
          <tr>
            <td>Origem:</td>
            <td>{characterDetails.origin}</td>
          </tr>
          <tr>
            <td>
              <table>
                <thead>
                  <tr>
                    <th>Atributo</th>
                    <th>Pontos</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(characterDetails.attributes).map(([attribute, value]) => (
                    <tr key={attribute}>
                      <td>{attribute}</td>
                      <td>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      <p>Feito por: {characterDetails.createdBy}</p>
      <p>Data de criação: <span>{formattedDate}</span></p>
      <div>
        {isOwner && (
          <>
            <button className='btn-export-oc' onClick={handleExport}>Exportar Detalhes</button>
            <Link className='btn-edit-details' to={`/character-editor/${characterId}`}>Editar Detalhes</Link>
            <button className='btn-delete-character' onClick={confirmDeleteAction}>Excluir Personagem</button>
          </>
        )}
      </div>
      {confirmDelete && (
        <div className="confirm-delete-dialog">
          <p>Deseja realmente excluir este personagem?</p>
          <button onClick={confirmDeleteActionFinal}>Sim</button>
          <button onClick={cancelDeleteAction}>Cancelar</button>
        </div>
      )}
    </div>
  );
}

export default CharacterDetails;
