import React, { useState, useEffect } from 'react'
import { DayDisplay } from './DayDisplay'
import { DaysDisplay } from './DaysDisplay'
import { Graph } from './Graph'



export function Container() {
    const [zipcode, setZipcode] = useState('')
    const [geoObj, setGeoObj] = useState({})
    const [weatherData, setWeatherData] = useState([])
    useEffect(() => { searchZipcode(zipcode) }, [zipcode])
    useEffect(() => { searchGeoObj(geoObj) }, [geoObj])

    function handleSubmit(e) {

        if (e.target.zipcode != '') {
            let zipcodeVal = e.target.zipcode.value
            e.preventDefault()
            setZipcode(() => zipcodeVal)
            console.log(`zipcode entered: ${zipcodeVal}`)
        }
    }

    function handleGeoLocButtonClick(e) {
        BrowserGeoCode.geocoder()
    }

    const BrowserGeoCode = {
        geocoder: function () {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((pos) => {
                    console.log('in geocoder', this)
                    // this.lat = pos.coords.latitude
                    // this.lon = pos.coords.longitude
                    setGeoObj(() => ({ ...geoObj, lat: pos.coords.latitude, lon: pos.coords.longitude }))
                })
            }
        },
    }

    const WeatherData = {
        url: '',
        req: new XMLHttpRequest(),
        lat: NaN,
        lon: NaN,
        data: {},
        getData: function () {
            //let weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${this.lat}&longitude=${this.lon}&hourly=temperature_2m&temperature_unit=fahrenheit&current_weather=true&timezone=auto`
            this.url = `https://api.open-meteo.com/v1/forecast?latitude=${this.lat}&longitude=${this.lon}&hourly=temperature_2m&temperature_unit=fahrenheit&current_weather=true&timezone=auto`
            this.req.open('GET', this.url)
            this.req.responseType = 'json'
            this.req.send()

            this.req.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    console.log('JSON RECEIVED: ', this.response)
                    setWeatherData(() => this.response)
                }
            }
        },
    }

    const searchGeoObj = (geoObj) => {
        if (geoObj.lat != undefined && geoObj.lon != undefined) {
            WeatherData.lat = geoObj.lat
            WeatherData.lon = geoObj.lon
            WeatherData.getData()
        }
    }

    const searchZipcode = (input) => {
        console.log("Searching zipcode...")
        let testing = true
        if (input != "" && input != undefined && !testing) {
            let url = `https://geocode.maps.co/search?q=${input}`
            const req = new XMLHttpRequest()
            req.open('GET', url)
            req.responseType = 'json'
            let geocodeReady = true;
            req.send()

            req.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    let dataObj = new WeatherData()
                    let lat = this.response[0].lat
                    let lon = this.response[0].lon

                    dataObj.lat = lat
                    dataObj.lon = lon
                    dataObj.getData()
                }
                // if (this.readyState == 4 && this.status == 200) {
                //     // document.getElementById("demo").innerHTML =
                //     //     this.responseText;
                //     let object = this.response[0]
                //     let lat = object.lat
                //     let lon = object.lon
                //     console.log(`lat: ${lat}, lon: ${lon}`)
                //     let weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m&temperature_unit=fahrenheit&current_weather=true&timezone=auto`

                //     const nextReq = new XMLHttpRequest()
                //     nextReq.open('GET', weatherURL)
                //     nextReq.responseType = 'json'
                //     nextReq.send()

                //     nextReq.onreadystatechange = function () {
                //         if (this.readyState == 4 && this.status == 200) {
                //             console.log('JSON RECEIVED: ', this.response)
                //             setWeatherData(() => this.response)
                //         }
                //     }
                // } else {
                //     let obj = new BrowserGeoCode()
                //     obj.geocoder()
                // }
            }
        }
    }

    return (
        <div className='min-width'>
            <div className='background-entry'>
                <div className='div-entry-col'>
                    <form onSubmit={(e) => handleSubmit(e)}>
                        <input name='zipcode' placeholder='Enter Zipcode'></input>
                    </form>
                    <button className='div-sm-margin' name='geoloc' onClick={(e) => handleGeoLocButtonClick(e)}>Use GeoLocation?</button>
                </div>
            </div>
            {console.log('Weather data?: ', (weatherData.length != 0) ? weatherData : 'none')}
            <div>
                <DayDisplay value={weatherData.current_weather} />
            </div>
            <div>
                <Graph value={weatherData.hourly} />
            </div>
            <div>
                <DaysDisplay value={weatherData.daily} />
            </div>
        </div>
    )
}