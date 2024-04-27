import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { ref, onValue, set, serverTimestamp } from 'firebase/database';
import { database } from "../../firebase/config";
import { useAuth } from '../../hooks/useAuthentication';
import CharacterImageUploader from "../CharacterImageUploader/CharacterImageUploader";

// CSS
import '../ChatbotResponses/ChatbotResponses.css';

const ChatbotResponses = ({ onSaveResult }) => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState("");
    const [characterName, setCharacterName] = useState("");
    const [age, setAge] = useState("");
    const [selectedRace, setSelectedRace] = useState("");
    const [attributes, setAttributes] = useState({
        Força: 0,
        Defesa: 0,
        Poder: 0,
        Vigor: 0,
        Agilidade: 0,
        Velocidade: 0,
        Inteligencia: 0,
        Destreza: 0
    });
    const [races, setRaces] = useState([]);
    const [origin, setOrigin] = useState("");
    const [successMessage, setSuccessMessage] = useState(false);
    const [powersDescription, setPowersDescription] = useState("");
    const [customId, setCustomId] = useState(null);
    const [isPublic, setIsPublic] = useState(false);
    const [characterImage, setCharacterImage] = useState(null);

    useEffect(() => {
        const classesRef = ref(database, 'classes');
        const racesRef = ref(database, 'races');

        onValue(classesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const classList = Object.values(data);
                setClasses(classList);
            }
        });

        onValue(racesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const raceList = Object.values(data);
                setRaces(raceList);
            }
        });
    }, []);

    const generateCustomId = () => {
        const length = 9;
        let customId = '';

        for (let i = 0; i < length; i++) {
            customId += Math.floor(Math.random() * 10);
        }
        return customId;
    };

    const handleSelectClass = (className) => {
        setSelectedClass(className);
    };

    const handleSelectRace = (raceName) => {
        setSelectedRace(raceName);
    };

    const handleNextStep = () => {
        setStep(step + 1);
    };

    const handlePreviousStep = () => {
        setStep(step - 1);
    };

    const handleSendButton = () => {
        // Logs existentes
        console.log("Step:", step);
        console.log("Selected Class:", selectedClass);
        console.log("Attributes:", attributes);
        console.log("Character Name:", characterName);
        console.log("Selected Race:", selectedRace);
        console.log("Age:", age);
        console.log("Origin:", origin);
        console.log("Powers Description:", powersDescription);
        console.log("Is Public:", isPublic);
        console.log("Character Image:", characterImage);

        if (step === 9) {
            const createdBy = currentUser.displayName;
            const userId = currentUser.uid;
            const createdAt = serverTimestamp();
            const id = generateCustomId();
            setCustomId(id);
            const dataToSave = {
                selectedClass,
                attributes,
                characterName,
                selectedRace,
                age,
                origin,
                createdBy,
                userId,
                createdAt,
                powersDescription,
                isPublic,
                characterImage
            };

            console.log("About to save character data...");

            set(ref(database, `characters/${userId}/${id}`), dataToSave)
                .then(() => {
                    console.log("Character data sent successfully!");
                    setSuccessMessage(true);
                })
                .catch((error) => {
                    console.error("Error sending data:", error);
                });

            console.log("Character data save request completed.");

        } else {
            handleNextStep();
        }
    };

    const handleAttributeChange = (attribute, value) => {
        if (value <= 10) {
            const currentTotal = Object.values(attributes).reduce((total, val) => total + val, 0);

            if (currentTotal + (value - (attributes[attribute] || 0)) <= 40) {
                const updatedValue = Math.max(0, value);
                setAttributes(prevAttributes => ({
                    ...prevAttributes,
                    [attribute]: updatedValue
                }));
            } else {
                alert("Total attribute points limit (40) exceeded!");
            }
        } else {
            alert("Each attribute skill can have a maximum of 10 points!");
        }
    };

    const handlePowersDescriptionChange = (event) => {
        setPowersDescription(event.target.value);
    };

    const handleNameChange = (event) => {
        setCharacterName(event.target.value);
    };

    const handleAgeChange = (event) => {
        const value = event.target.value.replace(/\D/, ''); // Somente números
        setAge(value);
    };

    const handleOriginChange = (event) => {
        setOrigin(event.target.value);
    };

    const renderClasses = () => {
        return classes.map((className, index) => (
            <div key={index}>
                <input
                    className="input-radio"
                    type="radio"
                    id={className}
                    name="class"
                    value={className}
                    checked={selectedClass === className}
                    onChange={() => handleSelectClass(className)}
                />
                <label htmlFor={className}>{className}</label>
            </div>
        ));
    };

    const renderRaces = () => {
        return races.map((raceName, index) => (
            <div key={index} >
                <input
                    className="input-radio"
                    type="radio"
                    id={raceName}
                    name="race"
                    value={raceName}
                    checked={selectedRace === raceName}
                    onChange={() => handleSelectRace(raceName)}
                />
                <label htmlFor={raceName}>{raceName}</label>
            </div>
        ));
    };

    const renderAttributes = () => {
        return (
            <div className="field">
                <div className="attribute-table attribute-container">
                    <h3>Atributos</h3>
                    <table>
                        <tbody>
                            {Object.entries(attributes).map(([attribute, value]) => (
                                <tr key={attribute}>
                                    <td>{attribute}:</td>
                                    <td>
                                        <button onClick={() => handleAttributeChange(attribute, value - 1)}>-</button>
                                        <span>{value}</span>
                                        <button onClick={() => handleAttributeChange(attribute, value + 1)}>+</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    const handlePublicToggle = () => {
        setIsPublic(!isPublic); // Inverte o estado de público/privado
    };

    const handleImageUpload = (imageUrl) => {
        setCharacterImage(imageUrl);
    };

    const renderStepContent = () => {
        if (successMessage) {
            return (
                <div>
                    <p>Personagem criado com sucesso!</p>
                    <button onClick={() => navigate(`/character-details/${customId}`)}>Ver Detalhes do Personagem</button>
                </div>
            );
        }

        switch (step) {
            case 1:
                return (
                    <div className="step-step">
                        <h2>Etapa 1: Insira o nome do personagem</h2>
                        <input type="text" value={characterName} onChange={handleNameChange} placeholder="Nome do personagem" />
                        <div>
                            <button className="btn-step" onClick={handleNextStep}>Próxima Etapa</button>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="step-step">
                        <h2>Etapa 2: Insira a idade do personagem</h2>
                        <input type="text" value={age} onChange={handleAgeChange} placeholder="Idade do personagem" />
                        <div>
                            <button className="btn-step" onClick={handlePreviousStep}>Voltar</button>
                            <button className="btn-step" onClick={handleNextStep}>Próxima Etapa</button>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="step-step">
                        <h2>Etapa 3: Escolha a raça do personagem</h2>
                        <div className="races-render">
                            {renderRaces()}
                        </div>
                        <div>
                            <button className="btn-step" onClick={handlePreviousStep}>Voltar</button>
                            <button className="btn-step" onClick={handleNextStep}>Próxima Etapa</button>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="step-step">
                        <h2>Etapa 4: Distribua os pontos de atributo</h2>
                        {renderAttributes()}
                        <div>
                            <button className="btn-step" onClick={handlePreviousStep}>Voltar</button>
                            <button className="btn-step" onClick={handleNextStep}>Próxima Etapa</button>
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div className="step-step">
                        <h2>Etapa 5: Descreva os poderes do seu personagem</h2>
                        <textarea value={powersDescription} onChange={handlePowersDescriptionChange} placeholder="Descrição dos poderes do personagem ( ͡° ͜ʖ ͡°)" />
                        <div>
                            <button className="btn-step" onClick={handlePreviousStep}>Voltar</button>
                            <button className="btn-step" onClick={handleNextStep}>Próxima Etapa</button>
                        </div>
                    </div>
                );
            case 6:
                return (
                    <div className="step-step">
                        <h2>Etapa 6: Escolha a classe do personagem</h2>
                        <div className="classes-render">
                            {renderClasses()}
                        </div>
                        <div>
                            <button className="btn-step" onClick={handlePreviousStep}>Voltar</button>
                            <button className="btn-step" onClick={handleNextStep}>Próxima Etapa</button>
                        </div>
                    </div>
                );
            case 7:
                return (
                    <div className="step-step">
                        <h2>Etapa 7: Escreva a origem do seu personagem</h2>
                        <textarea value={origin} onChange={handleOriginChange} placeholder="Descreva a origem do personagem ( ͡° ͜ʖ ͡°)" />
                        <div>
                            <button className="btn-step" onClick={handlePreviousStep}>Voltar</button>
                            <button className="btn-step" onClick={handleNextStep}>Próxima Etapa</button>
                        </div>
                    </div>
                );
            case 8:
                return (
                    <div className="step-step">
                        <h2>Etapa 8: Faça o upload da imagem do personagem</h2>
                        <CharacterImageUploader onUpload={handleImageUpload} />
                        <div>
                            <button className="btn-step" onClick={handlePreviousStep}>Voltar</button>
                            <button className="btn-step" onClick={handleNextStep}>Próxima Etapa</button>
                        </div>
                    </div>
                );
            case 9:
                return (
                    <div className="step-step final-step">
                        <h2>Etapa Final: Confirme os dados e conclua</h2>
                        <div>
                            {characterImage && (
                                <div className="character-image-preview">
                                    <p>Imagem do Personagem:</p>
                                    <img src={characterImage} alt="Imagem do Personagem" />
                                </div>
                            )}
                        </div>
                        <p>Nome: {characterName}</p>
                        <p>Idade: {age}</p>
                        <p>Raça: {selectedRace}</p>
                        <p>Classe: {selectedClass}</p>
                        <p>Poderes: {powersDescription}</p>
                        <p>Origem: {origin}</p>
                        <div>
                            <button className="btn-step" onClick={handlePreviousStep}>Voltar</button>
                            <button className="btn-step" onClick={handleSendButton}>Concluir</button>
                        </div>
                        <div>
                            <label>
                                <input type="checkbox" checked={isPublic} onChange={handlePublicToggle} />
                                Tornar personagem público
                            </label>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="render-step">
            {renderStepContent()}
        </div>
    );
};

export default ChatbotResponses;
