import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import '../assets/css/adminHome.css';

const UserManagement = () => {
    const [Users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        axios.post(`http://${process.env.REACT_APP_HOST_IP}/getAllUsers`)
            .then(response => {
                if (response.data && response.data.Users) {
                    setUsers(response.data.Users);
                }
            })
            .catch(error => {
                console.error('Error fetching top users:', error);
            });
    }, [Users]);

    const deleteUser = (userId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this user?');
        if (confirmDelete) {
            axios.post(`http://${process.env.REACT_APP_HOST_IP}/deleteUser`, { userId })
                .then(response => {
                    // Update the users list after successful deletion
                    setUsers(Users.filter(user => user.userid !== userId));
                })
                .catch(error => {
                    console.error('Error deleting user:', error);
                });
        }
    };

    const filteredUsers = Users.filter(user =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="content">
            <h4 className="text-center mb-2 text-warning">Existing Users</h4>
            <div className="input-group mb-3 w-25 mx-auto">
                <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Search by username"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="input-group-append">
                    <span className="input-group-text">
                        <span class="material-symbols-outlined">
                            search
                        </span>
                    </span>
                </div>
            </div>
            <div className="table-responsive">
                <table className="rounded col-6 col-xl-6 col-md-8 mx-auto z-index-1">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col" className="text-center">User ID</th>
                            <th scope="col" className="text-center">PN</th>
                            <th scope="col" className="text-center">Username</th>
                            <th scope="col" className="text-center">User Level</th>
                            <th scope="col" className="text-center">EPF</th>
                            <th scope="col" className="text-center">Plant Name</th>
                            <th scope="col" className="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user, index) => (
                            <tr key={index} className="text-center">
                                <td>{user.userid}</td>
                                <td>{user.PN}</td>
                                <td>{user.username}</td>
                                <td>{user.userlevelId}</td>
                                <td>{user.EPF}</td>
                                <td>{user.plantName}</td>
                                <td>
                                    <button
                                        type="button"
                                        style={{ backgroundColor: 'transparent', border: 'none' }}
                                        onClick={() => deleteUser(user.userid)}
                                    >
                                        <span className="material-symbols-outlined w-auto" style={{ color: "#d9534f" }}>
                                            delete_forever
                                        </span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;
