import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';

function LineEndPieceCount() {
    const [pieceCount , setPieceCount] = useState();

    useEffect(() => {
        getLineEndPieceCount();

        const intervalId = setInterval(getLineEndPieceCount, 10000);

        return () => {
            clearInterval(intervalId);
        };
    }, [pieceCount]);


    const getLineEndPieceCount = async () => {
        try {

            const response = await axios.post('http://localhost:5000/get/getLineEndPieceCount', {
                operation: "LineEnd",
            });
            setPieceCount(response.data.totalLineEndPieceCount)
        }
        catch (error) {
            console.error("Failed to get line end pieces");
        }
    }

    return (
        <div className="d-flex flex-column align-items-center justify-content-center">
        <h3 className="mb-0">{pieceCount || '0'}</h3>
        <p className="mb-0">Line End Pieces</p>
    </div>
    )

}

export default LineEndPieceCount;