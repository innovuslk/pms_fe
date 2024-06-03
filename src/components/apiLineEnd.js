import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import { I18nextProvider, useTranslation } from "react-i18next";


function ApiLineEndData() {
    const { t } = useTranslation();


    const [ApiLineEndData, setApiLineEndData] = useState();

    useEffect(() => {
        getApiLineEndData();

        const intervalId = setInterval(getApiLineEndData, 10000);

        return () => {
            clearInterval(intervalId);
        };
    }, [ApiLineEndData]);

    const getApiLineEndData = async () => {
        try {
            const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}/get/getAPILineData`, {
            });
            setApiLineEndData(response.data.totalPieceCount)
            console.log(response)

        }
        catch (error) {
            console.error("Failed to ApiLineEndData", error);
        }
    }

    return (
        <div className="col">
            <div className="card rounded-4">
                <div className="card-body">
                    <div className="d-flex align-items-center justify-content-around flex-wrap gap-2">
                        <div className="d-flex flex-column align-items-center justify-content-center gap-2">
                            <h3 className="mb-0">{ApiLineEndData || '0'}</h3>
                            <p className="mb-0">{t("Line End Checking")}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}


export default ApiLineEndData;
