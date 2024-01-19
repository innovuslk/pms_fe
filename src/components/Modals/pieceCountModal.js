// Modal.js
import React, { useState, useEffect } from 'react';
import VirtualNumPad from './VirtualNumPad';
import axios from 'axios';

const Modal = ({ showModal, handleCloseModal, onPieceCountUpdate }) => {
    const [pieceCount, setPieceCount] = useState('');
    const [username, setUsername] = useState();
    const [pieceCountInfo, setPieceCountInfo] = useState();



    const handleKeyPress = (value) => {
        setPieceCount((prevCount) => prevCount + value);
    };

    const handleDelete = () => {
        setPieceCount((prevCount) => prevCount.slice(0, -1));
    };

    const fetchLatestPieceCount = async () => {
        const username = window.location.pathname.split('/').pop();
        setUsername(username);

        try {
            const response = await axios.post('http://localhost:5000/set/setPieceCount', {
                username: username,
                pieceCount: pieceCount,
            });

            setPieceCountInfo(response.data.latestPieceCount);
        } catch (error) {
            console.error('Error fetching latest Piece count data:', error);
        }
    };




    const handleOk = async () => {
        try {
            // Fetch the latest piece count
            await fetchLatestPieceCount()
                .then(
                    onPieceCountUpdate(pieceCount),
                    handleCloseModal()
                    , setPieceCount('')
                );


            // Close the modal


        } catch (error) {
            console.error('Error handling OK:', error);
        }
    };

    return (
        <div
            className={`modal fade${showModal ? ' show' : ''}`}
            tabIndex="-1"
            role="dialog"
            style={{ display: showModal ? 'block' : 'none' }}
        >
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title text-info">Add Piece Count</h5>
                        <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseModal}></button>
                    </div>
                    <div className="modal-body align-content-center justify-content-center mx-3">
                        <h4 className='mb-3'>Pieces for 3rd Hour</h4>
                        <label htmlFor="pieceCount" className='mb-2'>Piece Count:</label>
                        <input name="pieceCount" type="number" className="form-control" id="pieceCount" validate={{ required: true }} placeholder="Enter Piece Count" value={pieceCount} />
                    </div>
                    <VirtualNumPad onKeyPress={handleKeyPress} onDelete={handleDelete} onOk={handleOk} />
                    <div className="modal-footer">
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
