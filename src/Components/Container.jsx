import React, { useState, useEffect } from 'react'
import { DayDisplay } from './DayDisplay'
import { DaysDisplay } from './DaysDisplay'
import { Graph } from './Graph'
import { GeoLoc } from './GeoLoc'



export function Container() {
    const [zipcode, setZipcode] = useState('')
    const [weatherData, setWeatherData] = useState([])
    useEffect(() => { searchZipcode(zipcode) }, [zipcode])

    function handleSubmit(e) {
        let zipcodeVal = e.target.zipcode.value
        e.preventDefault()
        setZipcode(() => zipcodeVal)
        console.log(`zipcode entered: ${zipcodeVal}`);
    }

    const searchZipcode = (input) => {
        if (input != "" && input != undefined) {
            let url = `https://geocode.maps.co/search?q=${input}`
            const req = new XMLHttpRequest()
            req.open('GET', url)
            req.responseType = 'json'
            req.send()

            req.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    // document.getElementById("demo").innerHTML =
                    //     this.responseText;
                    let object = this.response[0]
                    let lat = object.lat
                    let lon = object.lon
                    console.log(`lat: ${lat}, lon: ${lon}`)
                    let weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m&temperature_unit=fahrenheit&current_weather=true&timezone=auto`

                    const nextReq = new XMLHttpRequest()
                    nextReq.open('GET', weatherURL)
                    nextReq.responseType = 'json'
                    nextReq.send()

                    nextReq.onreadystatechange = function () {
                        if (this.readyState == 4 && this.status == 200) {
                            console.log('JSON RECEIVED: ', this.response)
                            setWeatherData(() => this.response)
                        }
                    }
                }
            }
        }
    }

    return (
        <div>
            <div>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <input name='zipcode' placeholder='Enter Zipcode'></input>
                </form>
                {console.log('Weather data?: ', (weatherData.length != 0) ? weatherData : 'none')}
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