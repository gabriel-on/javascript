import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getDatabase, ref, get } from 'firebase/database';

//CSS
import '../CharacterDetails/CharacterDetails.css'

function CharacterDetails() {
  const { characterId } = useParams();
  const [characterDetails, setCharacterDetails] = useState(null);
  const navigate = useNavigate()
  const database = getDatabase();

  useEffect(() => {
    const fetchCharacterDetails = async () => {
      try {
        const characterRef = ref(database, `result/${characterId}`);
        const snapshot = await get(characterRef);
        if (snapshot.exists()) {
          const characterData = snapshot.val();
          setCharacterDetails(characterData);
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

  //Deletar Personagem
  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja excluir este personagem permanentemente?')) {
      try {
        const characterRef = ref(database, `result/${characterId}`);
        const snapshot = await get(characterRef);
        if (snapshot.exists()) {
          await remove(characterRef);
          navigate('/'); // Redireciona para a página inicial após a exclusão
        } else {
          console.log('Personagem não encontrado');
        }
      } catch (error) {
        console.error('Error deleting character:', error);
      }
    }
  };  

  if (!characterDetails) {
    return <div>Loading...</div>;
  }

   // Formatação da data no formato brasileiro
   const formattedDate = new Date(characterDetails.createdAt).toLocaleString('pt-BR');

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
            <td>Origem:</td>
            <td>{characterDetails.origin}</td>
          </tr>
          <tr>
            <td>Poderes:</td>
            <td>{characterDetails.powersDescription}</td>
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
      <button onClick={handleExport}>Exportar Detalhes</button>
      <button onClick={handleDelete}>Excluir Personagem</button>
    </div>
  );
}

export default CharacterDetails;
