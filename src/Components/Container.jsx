import React, { useState, useEffect } from 'react'
import { DayDisplay } from './DayDisplay'
import { DaysDisplay } from './DaysDisplay'
import { Graph } from './Graph'



export function Container() {
    const [zipcode, setZipcode] = useState('')
    const [cityName, setCityName] = useState('')
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
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                //set lat lon for api request
                setGeoObj(() => ({ ...geoObj, lat: pos.coords.latitude, lon: pos.coords.longitude }))
                setCityName(() => '') //if allow clicked we'll reset city, to not confuse from past searches
            })
        }

    }

    const WeatherData = {
        url: '',
        req: new XMLHttpRequest(),
        lat: NaN,
        lon: NaN,
        data: {},
        getData: function () {
            this.url = `https://api.open-meteo.com/v1/forecast?latitude=${this.lat}&longitude=${this.lon}&hourly=temperature_2m&temperature_unit=fahrenheit&current_weather=true&timezone=auto&daily=apparent_temperature_max,apparent_temperature_min`
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

    function dataHelper(lat, lon) {
        WeatherData.lat = lat
        WeatherData.lon = lon
        WeatherData.getData()
    }

    const searchZipcode = (input) => {
        console.log("Searching zipcode")
        let testing = false
        let storedEntries = JSON.parse(localStorage.getItem('zipToGeo'))
        let zipMap = (storedEntries != null) ? new Map(Object.entries(storedEntries)) : new Map()

        if (zipMap.size != 0 && zipMap.get(zipcode) != undefined) {
            //entry match
            console.log('Entry match found!!!', zipcode);
            let entry = zipMap.get(zipcode)
            setCityName(() => entry.city)
            dataHelper(entry.lat, entry.lon)
        } else if (input != "" && input != undefined && !testing) {
            // no entry match, new zipcode
            console.log('no match start searching zipcode')
            let url = `https://geocode.maps.co/search?q=${input},USA`
            const req = new XMLHttpRequest()
            req.open('GET', url)
            req.responseType = 'json'
            req.send()

            req.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    let latVal = this.response[0].lat
                    let lonVal = this.response[0].lon
                    let cityVal = this.response[0].display_name.split(",")[0] //location displayed like so: "Beverly Hills, Los Angeles County, California, 90210, United States"
                    setCityName(() => cityVal)

                    //cache geolocation data
                    //first time entering zipcode therefore new Map object needed
                    let initMap = new Map()
                    initMap.set(zipcode, { lat: latVal, lon: lonVal, city: cityVal })
                    localStorage.setItem('zipToGeo', JSON.stringify(Object.fromEntries(initMap)))

                    // call weather api
                    dataHelper(latVal, lonVal)
                }
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
            <div>
                <DayDisplay value={[weatherData.current_weather, cityName]} />
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