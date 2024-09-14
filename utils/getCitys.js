'use server'

export async function getCitys(city) {
    const apiKey = process.env.API_KEY

    const weather = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=15&appid=${apiKey}`)
    const data = await weather.json()

  
    console.log('Datos recibidos------->', 'city', city, 'DATA:::::', data)
    return data
}