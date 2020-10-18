const Horsens = document.getElementById('horsensData')
const Aarhus = document.getElementById('aarhusData')
const Copenhagen = document.getElementById('copenhagenData')
const lastData = document.getElementById('last5')
const temperature = document.getElementById('tempMinMax')
const precipitation = document.getElementById('totalPrec')
const wind = document.getElementById('windSpeed')
const windDir = document.getElementById('windDirection')
const cloud = document.getElementById('cloudAverage')
const forecastInfo = document.getElementById('forecastData')

const sendRequest =(method, url, data) => {
    return fetch(url, {
        method : method,
        body: JSON.stringify(data),
        headers: data ? {'Content-Type': 'application/json'}:{}
    }).then(response => {
        if(response.status >= 400){
            return response.json().then(errResData => {
                const error = new Error("something went wrong")
                error.data = errResData
                throw error
            })
        }
        return response.json()
    })
}

function tableAssign(data, elementId){
    console.log(data)
    if(data.length > 0){
        let temp=""
        data.map(u => {
            temp += "<tr>";
            temp += "<td>" + u.place + "</td>";
            temp += "<td>" + u.precipitation_type + "</td>"
            temp += "<td>" + u.time + "</td>";
            temp += "<td>" + u.type + "</td>";
            temp += "<td>" + u.value + "</td>";
            temp += "<td>" + u.unit + "</td>";

        })
        document.getElementById(elementId).innerHTML = temp;
    }
}
const HorsensData = () => {
    sendRequest('GET', 'http://localhost:8080/data/Horsens')
        .then(data => {
            document.getElementById('text').innerText = "Weather Data for Horsens city"

            tableAssign(data, "Horsens")})

}

function AarhusData() {
    sendRequest('GET' , 'http://localhost:8080/data/Aarhus')
        .then(data => {
            document.getElementById('text').innerText = "Weather Data for Aarhus city"

            tableAssign(data, "Horsens")
        })

}
function CopenhagenData(){
    sendRequest('GET', 'http://localhost:8080/data/Copenhagen').then(data=>{
        document.getElementById('text').innerText = "Weather Data for Copenhagen city"

    tableAssign(data, "Horsens")})
}
function last5Days(){
    sendRequest('GET', 'http://localhost:8080/data').then(
   data => {
       const ourDate = new Date();
       ourDate.setDate(ourDate.getDate() - 5);
       console.log(ourDate.toISOString())
       console.log(data)

       let newData = data.filter(t => t.time >= ourDate.toISOString())
       document.getElementById('text').innerText = "Weather Data for the last five days"
       tableAssign(newData, "Horsens")
   })
}
function temperatureMaxMin(){
    sendRequest('GET', 'http://localhost:8080/data').then(
        data =>{
            const ourDate = new Date();
            ourDate.setDate(ourDate.getDate() - 5);
            console.log(ourDate.toISOString())
            console.log(data)

            let newData = data.filter(t => t.time >= ourDate.toISOString() && t.type === 'temperature')
            let values = newData.map(v => v.value)
            let min = Math.min(...values)
            let max = Math.max(...values)
            document.getElementById('text').innerText = "Maximum temperature for the last 5 days is: " + max + ", Minimum temperature for the last 5 days is: " + min

        }
    )
}
function totalPrecipitation(){
    sendRequest('GET', 'http://localhost:8080/data').then(
        data =>{
            const ourDate = new Date();
            ourDate.setDate(ourDate.getDate() - 5);
            console.log(ourDate.toISOString())
            console.log(data)

            let newData = data.filter(t => t.time >= ourDate.toISOString() && t.type === 'precipitation')
            let total = newData.reduce(function (result, v){return result + v.value}, 0)

            console.log(total)
            document.getElementById('text').innerText = "Total precipitation for the last 5 days is: " + total
        }
    )
}
function averageWindSpeed(){
    sendRequest('GET', 'http://localhost:8080/data').then(
        data =>{
            const ourDate = new Date();
            ourDate.setDate(ourDate.getDate() - 5);
            console.log(ourDate.toISOString())
            console.log(data)

            let newData = data.filter(t => t.time >= ourDate.toISOString() && t.type === 'wind speed')
            let average = newData.reduce(function (result, v){return result + v.value / newData.length}, 0)

            console.log(average)
            document.getElementById('text').innerText = "Average wind speed for the last 5 days is: " + average
        }
    )

}

function dominantWindDirection(){
    sendRequest('GET', 'http://localhost:8080/data').then(
        data =>{
            const ourDate = new Date();
            ourDate.setDate(ourDate.getDate() - 5);
            console.log(ourDate.toISOString())
            console.log(data)

            let newData = data.filter(t => t.time >= ourDate.toISOString() && t.direction !== 'undefined' && t.direction)
            let directions = newData.map(d => d.direction)
            console.log(directions)
            const tally = (acc, x) => {
                if(! acc[x]){
                    acc[x] = 1
                    return acc
                }
                acc[x] += 1
                return acc
            }
            const totals = directions.reduce(tally, {})
            const keys = Object.keys(totals)
            const values = keys.map(x => totals[x])
            const results = keys.filter(x => totals[x] === Math.max(...values))
               /* directions.slice().sort(), most = [undefined, 0], counter = 0
            dominant.reduce(function (old, chr){
                old === chr ? ++counter > most[1] && (most = [chr, counter]) : (counter = 1)
*/
                document.getElementById('text').innerText = "Dominant wind direction for the last 5 days is: " + results
          //  })
        }
    )
}

function averageCloud(){
    sendRequest('GET', 'http://localhost:8080/data').then(
        data =>{
            const ourDate = new Date();
            ourDate.setDate(ourDate.getDate() - 5);
            console.log(ourDate.toISOString())
            console.log(data)

            let newData = data.filter(t => t.time >= ourDate.toISOString() && t.type === 'cloud coverage')
            let average = newData.reduce(function (result, v){return result + v.value / newData.length}, 0)

            console.log(average)
            document.getElementById('text').innerText = "Average cloud coverage for the last 5 days is: " + average
        }
    )
}
function forecast(){
    sendRequest('GET', 'http://localhost:8080/forecast').then(
        data => {
            console.log(data)
            if (data.length > 0) {
                let temp = ""
                data.map(u => {
                    temp += "<tr>";
                    temp += "<td>" + u.place + "</td>";
                    temp += "<td>" + u.precipitation_type + "</td>"
                    temp += "<td>" + u.time + "</td>";
                    temp += "<td>" + u.type + "</td>";
                    temp += "<td>" + u.from + "</td>";
                    temp += "<td>" + u.to + "</td>";
                    temp += "<td>" + u.unit + "</td>";


                })
                document.getElementById('text').innerText = "Forecast Data"
                document.getElementById("Horsens").innerHTML = temp;
            }
        })
}

Horsens.addEventListener('click', HorsensData)
Aarhus.addEventListener('click', AarhusData)
Copenhagen.addEventListener('click', CopenhagenData)
lastData.addEventListener('click', last5Days)
temperature.addEventListener('click', temperatureMaxMin)
precipitation.addEventListener('click', totalPrecipitation)
wind.addEventListener('click', averageWindSpeed)
windDir.addEventListener('click', dominantWindDirection)
cloud.addEventListener('click', averageCloud)
forecastInfo.addEventListener('click', forecast)
