'use cliente'

import { useEffect, useState } from "react";
import { getWeather } from "@/utils/getWeather";

export default function RenderWeather({ coord }) {
    const [loading, setLoading] = useState(true)
    const [weatherData, setWeatherData] = useState()
    const [timeHere, setTimeHere] = useState()

    useEffect(() => {
        async function weather() {
            const data = await getWeather(coord)
            const time = new Date(((data.dt + 10800) + data.timezone) * 1000)
            console.log('Latitud , Longitud::::::::', data.dt, time, 'json:::', data)
            setTimeHere(time)
            setWeatherData(data)
            setLoading(false)
        }
        weather()
    }, [coord])

    if (loading) return <h1>Loading............</h1>

    return (
        <div>
            <h1>Hora actual en {weatherData.name}:{timeHere.toLocaleString('es')}</h1>
        </div>
    )
}