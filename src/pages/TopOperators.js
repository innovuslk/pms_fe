import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

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
        <div className="container mt-5">
            <h2 className="text-center mb-4">Top Operators</h2>
            <div className="table-responsive">
                <table className="table table-striped table-bordered">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col" className="text-center text-warning">User ID</th>
                            <th scope="col" className="text-center text-warning">Username</th>
                            <th scope="col" className="text-center text-warning">Piece Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topUsers.map((user, index) => (
                            <tr key={index} className="text-center">
                                <td>{user.userid}</td>
                                <td>{user.username}</td>
                                <td>{user.totalPieceCount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TopOperatorsTable;
