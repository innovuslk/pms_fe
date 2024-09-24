import React, { useState, useEffect } from 'react';
import '../assets/css/adminHome.css';
import { ClipLoader } from 'react-spinners';
import axios from 'axios';
import SupervisorEfficiency from '../components/supervisorEfficiency';
import OperatorInfo3 from './operatorInfo3';

function OperatorInfo2({ plantName, onClose, date, style }) {
    const [selectedDate, setSelectedDate] = useState(date || ''); // Initialize with the passed date
    const [styles, setStyles] = useState([]);
    const [lineNos, setLineNos] = useState([]);
    const [selectedStyle, setSelectedStyle] = useState(style || ''); // Initialize with passed style
    const [selectedLineNo, setSelectedLineNo] = useState('');
    const [loading, setLoading] = useState(false);
    const [latestHour, setLatestHour] = useState();
    const [data, setData] = useState(null);
    const [dailyTarget, setDailyTarget] = useState();
    const [isOverlayVisible, setIsOverlayVisible] = useState(false);

    useEffect(() => {
        if (selectedLineNo) {
            fetchLatestHour();
            const intervalId = setInterval(fetchLatestHour, 10000);
            return () => clearInterval(intervalId);
        }
    }, [selectedLineNo]);

    useEffect(() => {
        if (selectedLineNo) {
            getDailyTarget();
            const intervalId = setInterval(getDailyTarget, 10000);
            return () => clearInterval(intervalId);
        }
    }, [selectedLineNo]);

    // Fetch styles and line numbers for the plant
    const fetchPlantData = async (date) => {
        setLoading(true);
        try {
            const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/get/getPlantStyles2`, {
                date,
                plant: plantName,
            });
            setStyles(response.data.styles);
            setLineNos(response.data.lineNos);
            setDailyTarget(response.data.dailyTarget);

            // Set the first line number as the default
            if (response.data.lineNos.length > 0) {
                setSelectedLineNo(response.data.lineNos[0]);
            }
        } catch (error) {
            console.error('Error fetching styles and line numbers:', error);
        }
        setLoading(false);
    };

    // Fetch latest hour data for the line
    const fetchLatestHour = async () => {
        try {
            const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/getPieceCountByLine`, {
                lineNo: selectedLineNo,
            });
            setLatestHour(response.data.latestHour);
        } catch (error) {
            console.error('Error fetching latest hour:', error);
        }
    };

    const getDailyTarget = async () => {
        try {
            const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/get/getDailyTargetByLine`, {
                lineNo: selectedLineNo,
                date: selectedDate,
            });
            setDailyTarget(response.data.dailyTarget);
        } catch (error) {
            console.error('Error fetching daily target:', error);
        }
    };

    useEffect(() => {
        if (selectedDate) {
            fetchPlantData(selectedDate); // Fetch data for the selected date when selectedDate changes
        }
    }, [selectedDate]);

    useEffect(() => {
        // Auto-submit when style and line number are set
        if (selectedStyle && selectedLineNo) {
            handleSubmit();
        }
    }, [selectedStyle, selectedLineNo]);

    const handleDateChange = (event) => {
        const selectedDate = event.target.value;
        setSelectedDate(selectedDate);
        if (selectedDate) {
            fetchPlantData(selectedDate); // Fetch data for the selected date
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/get/getStylesData`, {
                date: selectedDate,
                plant: plantName,
                style: selectedStyle,
                lineNo: selectedLineNo,
            });
            setData(response.data); // Store the response data
        } catch (error) {
            console.error('Error fetching piece count and sales order:', error);
        }
        setLoading(false);
    };

    const handleLineClick = () => {
        setIsOverlayVisible(true); // Show overlay for more details
    };

    const handleCloseOverlay = () => {
        setIsOverlayVisible(false); // Close the overlay and show main content
    };

    return (
        !isOverlayVisible ? (
            <div>
                <button className="btn btn-danger w-auto" onClick={onClose}>Close</button>
                <h2 className="text-center mb-4">Details for Plant: {plantName}</h2>

                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="input-group">
                        <span className="input-group-text">
                            <span className="material-symbols-outlined">
                                badge
                            </span>
                        </span>
                        <input
                            type="date"
                            className="form-control mx-2"
                            value={selectedDate}
                            onChange={handleDateChange}
                            required
                        />
                    </div>

                    <select
                        className="form-select mx-2"
                        value={selectedStyle}
                        onChange={(e) => setSelectedStyle(e.target.value)}
                    >
                        <option value="">Select Style</option>
                        {styles.map((style, index) => (
                            <option key={index} value={style}>{style}</option>
                        ))}
                    </select>

                    <select
                        className="form-select mx-2"
                        value={selectedLineNo}
                        onChange={(e) => setSelectedLineNo(e.target.value)}
                    >
                        <option value="">Select Line No</option>
                        {lineNos.map((lineNo, index) => (
                            <option key={index} value={lineNo}>{lineNo}</option>
                        ))}
                    </select>

                    <button
                        type="submit"
                        className="btn btn-primary px-4 w-auto mx-2 h-50"
                        onClick={handleSubmit}
                        disabled={loading || !selectedDate || !selectedStyle || !selectedLineNo}
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
                    data && (
                        <div className="row">
                            <div className="col">
                                <div className="card rounded-4 cursor-pointer" onClick={handleLineClick}>
                                    <div className="card-body">
                                        <h4 className="text-warning text-center">Style - {data.style}</h4>
                                        <div className="d-flex">
                                            <div className="col-6 align-content-center">
                                                <h5 className="mx-auto text-center">Efficiency</h5>
                                                <SupervisorEfficiency
                                                    pieceCount={data.pieceCount}
                                                    dailyTarget={dailyTarget}
                                                    latestHour={latestHour}
                                                />
                                            </div>
                                            <div className="col-6 align-content-center">
                                                <p className="text-bg-dark">Line No - {data.lineNo}</p>
                                                <p className="text-bg-dark">Piece Count - {data.pieceCount}</p>
                                                <p className="text-bg-dark">Sales Order - {data.salesOrder}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                )}
            </div>
        ) : (
            <OperatorInfo3
                onClose={handleCloseOverlay}
                plantName={plantName}
                selectedDate={selectedDate}
                selectedStyle={selectedStyle}
                selectedLineNo={selectedLineNo}
            />
        )
    );
}

export default OperatorInfo2;
