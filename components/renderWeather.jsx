'use cliente'

import { useEffect, useState } from "react";
import { getWeather } from "@/utils/getWeather";

export default function RenderWeather({ coord }) {
    const [loading, setLoading] = useState(true)
    const [weatherData, setWeatherData] = useState()
    const [forecast, setForecast] = useState()
    const [timeHere, setTimeHere] = useState()
    const [country, setCountry] = useState('')

    // Grados a Puntos cardinales
    const WindDirection = (x) => {
        if (x >= 0 && x <= 19 || x >= 250 && x <= 360) return 'Norte'
        if (x >= 20 && x <= 39) return 'Norte/Nordeste'
        if (x >= 40 && x <= 59) return 'Nordeste'
        if (x >= 60 && x <= 79) return 'Este/Nordeste'
        if (x >= 80 && x <= 109) return 'Este'
        if (x >= 110 && x <= 129) return 'Eeste/Sudeste'
        if (x >= 130 && x <= 149) return 'Sudeste'
        if (x >= 150 && x <= 169) return 'Sur/Sudeste'
        if (x >= 170 && x <= 199) return 'Sur'
        if (x >= 200 && x <= 219) return 'Sur/Sudoeste'
        if (x >= 220 && x <= 239) return 'Sudoeste'
        if (x >= 240 && x <= 259) return 'Oeste/Sudoeste'
        if (x >= 260 && x <= 289) return 'Oeste'
        if (x >= 290 && x <= 309) return 'Oeste/Noreste'
        if (x >= 310 && x <= 329) return 'Noreste'
        if (x >= 330 && x <= 349) return 'Norte/Noreste'
        return
    }

    //Tiempo en formato unix a hora y fecha standard
    const unixToTime = (unix, timezone) => {
        const time = new Date(((unix + 10800) + timezone) * 1000)
        return time.toLocaleString('es')
    }

    useEffect(() => {
        async function weather() {
            const { data, forecast } = await getWeather(coord)
            const time = new Date(((data.dt + 10800) + data.timezone) * 1000)
            console.log('ICON::::::::', data)
            setTimeHere(time.toLocaleString('es'))
            setWeatherData(data)
            setForecast(forecast)
            fetch('/countries.json')
                .then(resp => resp.json())
                .then(dataW => {
                    const iso3166 = dataW
                    const countryCode = data.sys.country
                    const country = iso3166.find(c => c.iso2 === countryCode)
                    setCountry(country ? country.nameES : "Código no encontrado")
                })
                .catch(error => console.error('error:', error))
            setLoading(false)
        }
        weather()
    }, [coord])

    if (loading) return (
        <p className="text-center">
            <svg className="animate-spin w-32 h-32 mx-auto"
                viewBox="0 0 24 24" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <g stroke-width="0"></g>
                <g stroke-linecap="round" stroke-linejoin="round"></g>
                <g>
                    <path d="M2 12C2 6.47715 6.47715 2 12 2V5C8.13401 5 5 8.13401 5 12H2Z" fill="#154680"></path>
                </g>
            </svg>
            Loading...........
        </p>
    )

    return (
        <div className="w-4/5 max-h-[680px] flex flex-row mx-auto mt-8 ">
            <div className="w-2/5 flex-col mx-auto justify-center rounded-xl">
                <div className=" bg-slate-800 py-4 px-4 text-center">
                    <p className="text-xl mb-2 uppercase">{weatherData.name} , {country}</p>
                    <p className="text-2xl">Hora: {timeHere.substring(10, 19)}<span className="ml-40"> Fecha: {timeHere.substring(0, 9)}</span></p>
                </div>
                <div className="w-full relative">
                    {/* eslint-disable @next/next/no-img-element */}
                    <img className="w-full resize-x absolute" src={`/Groundhog/${weatherData.weather[0].icon}.jpg`} alt="icono" />
                    <img className="absolute w-16 h-16 mt-4 ml-4" src={`/Iconos Clima/${weatherData.weather[0].icon}.png`} alt="icono" />
                    <p className="absolute text-6xl mt-4 ml-24 drop-shadow">{((weatherData.main.temp) - 273.15).toFixed(1)}ºC</p>
                    <p className="absolute text-2xl mt-24 ml-4 drop-shadow">Presión : {(weatherData.main.pressure).toFixed(1)}mb</p>
                    <p className="absolute text-2xl mt-32 ml-4 drop-shadow">Humedad : {(weatherData.main.humidity).toFixed(1)}%</p>
                    <p className="absolute text-2xl mt-40 ml-4 drop-shadow">Visibilidad : {(weatherData.visibility) / 1000}Km</p>
                    <p className="absolute text-2xl mt-48 ml-4 drop-shadow">Viento : {Math.floor((weatherData.wind.speed) * 3.6)}Km/h</p>
                    <p className="absolute text-2xl mt-56 ml-4 drop-shadow">Dirección : {WindDirection(weatherData.wind.deg)}</p>
                    <div className="absolute right-4 top-2 drop-shadow">
                        <p className="text-2xl mt-2">Amanece : {(unixToTime(weatherData.sys.sunrise, weatherData.timezone)).substring(10, 19)}Hs</p>
                        <p className="text-2xl mt-2">Atardece : {(unixToTime(weatherData.sys.sunset, weatherData.timezone)).substring(10, 19)}Hs</p>
                        <p className="text-2xl">{(weatherData.rain) ? 'Lluvias : ' + weatherData.rain['1h'] + 'mm/h' : ''}</p>
                        <p className="text-2xl">{(weatherData.snow) ? 'Nevadas : ' + weatherData.snow['1h'] + 'mm/h' : ''}</p>
                    </div>
                </div>
            </div>
            <div className="w-3/5 ml-16 flex-col p-4 bg-slate-600 bg-opacity-60 rounded-lg overflow-scroll scroll-smooth snap-y">
                {
                    forecast.list.map(forecastData => (
                        <div key={forecastData.lenght} className="flex flex-row h-24 snap-start items-center border-b-2 border-gray-800">
                            <div className="w-36 text-center">
                                <p className="text-sm">Fecha: {(unixToTime(forecastData.dt, weatherData.timezone)).substring(0, 9)}</p>
                                <p className="text-2xl">{(unixToTime(forecastData.dt, weatherData.timezone)).substring(10, 19)}</p>
                            </div>
                            <div className="-mt-2">
                                {/* eslint-disable @next/next/no-img-element */}
                                <img className="w-16 h-16ml-4" src={`/Iconos Clima/${forecastData.weather[0].icon}.png`} alt="iconweather" />
                            </div>
                            <div>
                                <p className="text-xl ml-6">{((forecastData.main.temp) - 273.15).toFixed(1)}ºC</p>
                            </div>
                            <div className="">
                                <p className="text-lg ml-4">Humedad: {forecastData.main.humidity}%</p>
                            </div>
                            <div className="">
                                <p className="text-lg ml-4">Vientos: {forecastData.wind.speed}km/h</p>
                            </div>
                            <div className="">
                                <p className="text-lg ml-1"> del {WindDirection(forecastData.wind.deg)}</p>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}
