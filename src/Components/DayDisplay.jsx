import React, { useState, useEffect } from 'react';

export function DayDisplay({ value }) {
    const [temp, setTemp] = useState('')
    const [time, setTime] = useState();
    useEffect(() => { handleData(value) }, [value])


    const handleData = (data) => {
        if (data != undefined) {
            setTemp(() => data.temperature)
            setTime(() => data.time)
        }
    }

    const determineBackground = () => {
        if (temp < 78.0) {
            return 'background-cool'
        } else if (temp > 78.0 && temp < 88.0) {
            return 'background-sunny'
        } else if (temp > 88.0) {
            return 'background-hot'
        }
    }

    return (
        <div className={determineBackground() + ' auto-width current-day-style'}>
            <h2 className='div-sm-pd'>Hour {new Date(time).toLocaleTimeString("us-en", { hour: "2-digit", minute: "2-digit" })}</h2>
            <h2 className='div-sm-pd'>{temp + " " + String.fromCharCode(176) + "F"}</h2>
        </div>
    )
}