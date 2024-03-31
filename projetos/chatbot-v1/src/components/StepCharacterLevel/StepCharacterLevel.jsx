// StepCharacterLevel.jsx
import React from "react";

const StepCharacterLevel = ({ value, onChange, onNext }) => {
  const handleNext = () => {
    if (!isNaN(value) && value >= 1 && value <= 20) {
      onNext();
    } else {
      alert("Por favor, insira um nível válido para o personagem (entre 1 e 20).");
    }
  };

  return (
    <div>
      <h2>Passo 3: Nível do Personagem</h2>
      <input
        type="number"
        value={value}
        onChange={onChange}
        placeholder="Digite o nível do personagem"
      />
      <button onClick={handleNext}>Próximo</button>
    </div>
  );
};

export default StepCharacterLevel;
