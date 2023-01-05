import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';


export function Graph({ value }) {
    const [hours, setHours] = useState([])
    const [temps, setTemps] = useState([])
    const [temps2m, setTemps2m] = useState([])

    const MOBILE_REGEX = /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i
    const isMobile = ((MOBILE_REGEX).test(navigator.userAgent)) ? true : false

    useEffect(() => { handleData(value) }, [value])


    const mobileLayout = {
        autosize: true,
        width: 450,
        height: 500,
        title: 'Today\'s Hourly Temperatures',
        font: { family: 'monospace', size: 12 },
        plot_bgcolor: "#c8f5fa",
        paper_bgcolor: "#c8f5fa",
    }

    const normalLayout = {
        autosize: true,
        title: 'Today\'s Hourly Temperatures',
        font: { family: 'monospace', size: 12 },
        plot_bgcolor: "#c8f5fa",
        paper_bgcolor: "#c8f5fa",
    }

    const handleData = (value) => {
        //plot data
        console.log("graph data handling");
        if (value != undefined) {
            let today = new Date()
            console.log(`today is ${today}`)

            let tempsArr = []
            let tempsArr2m = []
            let timeArr = []
            let item = new Date(value.time[0])
            let i = 0
            for (let today = new Date(); today.toDateString() === item.toDateString();) {
                tempsArr2m.push(value.temperature_2m[i])
                tempsArr.push(value.apparent_temperature[i])
                timeArr.push(value.time[i])
                item = new Date(value.time[i++])
            }

            setHours(() => timeArr)
            setTemps(() => tempsArr)
            setTemps2m(() => tempsArr2m)
        }
    }

    return (
        <div className='graph-paper-style'>
            {console.log(`hours array len: ${hours.length} ${hours}\ntemps array len: ${temps.length} ${temps}`)}
            <Plot
                data={[
                    {
                        x: [...hours],
                        y: [...temps],
                        type: 'scatter',
                        mode: 'lines+markers',
                        marker: { color: 'red' },
                        name: 'temp feel'
                    },
                    {
                        x: [...hours],
                        y: [...temps2m],
                        type: 'scatter',
                        mode: 'lines+markers',
                        marker: { color: 'blue' },
                        name: 'temp 2m above ground'
                    }

                ]}
                layout={(isMobile) ? mobileLayout : normalLayout}
                useResizeHandler={true}
                style={{ width: '100%', height: '100%' }}
            />
        </div>
    )
}
