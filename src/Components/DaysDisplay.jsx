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
                //receive time as YYYY-MM-DD, using Date will offset actual day by 1 day, format time as ISO
                let isoTime = new Date().toISOString().split("T")[1].split(".")[0] //hacky... trying to get current time
                let tmpTime = new Date(`${data.time[i]}T${isoTime}Z`) //format string to avoid off by one
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
            [0, 'Sun'],
            [1, 'Mon'],
            [2, 'Tues'],
            [3, 'Wed'],
            [4, 'Thurs'],
            [5, 'Fri'],
            [6, 'Sat']
        ])

        let arr = days[id] // 0->time, 1->MaxTemp, 2->MinTemp
        let date = arr[0].toLocaleString('en-US', { timeZone: 'UTC', day: 'numeric', month: 'numeric' }).split(",")[0]
        let day = weekdays.get(arr[0].getDay())
        return (
            <div id={id} key={id} className='days-style'>
                <div className='div-sm-pd background-entry' id='Time'>{`${day} ${date}`}</div>
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