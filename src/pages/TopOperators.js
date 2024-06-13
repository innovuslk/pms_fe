import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import '../assets/css/adminHome.css';

const TopOperatorsTable = () => {
    const [topUsers, setTopUsers] = useState([]);
    const [topUsersWithCycle, settopUsersWithCycle] = useState([]);

    useEffect(() => {
        const fetchTopUsers = () => {
            axios.post(`http://${process.env.REACT_APP_HOST_IP}/get/getTopUsers`)
                .then(response => {
                    if (response.data && response.data.topUsers) {
                        setTopUsers(response.data.topUsers);
                        console.log(response.data.topUsers); 
                    }
                })
                .catch(error => {
                    console.error('Error fetching top users:', error);
                });
        };

        fetchTopUsers(); 
        const intervalId = setInterval(fetchTopUsers, 5000); 

        return () => clearInterval(intervalId); 
    }, []);

    useEffect(() => {
        const fetchTopUsersWithCycle = () => {
            axios.get(`http://${process.env.REACT_APP_HOST_IP}/get/getTopUsersWithCycle`)
                .then(response => {
                    if (response.data && response.data.topUsers) {
                        settopUsersWithCycle(response.data.topUsers);
                        console.log(response); 
                    }
                })
                .catch(error => {
                    console.error('Error fetching top users:', error);
                });
        };

        fetchTopUsersWithCycle(); 
        const intervalId = setInterval(fetchTopUsersWithCycle, 5000); 

        return () => clearInterval(intervalId); 
    }, []);


    return (
        <div className="content">
            <h2 className="text-center mb-4 text-warning">Top Operators</h2>
            <div className="table-responsive">
                <table className="rounded col-6 col-xl-6 col-md-8 mx-auto z-index-1">
                    <thead className="thead-dark">
                        <tr>
                            
                            <th scope="col" className="text-center text-warning">Username</th>
                            <th scope="col" className="text-center text-warning">Piece Count</th>
                            <th scope="col" className="text-center text-warning">Plant Name</th>
                            <th scope="col" className="text-center text-warning">Line No</th>
                            <th scope="col" className="text-center text-warning">Operation</th>
                            <th scope="col" className="text-center text-warning">Shift</th>
                            <th scope="col" className="text-center text-warning">Best Cycle</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topUsersWithCycle.map((user, index) => (
                            <tr key={index} className="text-center">
                            
                                <td>{user.username}</td>
                                <td>{user.totalPieceCount}</td>
                                <td>{user.plantName}</td>
                                <td>{user.lineItem}</td>
                                <td>{user.operation}</td>
                                <td>{user.shift}</td>
                                <td>{user.bestCycle}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TopOperatorsTable;
