'use server'

export async function getWeather(coord) {
    const apiKey = process.env.API_KEY

    const weather = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${coord[0]}&lon=${coord[1]}&appid=${apiKey}`)
    const data = await weather.json()
    const forecastData = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${coord[0]}&lon=${coord[1]}&appid=${apiKey}`)
    const forecast = await forecastData.json()
    console.log('Datos recibidos------->', data, forecast)
    return { data, forecast }
}