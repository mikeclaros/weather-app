import React, { useState, useEffect } from 'react';

export function DayDisplay({ value }) {
    const [temp, setTemp] = useState('')
    const [time, setTime] = useState('')
    const [cityName, setCityName] = useState('')

    useEffect(() => { handleData(value) }, [value])

    const days = {
        1: 'Monday',
        2: 'Tuesday',
        3: 'Wednesday',
        4: 'Thursday',
        5: 'Friday',
        6: 'Saturday',
        7: 'Sunday'
    }

    const handleData = (data) => {
        // if (data != undefined) {
        //     setTemp(() => data.temperature)
        //     setTime(() => data.time)
        // }
        if (data[0] != undefined) {
            let weatherData = data[0]
            setTemp(() => weatherData.temperature)
            setTime(() => weatherData.time)
            setCityName(() => data[1])
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
            <h2 className='div-sm-pd'>{(time != '') ? days[new Date(time).getDay()] : ''} {(time != '') ? new Date(time).toLocaleTimeString("us-en", { hour: "2-digit", minute: "2-digit", month: "2-digit", day: "2-digit" }) : ''}</h2>
            <h2 className='div-sm-pd'>{(temp != '') ? temp + " " + String.fromCharCode(176) + "F " + ((cityName != '') ? cityName : '') : ''}</h2>

        </div>
    )
}