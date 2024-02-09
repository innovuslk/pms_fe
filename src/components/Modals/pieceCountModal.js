// Modal.js
import React, { useState, useEffect,useRef } from 'react';
import VirtualNumPad from './VirtualNumPad';
import axios from 'axios';

const Modal = ({ showModal, handleCloseModal, onPieceCountUpdate }) => {
    const [pieceCount, setPieceCount] = useState('');
    const [username, setUsername] = useState();
    const [pieceCountInfo, setPieceCountInfo] = useState();
    const [shiftData, setShiftData] = useState({ shift: '' });
    const [currentHour,setCurrentHour] = useState('');
    const [nextHour,setNextHour] = useState('');
    const [hour,setHour] = useState();
    const [selectedButton, setSelectedButton] = useState(null);



    useEffect(() => {
        const fetchData = async () => {
            try {
                const username = window.location.pathname.split('/').pop();
                setUsername(username);
                const response = await axios.post('http://4.193.94.82:5000/get/getShift', {
                    username: username,
                });

                setShiftData(response.data.Shift);
                console.log(response);
            } catch (error) {
                console.error("Failed to get the shift", error);
            }
        };

        fetchData();

        const intervalId = setInterval(fetchData, 10000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);


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
            const response = await axios.post('http://4.193.94.82:5000/set/setPieceCount', {
                username: username,
                pieceCount: pieceCount,
                shift:shiftData,
                hour: hour
            }).then(
                alert('Successfully updated number of pieces!')
            );

            setPieceCountInfo(response.data.latestPieceCount);
        } catch (error) {
            console.error('Error fetching latest Piece count data:', error);
        }
    };

    useEffect(() => {
        console.log(shiftData);
    
        if (shiftData === 'A') {
            const currentTime = new Date();
            const currentHourValue = currentTime.getHours();
            const minutes = currentTime.getMinutes();
    
            // Define time ranges with start and end minutes
            const timeRanges = [
                { startHour: 6, startMinute: 20, endHour: 7, endMinute: 40, label: '1st Hour' },
                { startHour: 7, startMinute: 40, endHour: 8, endMinute: 40, label: '2nd Hour' },
                { startHour: 8, startMinute: 40, endHour: 9, endMinute: 40, label: '3rd Hour' },
                { startHour: 9, startMinute: 40, endHour: 10, endMinute: 40, label: '4th Hour' },
                { startHour: 10, startMinute: 40, endHour: 11, endMinute: 40, label: '5th Hour' },
                { startHour: 11, startMinute: 40, endHour: 12, endMinute: 0, label: '6th Hour' },
                { startHour: 12, startMinute: 0, endHour: 13, endMinute: 0, label: '7th Hour' },
                { startHour: 13, startMinute: 0, endHour: 14, endMinute: 0, label: '8th Hour' },
            ];
    
            // Find the matching time range
            const matchingRange = timeRanges.find(range => {
                const withinHourRange =
                    (currentHourValue === range.startHour && minutes >= range.startMinute) ||
                    (currentHourValue > range.startHour && currentHourValue < range.endHour) ||
                    (currentHourValue === range.endHour && minutes <= range.endMinute);
    
                return withinHourRange;
            });
    
            if (matchingRange) {
                setCurrentHour(matchingRange.label);
    
                // Find the next time range
                const nextIndex = timeRanges.indexOf(matchingRange) + 1;
                if (nextIndex < timeRanges.length) {
                    setNextHour(timeRanges[nextIndex].label);
                } else {
                    setNextHour('No data');
                }
            } else {
                setCurrentHour('No data');
                setNextHour('No data');
            }
        }


        if (shiftData === 'B') {
            const currentTime = new Date();
            const currentHourValue = currentTime.getHours();
            const minutes = currentTime.getMinutes();
    
            // Define time ranges with start and end minutes
            const timeRanges = [
                { startHour: 14, startMinute: 0, endHour: 14, endMinute: 20, label: '1st Hour' },
                { startHour: 14, startMinute: 20, endHour: 15, endMinute: 20, label: '2nd Hour' },
                { startHour: 15, startMinute: 20, endHour: 16, endMinute: 20, label: '3rd Hour' },
                { startHour: 16, startMinute: 20, endHour: 17, endMinute: 20, label: '4th Hour' },
                { startHour: 17, startMinute: 20, endHour: 18, endMinute: 20, label: '5th Hour' },
                { startHour: 18, startMinute: 20, endHour: 19, endMinute: 20, label: '6th Hour' },
                { startHour: 19, startMinute: 20, endHour: 19, endMinute: 40, label: '7th Hour' },
                { startHour: 19, startMinute: 40, endHour: 20, endMinute: 0, label: '8th Hour' },
            ];
    
            // Find the matching time range
            const matchingRange = timeRanges.find(range => {
                const withinHourRange =
                    (currentHourValue === range.startHour && minutes >= range.startMinute) ||
                    (currentHourValue > range.startHour && currentHourValue < range.endHour) ||
                    (currentHourValue === range.endHour && minutes <= range.endMinute);
    
                return withinHourRange;
            });
    
            if (matchingRange) {
                setCurrentHour(matchingRange.label);
    
                // Find the next time range
                const nextIndex = timeRanges.indexOf(matchingRange) + 1;
                if (nextIndex < timeRanges.length) {
                    setNextHour(timeRanges[nextIndex].label);
                } else {
                    setNextHour('No data');
                }
            } else {
                setCurrentHour('No data');
                setNextHour('No data');
            }
        }
    }, [shiftData]);

const handleButtonSelect = (hour) => {
    setHour((prevCount) => (selectedButton === hour ? '' : hour));
    setSelectedButton((prevButton) => (prevButton === hour ? null : hour));
};


    const handleOk = async () => {
        try {
            // Fetch the latest piece count
            await fetchLatestPieceCount().then(() => {
                onPieceCountUpdate(() => pieceCount);
                setPieceCount('');
                setSelectedButton(null);
                handleCloseModal();
            });
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
                    <div className="btn-group mt-3 mx-5">
                    <button
                        type="button"
                        className={`btn btn-secondary mx-2 ${selectedButton === currentHour ? 'btn btn-warning' : ''}`}
                        onClick={() => handleButtonSelect(currentHour)}
                    >
                        {currentHour}
                    </button>
                    <button
                        type="button"
                        className={`btn btn-secondary mx-2 ${selectedButton === nextHour ? 'active btn btn-warning' : ''}`}
                        onClick={() => handleButtonSelect(nextHour)}
                    >
                        {nextHour}
                    </button>
                </div>
                    <div className="modal-body align-content-center justify-content-center mx-3">
                        <label htmlFor="pieceCount" className='mb-2'>Add Piece Count:</label>
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
