// StepCharacterName.jsx
import React from "react";

const StepCharacterName = ({ value, onChange, onNext }) => {
  const handleNext = () => {
    if (value.trim() !== "") {
      onNext();
    } else {
      alert("Por favor, insira um nome para o personagem.");
    }
  };

  return (
    <div>
      <h2>Passo 1: Nome do Personagem</h2>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Digite o nome do personagem"
      />
      <button onClick={handleNext}>Próximo</button>
    </div>
  );
};

export default StepCharacterName;
