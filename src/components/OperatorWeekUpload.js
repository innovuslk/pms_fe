import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import '../assets/css/adminHome.css';
import sampleExcel from '../assets/files/OperatorPlan.xlsx';
import axios from 'axios';

function OperatorWeekPlanUpload() {
    const [data, setData] = useState([]);
    const [message, setMessage] = useState('');
    const [uploading, setUploading] = useState(false);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const parsedData = XLSX.utils.sheet_to_json(sheet, { raw: false });
            const formattedData = parsedData.map((row) => ({
                ...row,
                date: formatDate(row.date),
            }));
            setData(formattedData);
        };
        reader.onerror = () => {
            setMessage('Error reading the file.');
        };
        reader.readAsArrayBuffer(file);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleUpload = async () => {
        setUploading(true);
        try {
            await axios.post(`http://${process.env.REACT_APP_HOST_IP}/insert/insertOperatorWeek`, {
                data: data, // Skip the header row
            });
            setMessage('Successfully Uploaded!');
        } catch (err) {
            console.error(err);
            setMessage('Error Occurred');
        } finally {
            setUploading(false);
            setTimeout(() => {
                setMessage('');
            }, 5000);
        }
    };

    return (
        <div className="content">
            <div className='col-6 col-xl-6 col-md-8 mx-auto'>
                <h6 className='align-items-center justify-content-center text-success font-21'>Select an excel file here for Operator Assignment</h6>
                <input
                    className='form-control mb-4'
                    id="formFile"
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileUpload}
                    disabled={uploading}
                />
                <a
                    className='btn btn-primary mb-4 text-decoration-underline mx-auto align-items-center justify-content-center'
                    href={sampleExcel}
                    download="OperatorPlanSample.xlsx"
                >
                    Download Sample Excel File
                </a>
            </div>

            {data.length > 0 && (
                <table className="table">
                    <thead>
                        <tr>
                            {Object.keys(data[0]).map((key) => (
                                <th key={key}>{key}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, index) => (
                            <tr key={index}>
                                {Object.values(row).map((value, index) => (
                                    <td key={index}>{value}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {data.length > 0 && !uploading && (
                <button type='submit' className='w-auto btn btn-primary' onClick={handleUpload}>
                    Upload
                </button>
            )}
            {<h6 className='text-danger'>{message}</h6>}
        </div>
    );
}

export default OperatorWeekPlanUpload;