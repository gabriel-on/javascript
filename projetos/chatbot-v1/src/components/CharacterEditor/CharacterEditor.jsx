import React, { useState, useEffect } from 'react';

function CharacterEditor({ character }) {
  const [editedCharacter, setEditedCharacter] = useState({}); // Estado para armazenar os dados do personagem editado

  // Efeito para atualizar os dados do personagem editado sempre que os dados do personagem original mudarem
  useEffect(() => {
    setEditedCharacter(character || {}); // Define os dados do personagem editado
  }, [character]);

  // Manipula a alteração de um campo do personagem editado
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedCharacter((prevCharacter) => ({
      ...prevCharacter,
      [name]: value,
    }));
  };

  // Manipula o envio do formulário com os dados do personagem editado
  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você pode enviar os detalhes editados do personagem para onde for necessário
    console.log('Detalhes do personagem editados:', editedCharacter);
    // Implemente a lógica para salvar os detalhes do personagem no banco de dados aqui
    saveCharacterDetails(editedCharacter);
  };

  // Função para salvar os detalhes do personagem no banco de dados
  const saveCharacterDetails = (editedCharacter) => {
    // Implemente a lógica para salvar os detalhes do personagem no banco de dados aqui
    console.log('Salvando os detalhes do personagem no banco de dados:', editedCharacter);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="edit-character-container">
        <h2>Editar Personagem</h2>

        {/* Exemplo de como exibir e editar o nome do personagem */}
        <div className="field">
          <label>
            Nome:
            <input
              type="text"
              name="characterName"
              value={editedCharacter.characterName || ''}
              onChange={handleChange}
            />
          </label>
        </div>

        <div className="field">
          <label>
            Idade:
            <input
              type="text"
              name="age"
              value={editedCharacter.age || ''}
              onChange={handleChange}
            />
          </label>
        </div>

        <div className="field">
          <label>
            Classe:
            <input
              type="text"
              name="selectedClass"
              value={editedCharacter.selectedClass || ''}
              onChange={handleChange}
            />
          </label>
        </div>

        <div className="field">
          <label>
            Raça:
            <input
              type="text"
              name="selectedRace"
              value={editedCharacter.selectedRace || ''}
              onChange={handleChange}
            />
          </label>
        </div>

        {/* Adicione mais campos conforme necessário */}

        <button type="submit">Salvar Edições</button>
      </form>
    </div>
  );
}

export default CharacterEditor;
