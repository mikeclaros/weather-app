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

    return (
        <div>
            <h2>Current Temp {temp}</h2>
            <h2>Current Time {time}</h2>
        </div>
    )
}