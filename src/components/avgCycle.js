import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { useTranslation } from "react-i18next";

function AvgCycle({ latestHour, currentHourOutput, onUpdateBestCycle }) {

    const { t } = useTranslation();

    const [avgCycle, setAvgCycle] = useState();
    const [bestCycle, setBestCycle] = useState(Infinity); // Initialize to a large value
    const [intHour, setIntHour] = useState();

    useEffect(() => {
        let avgCycle = calculateAvgCycle(intHour, currentHourOutput);

        setAvgCycle(avgCycle);

        // Update best cycle time if avgCycle is lower
        if (avgCycle < bestCycle) {
            setBestCycle(avgCycle);
            onUpdateBestCycle(avgCycle);
        }

        const intervalId = setInterval(() => {
            let avgCycle = calculateAvgCycle(intHour, currentHourOutput);

            setAvgCycle(avgCycle);

            // Update best cycle time if avgCycle is lower
            if (avgCycle < bestCycle) {
                setBestCycle(avgCycle);
                onUpdateBestCycle(avgCycle);
            }
        }, 10000);

        return () => {
            clearInterval(intervalId);
        };
    }, [intHour, currentHourOutput, bestCycle, onUpdateBestCycle]);

    useEffect(() => {
        switch (latestHour) {
            case "1st Hour":
                setIntHour(20);
                break;
            case "2nd Hour":
                setIntHour(60);
                break;
            case "3rd Hour":
                setIntHour(60);
                break;
            case "4th Hour":
                setIntHour(60);
                break;
            case "5th Hour":
                setIntHour(60);
                break;
            case "6th Hour":
                setIntHour(60);
                break;
            case "7th Hour":
                setIntHour(60);
                break;
            case "8th Hour":
                setIntHour(60);
                break;
            default:
                setIntHour(60);
                break;
        }
    }, [latestHour]);

    const calculateAvgCycle = (intHour, currentHourOutput) => {
        let avgCycle = (currentHourOutput / intHour);
        return avgCycle.toFixed(2);
    };

    return (
        <div className="d-flex flex-column align-items-center justify-content-center gap-2">
            <h3 className="mb-0">{avgCycle || '0'}</h3>
            <p className="mb-0">{t("Avg Cycle Time")}</p>
        </div>
    );
}

export default AvgCycle;
