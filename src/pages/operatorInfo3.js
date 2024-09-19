import React, { useState, useEffect } from 'react';
import '../assets/css/adminHome.css';
import { ClipLoader } from 'react-spinners';
import axios from 'axios';
import SupervisorEfficiency from '../components/supervisorEfficiency';

function OperatorInfo3({ plantName, onClose }) {
    const [selectedDate, setSelectedDate] = useState('');
    const [styles, setStyles] = useState([]);
    const [lineNos, setLineNos] = useState([]);
    const [selectedStyle, setSelectedStyle] = useState('');
    const [selectedLineNo, setSelectedLineNo] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);  // Update to store an array of operators
    const [dailyTarget, setDailyTarget] = useState(null);
    const [latestHour, setLatestHour] = useState();

    // Fetch styles and line numbers based on the selected date
    const fetchPlantData = async (date) => {
        setLoading(true);
        try {
            const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/get/getPlantStyles2`, {
                date,
                plant: plantName,
            });
            setStyles(response.data.styles);
            setLineNos(response.data.lineNos);
        } catch (error) {
            console.error('Error fetching styles and line numbers:', error);
        }
        setLoading(false);
    };

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

    // Fetch operator data from the backend
    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/getAllOperators`, {
                date: selectedDate,
                plant: plantName,
                style: selectedStyle,
                lineNo: selectedLineNo
            });
            setData(response.data.users);
            // console.log(response)  // Store the retrieved user data
        } catch (error) {
            console.error('Error fetching operator data:', error);
        }
        setLoading(false);
    };

    const handleDateChange = (event) => {
        const selectedDate = event.target.value;
        setSelectedDate(selectedDate);
        if (selectedDate) {
            fetchPlantData(selectedDate);
        }
    };

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

    return (
        <div>
            <button className="btn btn-danger w-auto" onClick={onClose}>Close</button>
            <h2 className="text-center mb-4">Details for Plant: {plantName}</h2>

            <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="input-group">
                    <span className="input-group-text">
                        <span className="material-symbols-outlined">badge</span>
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
                        <div className="d-flex mb-4">
                            <div className="rounded-4 bg-secondary w-auto h-auto mx-2 p-2">
                                <h5>Planned Efficiency - 100</h5>
                            </div>
                            <div className="rounded-4 bg-secondary w-auto h-auto mx-2 p-2">
                                <h5>Daily Target - {dailyTarget || 'N/A'}</h5>
                            </div>
                        </div>
                        {data.map((operator, index) => (
                            <div className="col">
                                <div className="card rounded-4">
                                    <div className="card-body d-flex flex-column align-items-center">
                                        <div className="text-center">
                                            <div key={index} className="mb-3">
                                                <SupervisorEfficiency dailyTarget={dailyTarget} pieceCount={operator.totalPieceCount} latestHour={latestHour}/>
                                                <p className="mb-1 text-bg-dark">UserName: {operator.username}</p>
                                                <p className="mb-1 text-bg-dark">Shift: {operator.shift}</p>
                                                <p className="mb-1 text-bg-dark">PieceCount: {operator.totalPieceCount || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            )}
        </div>
    );
}

export default OperatorInfo3;
