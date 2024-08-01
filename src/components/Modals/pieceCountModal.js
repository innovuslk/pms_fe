import React, { useState, useEffect } from 'react';
import VirtualNumPad from './VirtualNumPad';
import axios from 'axios';

const Modal = ({ showModal, handleCloseModal, onPieceCountUpdate }) => {
    const [pieceCount, setPieceCount] = useState('');
    const [username, setUsername] = useState();
    const [pieceCountInfo, setPieceCountInfo] = useState();
    const [shiftData, setShiftData] = useState({ shift: '' });
    const [currentHour, setCurrentHour] = useState('');
    const [nextHour, setNextHour] = useState('');
    const [hour, setHour] = useState();
    const [selectedButton, setSelectedButton] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const username = window.location.pathname.split('/').pop().replace('&admin=true', '');
                setUsername(username);
                const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/get/getShift`, {
                    username: username,
                });

                setShiftData(response.data.Shift);
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
        const username = window.location.pathname.split('/').pop().replace('&admin=true', '');
        setUsername(username);
    
        try {
            const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/set/setPieceCount`, {
                username: username,
                pieceCount: pieceCount,
                shift: shiftData,
                hour: hour
            });
    
            // Store the response data in a variable
            const latestPieceCount = response.data.latestPieceCount;
            // Set the state of pieceCountInfo
            setPieceCountInfo(latestPieceCount);
            // Alert here
            alert('Successfully updated number of pieces!');
        } catch (error) {
            console.error('Error fetching latest Piece count data:', error);
        }
    };

    useEffect(() => {
        const setTimeRanges = (shift) => {
            if (shift === 'A') {
                return [
                    { startHour: 6, startMinute: 20, endHour: 7, endMinute: 40, label: '1st Hour', hourValue: 1 },
                    { startHour: 7, startMinute: 40, endHour: 8, endMinute: 40, label: '2nd Hour', hourValue: 2 },
                    { startHour: 8, startMinute: 40, endHour: 9, endMinute: 40, label: '3rd Hour', hourValue: 3 },
                    { startHour: 9, startMinute: 40, endHour: 10, endMinute: 40, label: '4th Hour', hourValue: 4 },
                    { startHour: 10, startMinute: 40, endHour: 11, endMinute: 40, label: '5th Hour', hourValue: 5 },
                    { startHour: 11, startMinute: 40, endHour: 12, endMinute: 0, label: '6th Hour', hourValue: 6 },
                    { startHour: 12, startMinute: 0, endHour: 13, endMinute: 0, label: '7th Hour', hourValue: 7 },
                    { startHour: 13, startMinute: 0, endHour: 14, endMinute: 0, label: '8th Hour', hourValue: 8 },
                ];
            } else if (shift === 'B') {
                return [
                    { startHour: 14, startMinute: 0, endHour: 14, endMinute: 20, label: '1st Hour', hourValue: 1 },
                    { startHour: 14, startMinute: 20, endHour: 15, endMinute: 20, label: '2nd Hour', hourValue: 2 },
                    { startHour: 15, startMinute: 20, endHour: 16, endMinute: 20, label: '3rd Hour', hourValue: 3 },
                    { startHour: 16, startMinute: 20, endHour: 17, endMinute: 20, label: '4th Hour', hourValue: 4 },
                    { startHour: 17, startMinute: 20, endHour: 18, endMinute: 20, label: '5th Hour', hourValue: 5 },
                    { startHour: 18, startMinute: 20, endHour: 19, endMinute: 20, label: '6th Hour', hourValue: 6 },
                    { startHour: 19, startMinute: 20, endHour: 19, endMinute: 40, label: '7th Hour', hourValue: 7 },
                    { startHour: 19, startMinute: 40, endHour: 20, endMinute: 0, label: '8th Hour', hourValue: 8 },
                ];
            } else if (shift === 'C') {
                return [
                    { startHour: 6, startMinute: 0, endHour: 6, endMinute: 20, label: '1st Hour', hourValue: 1 },
                    { startHour: 6, startMinute: 20, endHour: 7, endMinute: 20, label: '2nd Hour', hourValue: 2 },
                    { startHour: 7, startMinute: 20, endHour: 8, endMinute: 40, label: '3rd Hour', hourValue: 3 },
                    { startHour: 8, startMinute: 40, endHour: 9, endMinute: 40, label: '4th Hour', hourValue: 4 },
                    { startHour: 9, startMinute: 40, endHour: 10, endMinute: 45, label: '5th Hour', hourValue: 5 },
                    { startHour: 10, startMinute: 45, endHour: 12, endMinute: 5, label: '6th Hour', hourValue: 6 },
                    { startHour: 12, startMinute: 5, endHour: 13, endMinute: 5, label: '7th Hour', hourValue: 7 },
                    { startHour: 13, startMinute: 5, endHour: 14, endMinute: 5, label: '8th Hour', hourValue: 8 },
                    { startHour: 14, startMinute: 5, endHour: 15, endMinute: 5, label: '9th Hour', hourValue: 9 },
                    { startHour: 15, startMinute: 5, endHour: 16, endMinute: 20, label: '10th Hour', hourValue: 10 },
                    { startHour: 16, startMinute: 20, endHour: 17, endMinute: 20, label: '11th Hour', hourValue: 11 },
                ];
            } 
            else if (shift === 'D') {
                return [
                    { startHour: 18, startMinute: 0, endHour: 18, endMinute: 20, label: '1st Hour', hourValue: 1 },
                    { startHour: 18, startMinute: 20, endHour: 19, endMinute: 40, label: '2nd Hour', hourValue: 2 },
                    { startHour: 19, startMinute: 40, endHour: 20, endMinute: 40, label: '3rd Hour', hourValue: 3 },
                    { startHour: 20, startMinute: 40, endHour: 21, endMinute: 40, label: '4th Hour', hourValue: 4 },
                    { startHour: 21, startMinute: 40, endHour: 22, endMinute: 45, label: '5th Hour', hourValue: 5 },
                    { startHour: 22, startMinute: 45, endHour: 23, endMinute: 45, label: '6th Hour', hourValue: 6 },
                    { startHour: 23, startMinute: 45, endHour: 1, endMinute: 0, label: '7th Hour', hourValue: 7 },
                    { startHour: 1, startMinute: 0, endHour: 2, endMinute: 0, label: '8th Hour', hourValue: 8 },
                    { startHour: 2, startMinute: 0, endHour: 3, endMinute: 0, label: '9th Hour', hourValue: 9 },
                    { startHour: 3, startMinute: 0, endHour: 4, endMinute: 15, label: '10th Hour', hourValue: 10 },
                    { startHour: 4, startMinute: 15, endHour: 5, endMinute: 15, label: '11th Hour', hourValue: 11 },
                ];
            }
            else if (shift === 'E') {
                return [
                    { startHour: 7, startMinute: 30, endHour: 8, endMinute: 30, label: '1st Hour', hourValue: 1 },
                    { startHour: 8, startMinute: 30, endHour: 9, endMinute: 30, label: '2nd Hour', hourValue: 2 },
                    { startHour: 9, startMinute: 30, endHour: 10, endMinute: 30, label: '3rd Hour', hourValue: 3 },
                    { startHour: 10, startMinute: 45, endHour: 11, endMinute: 30, label: '4th Hour', hourValue: 4 },
                    { startHour: 11, startMinute: 30, endHour: 12, endMinute: 30, label: '5th Hour', hourValue: 5 },
                    { startHour: 13, startMinute: 0, endHour: 14, endMinute: 0, label: '6th Hour', hourValue: 6 },
                    { startHour: 14, startMinute: 0, endHour: 15, endMinute: 0, label: '7th Hour', hourValue: 7 },
                    { startHour: 15, startMinute: 0, endHour: 15, endMinute: 30, label: '8th Hour', hourValue: 8 },
                    { startHour: 15, startMinute: 45, endHour: 16, endMinute: 30, label: '9th Hour', hourValue: 9 },
                    { startHour: 16, startMinute: 30, endHour: 17, endMinute: 30, label: '10th Hour', hourValue: 10 },
                    { startHour: 17, startMinute: 30, endHour: 18, endMinute: 30, label: '11th Hour', hourValue: 11 },
                ];
            } 
            else {
                return [];
            }
        };

        const currentTime = new Date();
        const currentHourValue = currentTime.getHours();
        const minutes = currentTime.getMinutes();

        const timeRanges = setTimeRanges(shiftData);

        if (timeRanges.length === 0) {
            console.warn("No time ranges found for shift:", shiftData);
            return;
        }

        const matchingRange = timeRanges.find(range => {
            const withinHourRange =
                (currentHourValue === range.startHour && minutes >= range.startMinute) ||
                (currentHourValue > range.startHour && currentHourValue < range.endHour) ||
                (currentHourValue === range.endHour && minutes <= range.endMinute);

            return withinHourRange;
        });

        if (matchingRange) {
            setCurrentHour(matchingRange.label);
            setHour(matchingRange.hourValue);

            const nextIndex = timeRanges.indexOf(matchingRange) + 1;
            if (nextIndex < timeRanges.length) {
                setNextHour(timeRanges[nextIndex].label);
                setHour(matchingRange.hourValue);
            } else {
                setNextHour('No data');
            }
        } else {
            setCurrentHour('No data');
            setNextHour('No data');
        }
    }, [shiftData]);

    const handleButtonSelect = (label, hourValue) => {
        setHour((label) => (selectedButton === label ? '' : hourValue));
        setSelectedButton((prevButton) => (prevButton === label ? null : label));
    };

    const handleOk = async () => {
        try {
            // Fetch the latest piece count
            await fetchLatestPieceCount();
            onPieceCountUpdate(pieceCount);
            setPieceCount('');
            setSelectedButton(null);
            return true;
        } catch (error) {
            console.error('Error handling OK:', error);
            return false;
        }
    };

    const handleOkWithClose = async () => {
        let success = await handleOk().then(handleCloseModal());
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
                            onClick={() => handleButtonSelect(currentHour, hour)}
                        >
                            {currentHour}
                        </button>
                        <button
                            type="button"
                            className={`btn btn-secondary mx-2 ${selectedButton === nextHour ? 'active btn btn-warning' : ''}`}
                            onClick={() => handleButtonSelect(nextHour, hour)}
                        >
                            {nextHour}
                        </button>
                    </div>
                    <div className="modal-body align-content-center justify-content-center mx-3">
                        <label htmlFor="pieceCount" className='mb-2'>Add Piece Count:</label>
                        <input name="pieceCount" type="number" className="form-control" id="pieceCount" validate={{ required: true }} placeholder="Enter Piece Count" value={pieceCount} />
                    </div>
                    {selectedButton && <VirtualNumPad onKeyPress={handleKeyPress} onDelete={handleDelete} onOk={handleOkWithClose} />}
                    <div className="modal-footer">
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
