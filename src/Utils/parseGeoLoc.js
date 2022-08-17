import { DayDisplay } from "../Components/DayDisplay"

export function geoParse(input) {
    console.log("running geo parse...")

    let url = `https://geocode.maps.co/search?q=${input}`
    const req = new XMLHttpRequest()
    var values = []
    req.addEventListener("load", reqListener)
    req.open("GET", url)
    req.responseType = 'json'
    req.send()
}


function reqListener() {
    console.log(typeof (this));

    //let object = JSON.parse(this.response)[0]
    let object = this.response[0]
    let latitude = object.lat
    let longitude = object.lon
    console.log(`lat: ${latitude}, lon: ${longitude}`)
    //another get
    const reqApi = new XMLHttpRequest()
    //https://api.open-meteo.com/v1/forecast?latitude=34.125&longitude=-118.25&hourly=temperature_2m&temperature_unit=fahrenheit&current_weather=true&timezone=auto
    let weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=auto&current_weather=true&hourly=apparent_temperature&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch`
    reqApi.addEventListener("load", apiListener)
    reqApi.open("GET", weatherURL)
    reqApi.responseType = 'json'
    reqApi.send()
}

function apiListener() {
    console.log(this)
}