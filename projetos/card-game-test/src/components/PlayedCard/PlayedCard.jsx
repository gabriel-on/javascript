import React from "react";
import "./PlayedCard.css";

function PlayedCard({ card }) {
  return (
    <div className="played-card">
      {card ? (
        <div className="card-container">
          <div className="card">
            <img src={card.image} alt={`Card ${card.id}`} className="card-image" />
            <div className="card-stats">
              <p className="stat">Ataque: {card.attack}</p>
              <p className="stat">Defesa: {card.defense}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="no-card">No card played</div>
      )}
    </div>
  );
}

export default PlayedCard;
