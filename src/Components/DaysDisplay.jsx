import React, { useState, useEffect } from 'react';
import '../index.css'
import { backgroundPicker } from '../Utils/backgroundPicker';

export function DaysDisplay({ value }) {
    const [days, setDays] = useState([])
    useEffect(() => { handleData(value) }, [value])

    const handleData = (data) => {
        if (data != undefined) {
            let daysData = []
            for (let i = 0; i < data.time.length; i++) {
                let tmpTime = new Date(data.time[i]).toLocaleDateString('en-us', { month: "short", day: "numeric" })
                let tmpMaxTemp = data.apparent_temperature_max[i]
                let tmpMinTemp = data.apparent_temperature_min[i]

                daysData.push([tmpTime, tmpMaxTemp, tmpMinTemp])
            }
            setDays(() => daysData)
        } else {
            setDays(() => [])
        }
    }

    const createDayColumn = (id) => {
        if (days.length <= 0) {
            return
        }

        let weekdays = new Map([
            [0, 'Monday'],
            [1, 'Tuesday'],
            [2, 'Wednesday'],
            [3, 'Thursday'],
            [4, 'Friday'],
            [5, 'Saturday'],
            [6, 'Sunday']
        ])

        let day = weekdays.get(id)
        let arr = days[id]
        return (
            <div id={day} key={day} className='days-style'>
                <div className='div-sm-pd background-entry' id='Time'>{arr[0]}</div>
                <div className={'div-sm-pd ' + backgroundPicker(arr[1])} id='Max'>{arr[1] + String.fromCharCode(176)}</div>
                <div className={'div-sm-pd ' + backgroundPicker(arr[2])} id='Min'>{arr[2] + String.fromCharCode(176)}</div>
            </div>
        )
    }

    return (
        <div className='five-day-layout'>
            {(days <= 0) ? console.log('no days') : days.map((data, index) => createDayColumn(index))}
        </div>
    )
}