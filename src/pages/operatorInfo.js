import React, { useState, useEffect, useCallback } from 'react';
import '../assets/css/adminHome.css';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';

function OperatorInfo() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPlant, setSelectedPlant] = useState('All');
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [plantStylesData, setPlantStylesData] = useState([]);

    // Handle plant selection
    const handleFilterChange = useCallback((event) => {
        setSelectedPlant(event.target.value);
    }, []);

    // Handle date selection
    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };

    // Handle form submission to fetch data
    const handleSubmit = async () => {
        if (selectedDate && selectedPlant !== 'All') {
            setLoading(true);

            try {
                const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/get/getPlantStyles`, {
                    date: selectedDate,
                    plant: selectedPlant
                });
                // console.log(response);
                setPlantStylesData(response.data); // Set the data received from backend
            } catch (error) {
                console.error('Error fetching plant styles data', error);
            }

            setLoading(false);
        } else {
            alert('Please select a date and a plant.');
        }
    };

    return (
        <div className="content">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="input-group">
                    <span className="input-group-text"><span className="material-symbols-outlined">
                        badge
                    </span></span>
                    <input 
                        type="date" 
                        className="form-control mx-2" 
                        value={selectedDate}
                        onChange={handleDateChange}
                        required 
                    />
                </div>
                <select
                    value={selectedPlant}
                    onChange={handleFilterChange}
                    className="form-select mx-2"
                >
                    <option value="All">Select a Plant</option>
                    <option value="UPLP">UPLP</option>
                    <option value="ExcelTech">ExcelTech</option>
                    <option value="PLC">PLC</option>
                </select>

                <button 
                    type="submit" 
                    className="btn btn-primary px-4 w-auto mx-2 h-50"
                    onClick={handleSubmit}
                >
                    Submit
                </button>
            </div>

            {loading ? (
                <div className="d-flex justify-content-center align-items-center">
                    <ClipLoader size={50} color={"white"} loading={loading} />
                    <h6>Loading, please wait...</h6>
                </div>
            ) : (
                <div className="row">
                    {plantStylesData.map((plant) => (
                        <div className="col" key={plant.style}>
                            <div className="card rounded-4">
                                <div className="card-body">
                                    <h3 className="text-danger text-center">{selectedPlant}</h3>
                                    
                                    {/* Display styles and line numbers with pieceCount */}
                                    <div className="mb-4">
                                        <h5 className="text-bg-dark text-center p-2 rounded">
                                            Style - {plant.style}
                                        </h5>
                                        {plant.lineData.map((line) => (
                                            <p 
                                                className="text-center text-bg-secondary w-50 mx-auto" 
                                                key={line.lineNumber}
                                            >
                                                {line.lineNumber} - PC: {line.pieceCount}
                                            </p>
                                        ))}
                                        <p className="text-center text-bg-primary w-50 mx-auto">
                                            Total Piece Count: {plant.totalPieceCount}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default OperatorInfo;
