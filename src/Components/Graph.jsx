import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';


export function Graph({ value }) {
    const [hours, setHours] = useState([])
    const [temps, setTemps] = useState([])

    useEffect(() => { handleData(value) }, [value])

    const handleData = (value) => {
        //plot data
        console.log("graph data handling");
        if (value != undefined) {
            let today = new Date()
            console.log(`today is ${today}`)

            let tempsArr = []
            let timeArr = []
            let item = new Date(value.time[0])
            let i = 0
            for (let today = new Date(); today.toDateString() === item.toDateString();) {
                //tempsArr.push(value.temperature_2m[i])
                tempsArr.push(value.apparent_temperature[i])
                timeArr.push(value.time[i])
                item = new Date(value.time[i++])
            }

            setHours(() => timeArr)
            setTemps(() => tempsArr)
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
                    }

                ]}
                layout={{
                    width: 500,
                    height: 300,
                    title: 'Today\'s Hourly Temperatures',
                    font: { family: 'monospace', size: 12 },
                    plot_bgcolor: "#c8f5fa",
                    paper_bgcolor: "#c8f5fa",
                }}
            />
        </div>
    )
}

//example react-plot from Plotly
{/* <Plot

data={[

  {

    x: [1, 2, 3],

    y: [2, 6, 3],

    type: 'scatter',

    mode: 'lines+markers',

    marker: {color: 'red'},

  },

  {type: 'bar', x: [1, 2, 3], y: [2, 5, 3]},

]}

layout={ {width: 320, height: 240, title: 'A Fancy Plot'} }

/> */}