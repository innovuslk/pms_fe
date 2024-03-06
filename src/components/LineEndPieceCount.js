import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import { I18nextProvider, useTranslation } from "react-i18next";


function LineEndPieceCount() {
    const { t } = useTranslation();

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
            const username = window.location.pathname.split('/').pop();
            const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/get/getLineEndPieceCount`, {
                operation: "LineEnd",
                username : username
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
        <p className="mb-0">{t("Line End Pieces")}</p>
    </div>
    )

}

export default LineEndPieceCount;
