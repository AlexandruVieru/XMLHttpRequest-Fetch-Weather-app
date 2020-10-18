
const Horsensxhr = document.getElementById('getData')
const Aarhusxhr = document.getElementById('aarhusxhr')
const Copenhagenxhr = document.getElementById('copenhagenxhr')
const lastDataxhr = document.getElementById('last5xhr')
const temperaturexhr = document.getElementById('tempMinMaxxhr')
const precipitationxhr = document.getElementById('totalPrecxhr')
const windxhr = document.getElementById('windSpeedxhr')
const windDirxhr = document.getElementById('windDirectionxhr')
const cloudxhr = document.getElementById('cloudAveragexhr')
const forecastInfoxhr = document.getElementById('forecastDataxhr')

function tableAssign(data, elementId){
    console.log(data)
    if(data.length > 0){
        let temp=""
        data.map(u => {
            temp += "<tr>";
            temp += "<td>" + u.place + "</td>";
            temp += "<td>" + u.time + "</td>";
            temp += "<td>" + u.type + "</td>";
            temp += "<td>" + u.value + "</td>";
            temp += "<td>" + u.unit + "</td>";


        })
        document.getElementById(elementId).innerHTML = temp;
    }
}

const sendHttpRequest = (method, url, data) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);

        xhr.responseType = 'json';

        if (data) {
            xhr.setRequestHeader('Content-Type', 'application/json');
        }

        xhr.onload = () => {
            if (xhr.status >= 400) {
                reject(xhr.response);
            } else {
                resolve(xhr.response);
            }
        };

        xhr.onerror = () => {
            reject('Something went wrong!');
        };

        xhr.send(JSON.stringify(data));
    });
};

function getDataHorsens(){
    sendHttpRequest('GET', 'http://localhost:8080/data/Horsens').then(data => {
        document.getElementById('textXhr').innerText = "Weather Data for Horsens city"

        tableAssign(data, 'xhr')
    })
}
function AarhusData() {
    sendHttpRequest('GET', 'http://localhost:8080/data/Aarhus').then(data => {
        document.getElementById('textXhr').innerText = "Weather Data for Aarhus city"

        tableAssign(data, 'xhr')
    })

}
function CPHData() {
    sendHttpRequest('GET', 'http://localhost:8080/data/Copenhagen').then(data => {
        document.getElementById('textXhr').innerText = "Weather Data for Copenhagen city"

        tableAssign(data, 'xhr')
    })

}

function last5Days(){
    sendHttpRequest('GET', 'http://localhost:8080/data').then(
        data => {
            const ourDate = new Date();
            ourDate.setDate(ourDate.getDate() - 5);
            console.log(ourDate.toISOString())
            console.log(data)

            let newData = data.filter(t => t.time >= ourDate.toISOString())
            document.getElementById('textXhr').innerText = "Weather Data for the last five days"

            tableAssign(newData, "xhr")
        })
}
function temperatureMaxMin(){
    sendHttpRequest('GET', 'http://localhost:8080/data').then(
        data =>{
            const ourDate = new Date();
            ourDate.setDate(ourDate.getDate() - 5);
            console.log(ourDate.toISOString())
            console.log(data)

            let newData = data.filter(t => t.time >= ourDate.toISOString() && t.type === 'temperature')
            let values = newData.map(v => v.value)
            let min = Math.min(...values)
            let max = Math.max(...values)
            document.getElementById('textXhr').innerText = "Maximum temperature for the last 5 days is: " + max + ", Minimum temperature for the last 5 days is: " + min

        }
    )
}
function totalPrecipitation(){
    sendHttpRequest('GET', 'http://localhost:8080/data').then(
        data =>{
            const ourDate = new Date();
            ourDate.setDate(ourDate.getDate() - 5);
            console.log(ourDate.toISOString())
            console.log(data)

            let newData = data.filter(t => t.time >= ourDate.toISOString() && t.type === 'precipitation')
            let total = newData.reduce(function (result, v){return result + v.value}, 0)

            console.log(total)
            document.getElementById('textXhr').innerText = "Total precipitation for the last 5 days is: " + total
        }
    )
}
function averageWindSpeed(){
    sendHttpRequest('GET', 'http://localhost:8080/data').then(
        data =>{
            const ourDate = new Date();
            ourDate.setDate(ourDate.getDate() - 5);
            console.log(ourDate.toISOString())
            console.log(data)

            let newData = data.filter(t => t.time >= ourDate.toISOString() && t.type === 'wind speed')
            let average = newData.reduce(function (result, v){return result + v.value / newData.length}, 0)

            console.log(average)
            document.getElementById('textXhr').innerText = "Average wind speed for the last 5 days is: " + average
        }
    )

}

function dominantWindDirection(){
    sendHttpRequest('GET', 'http://localhost:8080/data').then(
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
               document.getElementById('textXhr').innerText = "Dominant wind direction for the last 5 days is: " + results

        }
    )
}

function averageCloud(){
    sendHttpRequest('GET', 'http://localhost:8080/data').then(
        data =>{
            const ourDate = new Date();
            ourDate.setDate(ourDate.getDate() - 5);
            console.log(ourDate.toISOString())
            console.log(data)

            let newData = data.filter(t => t.time >= ourDate.toISOString() && t.type === 'cloud coverage')
            let average = newData.reduce(function (result, v){return result + v.value / newData.length}, 0)

            console.log(average)
            document.getElementById('textXhr').innerText = "Average cloud coverage for the last 5 days is: " + average
        }
    )
}
function forecast(){
    sendHttpRequest('GET', 'http://localhost:8080/forecast').then(
        data => {
            console.log(data)
            if (data.length > 0) {
                let temp = ""
                data.map(u => {
                    temp += "<tr>";
                    temp += "<td>" + u.place + "</td>";
                    temp += "<td>" + u.time + "</td>";
                    temp += "<td>" + u.type + "</td>";
                    temp += "<td>" + u.from + "</td>";
                    temp += "<td>" + u.to + "</td>";
                    temp += "<td>" + u.unit + "</td>";


                })
                document.getElementById('textXhr').innerText = "Forecast Data"

                document.getElementById("xhr").innerHTML = temp;
            }
        })
}
Horsensxhr.addEventListener('click', getDataHorsens)
Aarhusxhr.addEventListener('click', AarhusData)
Copenhagenxhr.addEventListener('click', CPHData)
lastDataxhr.addEventListener('click', last5Days)
temperaturexhr.addEventListener('click', temperatureMaxMin)
precipitationxhr.addEventListener('click', totalPrecipitation)
windxhr.addEventListener('click', averageWindSpeed)
windDirxhr.addEventListener('click', dominantWindDirection)
cloudxhr.addEventListener('click', averageCloud)
forecastInfoxhr.addEventListener('click', forecast)