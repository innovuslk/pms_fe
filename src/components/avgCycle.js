import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { I18nextProvider, useTranslation } from "react-i18next";

function AvgCycle({ latestHour, pieceCount }) {

    const { t } = useTranslation();

    const [avgCycle, setAvgCycle] = useState()
    const [intHour, setIntHour] = useState();

    useEffect(() => {
        let avgCycle = calculateAvgCycle(intHour, pieceCount)

        setAvgCycle(avgCycle)

        const intervalId = setInterval(calculateAvgCycle, 10000);

        return () => {
            clearInterval(intervalId);
        };
    })


    useEffect(() => {
        switch (latestHour) {
            case "1st Hour":
                setIntHour(1);
                break;
            case "2nd Hour":
                setIntHour(2);
                break;
            case "3rd Hour":
                setIntHour(3);
                break;
            case "4th Hour":
                setIntHour(4);
                break;
            case "5th Hour":
                setIntHour(5);
                break;
            case "6th Hour":
                setIntHour(6);
                break;
            case "7th Hour":
                setIntHour(7);
                break;
            case "8th Hour":
                setIntHour(8);
                break;
        }
    }, [latestHour])

    const calculateAvgCycle = (intHour, pieceCount) => {

        let avgCycle = Math.round((pieceCount / intHour));
        let answer =  Math.round(60 / avgCycle)

        return answer;
    }

    return (
        <div className="d-flex flex-column align-items-center justify-content-center gap-2">
            <h3 className="mb-0">{avgCycle || '0'}</h3>
            <p className="mb-0">{t("Avg Cycle Time")}</p>
        </div>
    )
}

export default AvgCycle;