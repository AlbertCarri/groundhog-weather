'use cliente'

import { useEffect, useState } from "react";
import { getWeather } from "@/utils/getWeather";

export default function RenderWeather({ coord }) {
    const [loading, setLoading] = useState(true)
    const [weatherData, setWeatherData] = useState()
    const [timeHere, setTimeHere] = useState()
    const [country, setCountry] = useState('')

    useEffect(() => {
        async function weather() {
            const data = await getWeather(coord)
            const time = new Date(((data.dt + 10800) + data.timezone) * 1000)
            console.log('ICON::::::::', data.weather)
            setTimeHere(time.toLocaleString('es'))
            setWeatherData(data)
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

    if (loading) return <h1>Loading............</h1>

    return (
        <div className="w-1/3 flex flex-col mx-auto mt-8 justify-center rounded-xl">
            <div className=" bg-slate-800 py-4 px-4 text-center">
                <p className="text-xl mb-2 uppercase">{weatherData.name} , {country}</p>
                <p className="text-2xl">Hora: {timeHere.substring(10, 19)}<span className="ml-40"> Fecha: {timeHere.substring(0, 9)}</span></p>
            </div>
            <div className="w-full relative">
                <img className="w-full resize-x absolute" src={`/Groundhog/${weatherData.weather[0].icon}.jpg`} alt="icono" />
                <p className="absolute text-6xl mt-4 ml-4 drop-shadow">{((weatherData.main.temp) - 273.15).toFixed(1)} C</p>
                <p className="absolute text-2xl mt-24 ml-4 drop-shadow">Presión : {(weatherData.main.pressure).toFixed(1)}mb</p>
                <p className="absolute text-2xl mt-32 ml-4 drop-shadow">Humedad : {(weatherData.main.humidity).toFixed(1)}%</p>
            </div>
        </div>
    )
}
