import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import '../assets/css/adminHome.css';

const TopOperatorsTable = () => {
    const [topUsers, setTopUsers] = useState([]);

    useEffect(() => {
        axios.post(`http://${process.env.REACT_APP_HOST_IP}/get/getTopUsers`)

            .then(response => {
                if (response.data && response.data.topUsers) {
                    setTopUsers(response.data.topUsers);
                }
            })
            .catch(error => {
                console.error('Error fetching top users:', error);
            });
    }, []);

    return (
        <div className="content">
            <h2 className="text-center mb-4 text-warning">Top Operators</h2>
            <div className="table-responsive">
                <table className="rounded col-6 col-xl-6 col-md-8 mx-auto z-index-1">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col" className="text-center text-warning">User ID</th>
                            <th scope="col" className="text-center text-warning">Username</th>
                            <th scope="col" className="text-center text-warning">Piece Count</th>
                            <th scope="col" className="text-center text-warning">PlantName</th>
                            <th scope="col" className="text-center text-warning">LineNo</th>
                            <th scope="col" className="text-center text-warning">Shift</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topUsers.map((user, index) => (
                            <tr key={index} className="text-center">
                                <td>{user.userid}</td>
                                <td>{user.username}</td>
                                <td>{user.totalPieceCount}</td>
                                <td>{user.plantName}</td>
                                <td>{user.line}</td>
                                <td>{user.shift}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TopOperatorsTable;
