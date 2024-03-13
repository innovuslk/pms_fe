import React, { useState, useEffect } from 'react';
import '../assets/css/downtime.css';
import '../assets/css/adminHome.css'
import axios from 'axios';


const Downtime = () => {

    const [downtime, setDowntime] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/get/getDowntimes`);
                if (response.data && response.data.downtimes) {
                    setDowntime(response.data.downtimes);
                }
            } catch (error) {
                console.error('Error fetching downtimes:', error);
            }
        };

        // Fetch data initially
        fetchData();

        // Fetch data every 10 seconds
        const intervalId = setInterval(fetchData, 10000);

        // Clear interval on component unmount
        return () => clearInterval(intervalId);
    }, [downtime]);






    return (
        <div className="content">
                <table className='rounded col-6 col-xl-6 col-md-8 mx-auto z-index-1'>
                <thead className="thead-dark">
                <tr>
                    <th scope="col" className="text-center">Username</th>
                    <th scope="col" className="text-center">Type</th>
                    <th scope="col" className="text-center">Start Time</th>
                    <th scope="col" className="text-center">End Time</th>
                    <th scope="col" className="text-center">Time</th>
                </tr>
            </thead>
                    <tbody>
                    {downtime.map((user) => {
                        const startTime = new Date(user.startTime);
                        const endTime = user.endTime ? new Date(user.endTime) : null;
                        const endTimeDisplay = endTime ? endTime.toLocaleTimeString() : <h6 className='text-danger'>Currently Down</h6>;
                        const timeDiff = endTime ? endTime.getTime() - startTime.getTime() : 0;
                        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
                        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
                        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
                        
                        return (
                            <tr key={user.username} className="text-center">
                            <td>{user.username}</td>
                            <td>{user.type}</td>
                            <td>{startTime.toLocaleTimeString()}</td>
                            <td>{endTimeDisplay}</td>
                            <td>{`${hours}h ${minutes}m ${seconds}s`}</td>
                        </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
    );
}


export default Downtime;