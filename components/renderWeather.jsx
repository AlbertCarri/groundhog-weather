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
            console.log('Latitud , Longitud::::::::', data.dt, time, 'json:::', data)
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
        <div>
            <h1>Ciudad : {weatherData.name}</h1>
            <h2>Hora actual : {timeHere.substring(10, 19)} Fecha: {timeHere.substring(0, 9)}</h2>
            <h2>Pais : {country}</h2>
        </div>
    )
}
