// StepCharacterClass.jsx
import React from "react";

const StepCharacterClass = ({ value, onChange, onNext }) => {
  const handleNext = () => {
    if (value.trim() !== "") {
      onNext();
    } else {
      alert("Por favor, insira a classe do personagem.");
    }
  };

  return (
    <div>
      <h2>Passo 2: Classe do Personagem</h2>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Digite a classe do personagem"
      />
      <button onClick={handleNext}>Próximo</button>
    </div>
  );
};

export default StepCharacterClass;
