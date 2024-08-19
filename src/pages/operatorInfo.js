import React, { useState, useEffect, useCallback, useMemo } from 'react';
import '../assets/css/adminHome.css';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import SupervisorEfficiency from '../components/supervisorEfficiency';

function OperatorInfo() {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPlant, setSelectedPlant] = useState('All');
    const [loading, setLoading] = useState(true); 
    const [dailyTarget, setDaillytarget] = useState([]);

    // Fetch all users and their data
    const getAllUsers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/getAllOperators`, {});
            const usersData = await Promise.all(response.data.Users.map(async (user) => {
                const [pieceCountRes, shiftRes, smvRes] = await Promise.all([
                    axios.post(`http://${process.env.REACT_APP_HOST_IP}/set/getPieceCount`, { username: btoa(user.username) }),
                    axios.post(`http://${process.env.REACT_APP_HOST_IP}/get/getShift`, { username: btoa(user.username) }),
                    axios.post(`http://${process.env.REACT_APP_HOST_IP}/get/getsmv`, { username: btoa(user.username) })
                ]);
                return {
                    ...user,
                    pieceCount: pieceCountRes.data.totalPieceCount,
                    latestHour: pieceCountRes.data.latestHour,
                    plantName: pieceCountRes.data.plantName,
                    shift: shiftRes.data.Shift,
                    smv: smvRes.data.smv
                };
            }));
            setUsers(usersData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        getAllUsers();
        const intervalId = setInterval(getAllUsers, 1000000);
        return () => clearInterval(intervalId);
    }, [getAllUsers]);

    const getDailyTarget = useCallback(async () => {
        try {
            const username = window.location.pathname.split('/').pop();
            const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/get/getSupervisorDailyTarget`, {
                username: username 
            });
            setDaillytarget(response.data.dailyTargets);
        } catch (error) {
            console.error("Failed to fetch daily target", error);
        }
    }, []);

    useEffect(() => {
        getDailyTarget();
        const intervalId = setInterval(getDailyTarget, 10000);
        return () => clearInterval(intervalId);
    }, [getDailyTarget]);

    const handleSearchChange = useCallback((event) => {
        setSearchQuery(event.target.value);
    }, []);

    const handleFilterChange = useCallback((event) => {
        setSelectedPlant(event.target.value);
    }, []);

    const filteredUsers = useMemo(() => {
        return users.filter(user => 
            (selectedPlant === 'All' || user.plantName === selectedPlant) &&
            user.username.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [users, selectedPlant, searchQuery]);

    const getMatchingDailyTarget = (userPlantName) => {
        const target = dailyTarget.find(target => target.plantName === userPlantName);
        return target ? target.dailyTarget : 'No Target'; // Provide a fallback if no match is found
    };

    return (
        <div className="content">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="input-group">
                    <span className="input-group-text">
                        <i className="bi bi-search"></i>
                    </span>
                    <input
                        type="text"
                        placeholder="Search by Username..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="form-control"
                    />
                </div>
                <select
                    value={selectedPlant}
                    onChange={handleFilterChange}
                    className="form-select"
                >
                    <option value="All">All Plants</option>
                    <option value="UPLP">UPLP</option>
                    <option value="ExcelTech">ExcelTech</option>
                    <option value="PLC">PLC</option>
                </select>
            </div>
            {loading ? (
                <div className="d-flex justify-content-center align-items-center">
                    <ClipLoader size={50} color={"white"} loading={loading} />
                    <h6> loading please wait .. </h6>
                </div>
            ) : (
                filteredUsers.map((user, index) => (
                    index % 3 === 0 && 
                    <div key={index} className="row">
                        {filteredUsers.slice(index, index + 3).map((user, subIndex) => (
                            <div key={subIndex} className="col">
                                <div className="card rounded-4">
                                    <div className="card-body d-flex flex-column align-items-center">
                                        <div className="mb-0">
                                            <SupervisorEfficiency 
                                                pieceCount={user.pieceCount} 
                                                latestHour={user.latestHour} 
                                                dailyTarget={getMatchingDailyTarget(user.plantName)}
                                            />
                                        </div>
                                        <div className="text-center">
                                            <p className="mb-1 text-bg-dark">UserName - {user.username}</p>
                                            <p className="mb-1 text-bg-dark">Plant - {user.plantName}</p>
                                            <p className="mb-1 text-bg-dark">PieceCount - {user.pieceCount}</p>
                                            <p className="mb-1 text-bg-dark">Shift - {user.shift}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ))
            )}
        </div>
    );
}

export default OperatorInfo;
