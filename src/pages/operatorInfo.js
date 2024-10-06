import React, { useState, useEffect } from 'react';
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
    const handleFilterChange = (event) => {
        setSelectedPlant(event.target.value);
    };

    // Fetch data based on selected date and plant whenever plant or date changes
    useEffect(() => {
        const fetchPlantStyles = async () => {
            if (selectedPlant !== 'All' && selectedDate) {
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
                // Fetch all plant details if "All" is selected
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
            }
        };
        fetchPlantStyles();
    }, [selectedPlant, selectedDate]);

    // Handle date selection
    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
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

    // Helper function to determine the status based on dailyTarget and pieceCount
    const getStatus = (dailyTarget, pieceCount, latestHour) => {
        const requiredHourlyRate = dailyTarget / 10;
        const actualRate = pieceCount / latestHour;
        return actualRate >= requiredHourlyRate && pieceCount > 0 ? 'OK' : 'Behind';
    };

    return (
        <div className="content mt-5">
            {!isOverlayVisible ? (
                <>
                    <div className="row mb-4 mt-2">
                        <div className="col-md-6 mb-2">
                            <input
                                type="date"
                                className="form-control"
                                value={selectedDate}
                                onChange={handleDateChange}
                                style={{ fontWeight: 'bold' }}
                            />
                        </div>
                        <div className="col-md-6 mb-2">
                            <select
                                value={selectedPlant}
                                onChange={handleFilterChange}
                                className="form-select"
                                style={{ fontWeight: 'bold' }}
                            >
                                <option value="All">All Plants</option>
                                <option value="UPLP">UPLP</option>
                                <option value="ExcelTech">ExcelTech</option>
                                <option value="PLC">PLC</option>
                            </select>
                        </div>
                    </div>
    
                    {loading ? (
                        <div className="d-flex justify-content-center align-items-center">
                            <ClipLoader size={50} color={"#007bff"} loading={loading} />
                            <span className="ms-2 text-primary">Loading, please wait...</span>
                        </div>
                    ) : (
                        <div className="row g-4">
                            {plantStylesData.map((plant, index) => (
                                <div className="col-md-6 mb-4" key={index}>
                                    <div
                                        className="card h-100 border-primary shadow-sm"
                                        onClick={() => handlePlantClick(plant.plantName || selectedPlant, plant.style)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className="card-header bg-primary text-white text-center">
                                            <h4>{plant.plantName || selectedPlant}</h4>
                                        </div>
                                        <div className="card-body">
                                            <h5 className="text-muted mb-3 text-center">Style - {plant.style}</h5>
    
                                            <table className="table table-hover table-bordered text-center">
                                                <thead className="table-primary">
                                                    <tr>
                                                        <th scope="col">Line</th>
                                                        <th scope="col">Pieces</th>
                                                        <th scope="col">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {plant.lineData.map((line) => {
                                                        const status = getStatus(line.dailyTarget, line.pieceCount, line.latestHour);
                                                        return (
                                                            <tr key={line.lineNumber}>
                                                                <td>• {line.lineNumber}</td>
                                                                <td>{line.pieceCount}</td>
                                                                <td>
                                                                    <span className={`badge ${status === 'OK' ? 'bg-success' : 'bg-warning text-dark'}`}>
                                                                        {status}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                            <hr className="bg-primary" />
                                            <div className="text-center">
                                                <span className="badge bg-primary p-2">
                                                    Total Pieces: {plant.totalPieceCount}
                                                </span>
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
                    style={overlayStyle}
                    onClose={handleCloseOverlay}
                />
            )}
        </div>
    );
}

export default OperatorInfo;
