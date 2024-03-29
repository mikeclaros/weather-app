import React, { useState, useEffect } from 'react'
import { DayDisplay } from './DayDisplay'
import { DaysDisplay } from './DaysDisplay'
import { Graph } from './Graph'



export function Container() {
    const [zipcode, setZipcode] = useState('')
    const [cityName, setCityName] = useState('')
    const [geoObj, setGeoObj] = useState({})
    const [weatherData, setWeatherData] = useState([])
    const [latlon, setLatLon] = useState([])

    useEffect(() => { searchZipcode(zipcode) }, [zipcode])
    useEffect(() => { searchGeoObj(geoObj) }, [geoObj])
    useEffect(() => { setCityNameForZipOrGeo(latlon) }, [latlon])

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
                setLatLon(() => [pos.coords.latitude, pos.coords.longitude])
            })
        }
    }

    const setCityNameForZipOrGeo = (input) => {
        let { lat, lon, key } = ''
        if (input !== undefined && input.length > 0) {
            lat = input[0].toFixed(2)
            lon = input[1].toFixed(2)
            key = lat.toString() + "," + lon.toString()
        } else {
            return
        }

        let localCache = JSON.parse(localStorage.getItem('geoCache'))
        let geoCache = (localCache != null) ? new Map(Object.entries(localCache)) : new Map()

        console.log('geocache key: ' + key)
        let item = geoCache.get(key)
        if (item === undefined) {
            //no key match input given
            console.log('lat: ' + lat + '\nlon: ' + lon)
            let url = `https://geocode.maps.co/reverse?lat=${lat}&lon=${lon}`
            const req = new XMLHttpRequest()
            req.open('GET', url)
            req.responseType = 'json'
            req.send()
            req.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    let city = this.response.address.city
                    console.log('Setting city: ' + city)
                    setCityName(() => city)

                    //set geomap
                    let geoMap = new Map()
                    let lat = latlon[0].toFixed(2)
                    let lon = latlon[1].toFixed(2)
                    let key = lat.toString() + "," + lon.toString()
                    geoMap.set(key, city)
                    //set item in local storage
                    localStorage.setItem('geoCache', JSON.stringify(Object.fromEntries(geoMap)))
                }
            }
        } else {
            //geocache key match
            let city = geoCache.get(key)
            setCityName(() => city)
        }
    }

    const WeatherData = {
        url: '',
        req: new XMLHttpRequest(),
        lat: NaN,
        lon: NaN,
        data: {},
        getData: function () {
            //this.url = `https://api.open-meteo.com/v1/forecast?latitude=${this.lat}&longitude=${this.lon}&hourly=temperature_2m&temperature_unit=fahrenheit&current_weather=true&timezone=auto&daily=apparent_temperature_max,apparent_temperature_min`
            this.url = `https://api.open-meteo.com/v1/forecast?latitude=${this.lat}&longitude=${this.lon}&hourly=apparent_temperature,temperature_2m&temperature_unit=fahrenheit&current_weather=true&timezone=auto&daily=apparent_temperature_max,apparent_temperature_min`
            this.req.open('GET', this.url)
            this.req.responseType = 'json'
            this.req.send()

            this.req.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    console.log('JSON RECEIVED(open-meteo): ', this.response)
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
        let storedEntries = JSON.parse(localStorage.getItem('zipToGeo'))
        let zipMap = (storedEntries != null) ? new Map(Object.entries(storedEntries)) : new Map()

        if (zipMap.size != 0 && zipMap.get(zipcode) != undefined) {
            //entry match
            console.log('Entry match found!!!', zipcode);
            let entry = zipMap.get(zipcode)
            setCityName(() => entry.city)
            dataHelper(entry.lat, entry.lon)
        } else if (input != "" && input != undefined) {
            // input received but no entry match, new zipcode
            console.log('no match start searching zipcode')
            //let url = `https://geocode.maps.co/search?q=${input},USA` //old api used, may implement a switch to swap to this one as a fallback
            let encodedInput = encodeURIComponent(input)
            let url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodedInput}`
            console.log("URL: " + url)
            const req = new XMLHttpRequest()
            req.open('GET', url)
            req.responseType = 'json'
            req.send()

            req.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200 && this.response.results !== undefined) {
                    let latVal = 0
                    let lonVal = 0
                    let cityVal = ''

                    // find first likely match
                    console.log('what is: ' + this.response.results)
                    this.response.results.every(element => {
                        if (element.country === "United States") {
                            console.log('here in results')
                            latVal = element.latitude
                            lonVal = element.longitude
                            cityVal = element.name
                            return false;
                        }
                        return true;
                    })
                    console.log('open-meteo returned: ' + latVal + ' ' + lonVal + ' ' + cityVal)
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
                        <input className='entry-field' name='zipcode' placeholder='Search with zip or location'></input>
                    </form>
                    {(window.isSecureContext) ? <button className='div-sm-margin' name='geoloc' onClick={(e) => handleGeoLocButtonClick(e)}>GeoLocation</button> : <React.Fragment></React.Fragment>}
                </div>
            </div>
            <DayDisplay value={[weatherData.current_weather, cityName]} />
            <Graph value={weatherData.hourly} />
            <DaysDisplay value={weatherData.daily} />
        </div>
    )
}