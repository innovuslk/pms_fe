import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SupervisorJoin = () => {
    const [roomId, setRoomId] = useState('');
    const navigate = useNavigate();

    const handleJoinClick = () => {
        if (roomId.trim() !== '') {
            // Redirect to the chat room with the provided room ID
            navigate(`/chat-room/${roomId}`);
        }
    };

    return (
        <div className='content'>
            <h1>Join Chat Room as Supervisor</h1>
            <input
                type="text"
                placeholder="Enter Chat Room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
            />
            <button onClick={handleJoinClick}>Join Chat Room</button>
        </div>
    );
};

export default SupervisorJoin;