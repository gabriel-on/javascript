import React, { useState, useEffect } from "react";
import { ref, push, set, onValue } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { database } from "../../firebase/config";
import { useAuth } from "../../hooks/useAuthentication";

function Lobby() {
    const [rooms, setRooms] = useState([]);
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const roomsRef = ref(database, "rooms");
        onValue(roomsRef, (snapshot) => {
            const data = snapshot.val();
            setRooms(data ? Object.keys(data) : []);
        });
    }, []);

    const createRoom = async () => {
        if (!currentUser) {
            alert("Você precisa estar logado para criar uma sala.");
            return;
        }

        const roomsRef = ref(database, "rooms");
        const newRoomRef = push(roomsRef);

        await set(newRoomRef, {
            players: {
                [currentUser.uid]: true,
            },
        });

        navigate(`/game/${newRoomRef.key}`);
    };

    return (
        <div>
            <h2>Lobby</h2>
            <button onClick={createRoom}>Create Room</button>
            <h3>Available Rooms:</h3>
            <ul>
                {rooms.map((roomId) => (
                    <li key={roomId}>
                        <a href={`/game/${roomId}`}>{roomId}</a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Lobby;
