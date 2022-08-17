import React, { useState, useEffect } from 'react'
import { DayDisplay } from './DayDisplay'
import { DaysDisplay } from './DaysDisplay'
import { Graph } from './Graph'
import { geoParse } from '../Utils/parseGeoLoc'



export function Container() {
    const [zipCode, setZipCode] = useState('')
    const [weatherData, setWeatherData] = useState([])

    function handleSubmit(e) {
        let zipcodeVal = e.target.zipcode.value
        e.preventDefault()
        setZipCode(() => zipcodeVal)
        let values = geoParse(zipcodeVal)
        console.log(`values: ${values}`);
    }

    return (
        <div>
            <div>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <input name='zipcode' placeholder='Enter Zipcode'></input>
                </form>
                <DayDisplay />
            </div>
            <div>
                <DaysDisplay />
            </div>
            <div>
                <Graph />
            </div>
        </div>
    )
}