import React, { useState, useEffect } from 'react';
import '../assets/css/adminHome.css';
import axios from 'axios';
import RadialBarChart from '../components/efficiency_guage';
import { ClipLoader } from 'react-spinners';
import SupervisorEfficiency from '../components/supervisorEfficiency';

function OperatorInfo() {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPlant, setSelectedPlant] = useState('All');
    const [loading, setLoading] = useState(true); // Loading state
    const [dailyTarget, setDaillytarget] = useState();


    useEffect(() => {
        const intervalId = setInterval(() => {
            getAllUsers();
        }, 60000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (users.length > 0) {
            Promise.all(users.map(async (user) => {
                await fetchLatestPieceCount(user);
                await getShift(user);
                await getSmv(user);
                return user;
            })).then(updatedUsers => {
                setUsers(updatedUsers);
                setLoading(false); // Data loaded
            });
        }
    }, [users]);

    useEffect(() => {
        getDailyTarget();

        const intervalId = setInterval(getDailyTarget, 10000);

        return () => {
            clearInterval(intervalId);
        };
    }, [dailyTarget]);

    const getAllUsers = async () => {
        setLoading(true); // Start loading
        try {
            const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/getAllOperators`, {});
            const usersData = response.data.Users; // Extract the Users array from the response
            setUsers(usersData);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const getDailyTarget = async () => {
        try {
            const username = window.location.pathname.split('/').pop();
            const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/get/getSupervisorDailyTarget`,{
                username:username
            });
            setDaillytarget(response.data.dailyTarget)

        }
        catch (error) {
            console.error("Failed to dailyTarget");
        }
    }

    const fetchLatestPieceCount = async (user) => {
        try {
            const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/set/getPieceCount`, {
                username: btoa(user.username),
            });
            user.pieceCount = response.data.totalPieceCount;
            user.latestHour = response.data.latestHour;
            user.plantName = response.data.plantName;
        } catch (error) {
            console.error('Error fetching latest Piece count data:', error);
        }
    };

    const getShift = async (user) => {
        try {
            const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/get/getShift`, {
                username: btoa(user.username),
            });
            user.shift = response.data.Shift;
        } catch (error) {
            console.error('Failed to get shift data:', error);
        }
    };

    const getSmv = async (user) => {
        try {
            const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/get/getsmv`, {
                username: btoa(user.username),
            });
            user.smv = response.data.smv;
        } catch (error) {
            console.error('Failed to get SMV data:', error);
        }
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleFilterChange = (event) => {
        setSelectedPlant(event.target.value);
    };

    const filteredUsers = users.filter(user => {
        if (selectedPlant === 'All' || '') {
            return true;
        }
        return user.plantName === selectedPlant;
    }).filter(user => {
        return user.username.toLowerCase().includes(searchQuery.toLowerCase());
    });

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
                    index % 3 === 0 && // Start a new row for every third user
                    <div key={index} className="row">
                        {filteredUsers.slice(index, index + 3).map((user, subIndex) => (
                            <div key={subIndex} className="col">
                                <div className="card rounded-4">
                                    <div className="card-body d-flex flex-column align-items-center">
                                        <div className="mb-0">
                                            <SupervisorEfficiency pieceCount={user.pieceCount} latestHour={user.latestHour} dailyTarget={dailyTarget}/>
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
