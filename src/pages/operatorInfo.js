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

        const today = new Date().toISOString().split('T')[0];
        setSelectedDate(today);
    }, []);

    const handleFilterChange = (event) => {
        setSelectedPlant(event.target.value);
    };

    useEffect(() => {
        const fetchPlantStyles = async () => {
            if (selectedPlant !== 'All' && selectedDate) {
                setLoading(true);
                try {
                    const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/get/getPlantStyles`, {
                        date: selectedDate,
                        plant: selectedPlant,
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
            }
        };
        fetchPlantStyles();
    }, [selectedPlant, selectedDate]);

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };

    const handlePlantClick = (plantName, plantStyle) => {
        setOverlayPlantName(plantName);
        setOverlayStyle(plantStyle);
        setIsOverlayVisible(true);
    };

    const handleCloseOverlay = () => {
        setIsOverlayVisible(false);
    };

    const getStatus = (dailyTarget, pieceCount, latestHour) => {
        const requiredHourlyRate = dailyTarget / 10;
        const actualRate = pieceCount / latestHour;
        return actualRate >= requiredHourlyRate && pieceCount > 0 ? 'OK' : 'Behind';
    };

    // Group data by plantName
    const groupedPlantStyles = plantStylesData.reduce((acc, plant) => {
        if (!acc[plant.plantName]) {
            acc[plant.plantName] = {
                plantName: plant.plantName,
                totalPieceCount: 0,
                styles: [],
            };
        }
        acc[plant.plantName].styles.push(plant);
        acc[plant.plantName].totalPieceCount += plant.totalPieceCount;
        return acc;
    }, {});

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
                            {Object.values(groupedPlantStyles).map((plant, index) => (
                                <div className="col-md-6 mb-4" key={index}>
                                    <div
                                        className="card h-100 border-primary shadow-sm"
                                        onClick={() => handlePlantClick(plant.plantName, plant.styles.map(s => s.style).join(', '))}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className="card-header bg-primary text-white text-center">
                                            <h4>{plant.plantName}</h4>
                                        </div>
                                        <div className="card-body">
                                            {plant.styles.map((styleData, styleIndex) => (
                                                <div key={styleIndex}>
                                                    <h5 className="mb-3 text-center text-info">Style - {styleData.style}</h5>
                                                    <table className="table table-hover table-bordered text-center rounded-3">
                                                        <thead className="table-dark">
                                                            <tr>
                                                                <th scope="col">Line</th>
                                                                <th scope="col">Pieces</th>
                                                                <th scope="col">Status</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {styleData.lineData.map((line) => {
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
                                                </div>
                                            ))}
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
