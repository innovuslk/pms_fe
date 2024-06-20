import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import '../assets/css/adminHome.css';

const TopOperatorsTable = () => {
    const [topUsersWithCycle, setTopUsersWithCycle] = useState([]);
    const [selectedOperation, setSelectedOperation] = useState('');

    useEffect(() => {
        const fetchTopUsersWithCycle = () => {
            axios.get(`http://${process.env.REACT_APP_HOST_IP}/get/getTopUsersWithCycle`)
                .then(response => {
                    if (response.data && response.data.topUsers) {
                        setTopUsersWithCycle(response.data.topUsers);
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

    const handleOperationChange = (event) => {
        setSelectedOperation(event.target.value);
    };

    const filteredUsers = selectedOperation
        ? topUsersWithCycle.filter(user => user.operation === selectedOperation)
        : topUsersWithCycle;

    return (
        <div className="content">
            <h2 className="text-center mb-4 text-warning">Top Operators</h2>
            <div className="mb-3 text-center">
                <label htmlFor="operationSelect" className="form-label text-warning mx-2">Operation: </label>
                <select id="operationSelect" className="form-select w-25 d-inline" value={selectedOperation} onChange={handleOperationChange}>
                    <option value="">All</option>
                    <option value="Pullout 1">Pullout 1</option>
                    <option value="Pullout 2">Pullout 2</option>
                    <option value="LineEnd">LineEnd</option>
                    <option value="Operator">Operator</option>
                </select>
            </div>
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
                        {filteredUsers.map((user, index) => (
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
