import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';

function GetUserInfo() {
    const [userInfo, setUserInfo] = useState({});
    const [username, setUsername] = useState();
    const [pieceCount, setPieceCount] = useState();

    function handleSubmit(event) {
        event.preventDefault();
        // Handle form submission logic if needed
    }

    useEffect(() => {
        const fetchUserInfo = async () => {
            const username = window.location.pathname.split('/').pop();
            setUsername(username);
            try {
                const response = await axios.get(`http://4.193.94.82:5000/info/getInfo/${username}`);
                setUserInfo(response.data);
            } catch (error) {
                console.error('Error fetching user information:', error.message);
            }
        };

        // Fetch user information only if username is not empty
        fetchUserInfo();
    }, []);

    return (
        <div className='container'>
            <div className='row justify-content-center align-items-center mt-5 min-vh-100'>
                <div className='col-md-6'>
                    <div className='card'>
                        <div className='card-body'>
                            <h3 className='card-title mb-4'>Operator Information</h3>
                            <div className='mb-3'>
                                <strong>Username:</strong>
                                <p>{username}</p>
                            </div>
                            <div className='mb-3'>
                                <strong>Line Number:</strong>
                                <p>{userInfo.line_number}</p>
                            </div>
                            <div className='mb-3'>
                                <strong>Factory:</strong>
                                <p>{userInfo.factory}</p>
                            </div>
                        </div>
                        
                    </div>
                </div>

                <div className='col-md-6'>
                    <div className='card'>
                        <div className='card-body'>
                            <h3 className='card-title mb-4'>Enter Piece Count</h3>
                            <form onSubmit={handleSubmit}>
                                <div className='mb-3'>
                                    <label htmlFor="pieceCount" className='form-label'>Piece Count:</label>
                                    <input
                                        type="number"
                                        id="pieceCount"
                                        className='form-control'
                                        placeholder='Enter Piece Count'
                                        onChange={(e) => setPieceCount(e.target.value)}
                                    />
                                </div>
                                <button type="submit" className='btn btn-primary'>Submit</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GetUserInfo;
