import React, { useState, useEffect, useCallback } from 'react';
import '../assets/css/adminHome.css';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import OperatorInfo2 from '../pages/operatorInfo2';

function OperatorInfo() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPlant, setSelectedPlant] = useState('All');
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [plantStylesData, setPlantStylesData] = useState([]);
    const [isOverlayVisible, setIsOverlayVisible] = useState(false);
    const [overlayPlantName, setOverlayPlantName] = useState('');
    const [overlayStyle, setOverlayStyle] = useState('');

    // Fetch all plant details on component mount
    useEffect(() => {
        const fetchAllPlantDetails = async () => {
            setLoading(true);
            try {
                const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/get/getAllPlantDetails`);
                setPlantStylesData(response.data);
            } catch (error) {
                console.error('Error fetching all plant details', error);
            }
            setLoading(false);
        };

        fetchAllPlantDetails();
        
        // Set today's date when component mounts
        const today = new Date().toISOString().split('T')[0]; // Get YYYY-MM-DD format
        setSelectedDate(today);
    }, []);

    // Handle plant selection
    const handleFilterChange = useCallback((event) => {
        setSelectedPlant(event.target.value);
    }, []);

    // Handle date selection
    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };

    // Fetch data based on selected date and plant
    const handleSubmit = async () => {
        if (selectedDate && selectedPlant !== 'All') {
            setLoading(true);
            try {
                const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/get/getPlantStyles`, {
                    date: selectedDate,
                    plant: selectedPlant
                });
                setPlantStylesData(response.data);
            } catch (error) {
                console.error('Error fetching plant styles data', error);
            }
            setLoading(false);
        } else {
            const fetchAllPlantDetails = async () => {
                setLoading(true);
                try {
                    const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/get/getAllPlantDetails`);
                    setPlantStylesData(response.data);
                } catch (error) {
                    console.error('Error fetching all plant details', error);
                }
                setLoading(false);
            };
    
            fetchAllPlantDetails();
            
            // Set today's date when component mounts
            const today = new Date().toISOString().split('T')[0]; // Get YYYY-MM-DD format
            setSelectedDate(today);
        }
    };

    // Handle plant click to open overlay and pass selected style
    const handlePlantClick = (plantName, plantStyle) => {
        setOverlayPlantName(plantName);
        setOverlayStyle(plantStyle);
        setIsOverlayVisible(true); // Show overlay and hide OperatorInfo
    };

    // Handle closing the overlay
    const handleCloseOverlay = () => {
        setIsOverlayVisible(false); // Hide overlay and show OperatorInfo
    };

    return (
        <div className="content">
            {/* Conditionally render OperatorInfo or OperatorInfo2 based on overlay visibility */}
            {!isOverlayVisible ? (
                <>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <input 
                            type="date" 
                            className="form-control mx-2" 
                            value={selectedDate}
                            onChange={handleDateChange}
                            required 
                        />
                        <select
                            value={selectedPlant}
                            onChange={handleFilterChange}
                            className="form-select mx-2"
                        >
                            <option value="All">All Plants</option>
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
                                <div className="col cursor-pointer" key={plant.style}>
                                    <div 
                                        className="card rounded-4"
                                        onClick={() => handlePlantClick(plant.plantName || selectedPlant, plant.style)} // Pass the selected plant name and style
                                    >
                                        <div className="card-body">
                                            <h3 className="text-danger text-center">{plant.plantName || selectedPlant}</h3>
                                            
                                            <div className="mb-4">
                                                <h5 className="text-bg-dark text-center p-2 rounded">
                                                    Style - {plant.style}
                                                </h5>
                                                {plant.lineData.map((line) => (
                                                    <p 
                                                        className="text-center text-bg-secondary w-50 mx-auto" 
                                                        key={line.lineNumber}
                                                    >
                                                        {line.lineNumber} - Pieces: {line.pieceCount}
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
                </>
            ) : (
                <OperatorInfo2 
                    plantName={overlayPlantName} 
                    date={selectedDate}
                    style={overlayStyle} // Pass the selected style to OperatorInfo2
                    onClose={handleCloseOverlay}
                />
            )}
        </div>
    );
}

export default OperatorInfo;
