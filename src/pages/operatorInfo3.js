import React, { useState, useEffect } from 'react';
import '../assets/css/adminHome.css';
import { ClipLoader } from 'react-spinners';
import axios from 'axios';
import SupervisorEfficiency from '../components/supervisorEfficiency';

function OperatorInfo3({ plantName, selectedDate: initialDate, selectedStyle: initialStyle, selectedLineNo: initialLineNo, onClose }) {
    const [selectedDate, setSelectedDate] = useState('');
    const [styles, setStyles] = useState([]);
    const [lineNos, setLineNos] = useState([]);
    const [selectedStyle, setSelectedStyle] = useState('');
    const [selectedLineNo, setSelectedLineNo] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [dailyTarget, setDailyTarget] = useState(null);
    const [plannedTarget, setPlannedTarget] = useState(null);
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

    // Set default values from the props coming from OperatorInfo2
    useEffect(() => {
        setSelectedDate(initialDate || '');
        setSelectedStyle(initialStyle || '');
        setSelectedLineNo(initialLineNo || '');

        if (initialDate) {
            fetchPlantData(initialDate); // Fetch data when date is set
        }
    }, [initialDate, initialStyle, initialLineNo]);

    // Auto-submit when the selectedLineNo is set
    useEffect(() => {
        if (selectedDate && selectedStyle && selectedLineNo) {
            handleSubmit();
        }
    }, [selectedDate, selectedStyle, selectedLineNo]);

    useEffect(() => {
        if (selectedLineNo) {
            fetchLatestHour();
            const intervalId = setInterval(fetchLatestHour, 10000);
            return () => clearInterval(intervalId);
        }
    }, [selectedLineNo]);

    useEffect(() => {
        if (selectedDate && selectedLineNo) {
            getDailyTarget();
        }
    }, [selectedDate, selectedLineNo]);

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
        } catch (error) {
            console.error('Error fetching operator data:', error);
        }
        setLoading(false);
    };

    const handleDateChange = (event) => {
        const date = event.target.value;
        setSelectedDate(date);
        if (date) {
            fetchPlantData(date);
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
            setPlannedTarget(response.data.plannedTarget);
        } catch (error) {
            console.error('Error fetching daily target:', error);
        }
    };

    const encodeCredentials = (username) => {
        const encodedUsername = btoa(username);
        return { encodedUsername };
    };

    const getStatus = (pieceCount, dailyTarget) => {
        const requiredHourlyRate = dailyTarget / 10;
        const actualRate = pieceCount / 10;
        return actualRate >= requiredHourlyRate && pieceCount > 0 ? 'OK' : 'Behind';
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
                                <h5>Planned Efficiency - {plannedTarget || 'N/A'}</h5>
                            </div>
                            <div className="rounded-4 bg-secondary w-auto h-auto mx-2 p-2">
                                <h5>Daily Target - {dailyTarget || 'N/A'}</h5>
                            </div>
                        </div>
                        {data.map((operator, index) => {
                            const { encodedUsername } = encodeCredentials(operator.username);
                            return (
                                <div className="col" key={index}>
                                    <div className="card rounded-4">
                                        <div className="card-body d-flex flex-column align-items-center">
                                            <div className="text-center">
                                                <SupervisorEfficiency dailyTarget={dailyTarget} pieceCount={operator.totalPieceCount} latestHour={latestHour} />
                                                <p className="mb-1 text-bg-dark text-warning font-weight-bold">Operation: {operator.operation}</p>
                                                <p className="mb-1 text-bg-dark">UserName: {operator.username}</p>
                                                <p className="mb-1 text-bg-dark">Shift: {operator.shift}</p>
                                                <p className="mb-1 text-bg-dark">PieceCount: {operator.totalPieceCount || 'N/A'}</p>
                                                <div className={`w-50 mx-auto text-center rounded-5 ${getStatus(operator.totalPieceCount, dailyTarget) === 'OK' ? 'bg-success' : 'bg-danger'}`}>
                                                {getStatus(operator.totalPieceCount, dailyTarget)}
                                            </div>
                                                <a
                                                    href={`http://${process.env.REACT_APP_HOST_IP2}/user-info/${encodedUsername}&admin=true`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-info mt-2"
                                                >
                                                Visit Dashboard
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )
            )}
        </div>
    );
}

export default OperatorInfo3;
