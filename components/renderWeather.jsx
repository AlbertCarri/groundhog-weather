"use cliente";

import { useEffect, useState } from "react";
import { getWeather } from "@/utils/getWeather";

// Grados a Puntos cardinales
const WindDirection = (x) => {
  if ((x >= 0 && x <= 19) || (x >= 250 && x <= 360)) return "Norte";
  if (x >= 20 && x <= 39) return "Norte/Nordeste";
  if (x >= 40 && x <= 59) return "Nordeste";
  if (x >= 60 && x <= 79) return "Este/Nordeste";
  if (x >= 80 && x <= 109) return "Este";
  if (x >= 110 && x <= 129) return "Este/Sudeste";
  if (x >= 130 && x <= 149) return "Sudeste";
  if (x >= 150 && x <= 169) return "Sur/Sudeste";
  if (x >= 170 && x <= 199) return "Sur";
  if (x >= 200 && x <= 219) return "Sur/Sudoeste";
  if (x >= 220 && x <= 239) return "Sudoeste";
  if (x >= 240 && x <= 259) return "Oeste/Sudoeste";
  if (x >= 260 && x <= 289) return "Oeste";
  if (x >= 290 && x <= 309) return "Oeste/Noreste";
  if (x >= 310 && x <= 329) return "Noreste";
  if (x >= 330 && x <= 349) return "Norte/Noreste";
  return;
};

//Tiempo en formato unix a hora y fecha standard
const unixToTime = (unix, timezone) => {
  const time = new Date((unix + 10800 + timezone) * 1000);
  return time.toLocaleString("en-GB");
};

//Nombre del día en español
const dayName = (unix, timezone) => {
  const fecha = new Date((unix + timezone) * 1000); // Convertimos de segundos a milisegundos
  const opciones = { weekday: "long" }; // Configuración para obtener solo el día
  return fecha.toLocaleDateString("es-ES", opciones).toUpperCase(); // Formato en español
};

export default function RenderWeather({ coord }) {
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState();
  const [forecast, setForecast] = useState();
  const [timeHere, setTimeHere] = useState();
  const [country, setCountry] = useState("");

  useEffect(() => {
    async function weather() {
      const { data, forecast } = await getWeather(coord);
      const time = new Date((data.dt + 10800 + data.timezone) * 1000);
      setTimeHere(time.toLocaleString("es").replace(",", ""));
      setWeatherData(data);
      setForecast(forecast);
      fetch("/countries.json")
        .then((resp) => resp.json())
        .then((dataW) => {
          const iso3166 = dataW;
          const countryCode = data.sys.country;
          const country = iso3166.find((c) => c.iso2 === countryCode);
          setCountry(country ? country.nameES : "Código no encontrado");
        })
        .catch((error) => console.error("error:", error));
      setLoading(false);
    }
    weather();
  }, [coord]);

  if (loading)
    return (
      <p className="text-center">
        <svg
          className="animate-spin w-32 h-32 mx-auto"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g strokeWidth="0"></g>
          <g strokeLinecap="round" strokeLinejoin="round"></g>
          <g>
            <path
              d="M2 12C2 6.47715 6.47715 2 12 2V5C8.13401 5 5 8.13401 5 12H2Z"
              fill="#154680"
            ></path>
          </g>
        </svg>
        Loading...........
      </p>
    );

  return (
    <div className="lg:w-4/5 w-full lg:max-h-[680px] flex lg:flex-row flex-col lg:mx-auto mx-auto mt-8 ">
      <div className="lg:w-2/5 w-full flex-col mx-auto justify-center rounded-xl">
        <div className=" bg-slate-800 py-4 px-4 text-center">
          <p className="lg:text-xl text-md mb-2 uppercase">
            {weatherData.name}, {country}
          </p>
          <p className="lg:text-2xl text-lg">
            Hora: {timeHere.substring(10, 20)}
            <span className="lg:ml-8 ml-8">
              {" "}
              {dayName(weatherData.dt, 0)} {timeHere.substring(0, 10)}
            </span>
          </p>
        </div>
        <div className="w-full relative">
          {/* eslint-disable @next/next/no-img-element */}
          <img
            className="w-full resize-x absolute"
            src={`/Groundhog/${weatherData.weather[0].icon}.jpg`}
            alt="icono"
          />
          <img
            className="absolute w-16 h-16 lg:mt-4 mt-2 lg:ml-4 ml-2"
            src={`/Iconos Clima/${weatherData.weather[0].icon}.png`}
            alt="icono"
          />
          <p className="absolute lg:text-6xl text-2xl mt-4 ml-24 drop-shadow">
            {(weatherData.main.temp - 273.15).toFixed(1)}ºC
          </p>
          <p className="absolute lg:text-2xl text-sm lg:mt-24 mt-16 ml-4 drop-shadow">
            Presión: {weatherData.main.pressure.toFixed(1)}mb
          </p>
          <p className="absolute lg:text-2xl text-sm lg:mt-32 mt-20 ml-4 drop-shadow">
            Humedad: {weatherData.main.humidity.toFixed(1)}%
          </p>
          <p className="absolute lg:text-2xl text-sm lg:mt-40 mt-24 ml-4 drop-shadow">
            Visibilidad: {weatherData.visibility / 1000}Km
          </p>
          <p className="absolute lg:text-2xl text-sm lg:mt-48 mt-28 ml-4 drop-shadow">
            Viento: {Math.floor(weatherData.wind.speed * 3.6)}Km/h
          </p>
          <p className="absolute lg:text-2xl text-sm lg:mt-56 mt-32 ml-4 drop-shadow">
            Dirección: {WindDirection(weatherData.wind.deg)}
          </p>
          <div className="absolute right-4 top-2 drop-shadow">
            <p className="lg:text-2xl text-sm mt-2">
              Amanece:{" "}
              {unixToTime(
                weatherData.sys.sunrise,
                weatherData.timezone
              ).substring(11, 20)}
              Hs
            </p>
            <p className="lg:text-2xl text-sm lg:mt-2 mt-0">
              Atardece:{" "}
              {unixToTime(
                weatherData.sys.sunset,
                weatherData.timezone
              ).substring(11, 20)}
              Hs
            </p>
            <p className="lg:text-2xl text-sm">
              {weatherData.rain
                ? "Lluvias : " + weatherData.rain["1h"] + "mm/h"
                : ""}
            </p>
            <p className="lg:text-2xl text-sm">
              {weatherData.snow
                ? "Nevadas : " + weatherData.snow["1h"] + "mm/h"
                : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Pronóstico extendido 4 días */}
      <div className="lg:w-3/5 w-full lg:ml-16 flex-col lg:max-h-[680px] max-h-[320px] p-4 lg:mt-0 mt-96 bg-slate-600 bg-opacity-60 rounded-lg overflow-scroll scroll-smooth snap-y">
        {forecast.list.map((forecastData) => (
          <div
            key={forecastData.lenght}
            className="flex flex-row h-24 snap-start items-center border-b-2 border-gray-800"
          >
            <div className="w-36 text-center">
              <p className="text-lg">
                {dayName(forecastData.dt, weatherData.timezone+10800)}
              </p>
              <p className="lg:text-xl text-xl ">
                {unixToTime(forecastData.dt, weatherData.timezone).substring(
                  11,
                  20
                )}
              </p>
            </div>
            <div className="lg:-mt-2 mt-0">
              {/* eslint-disable @next/next/no-img-element */}
              <img
                className="w-16 h-16 ml-4"
                src={`/Iconos Clima/${forecastData.weather[0].icon}.png`}
                alt="iconweather"
              />
              <p className="lg:hidden text-xl ml-6">
                {(forecastData.main.temp - 273.15).toFixed(1)}ºC
              </p>
            </div>
            <div>
              <p className="hidden lg:block text-xl ml-6">
                {(forecastData.main.temp - 273.15).toFixed(1)}ºC
              </p>
            </div>
            <div>
              <p className="lg:text-lg text-sm lg:ml-4 ml-2">
                Humedad: {forecastData.main.humidity}%
              </p>
            </div>
            <div>
              <p className="lg:text-lg text-sm ml-4">
                Vientos: {forecastData.wind.speed}km/h
              </p>
              <p className="lg:hidden lg:text-lg text-sm ml-1">
                {WindDirection(forecastData.wind.deg)}
              </p>
            </div>
            <div>
              <p className="hidden lg:block lg:text-lg text-sm ml-1">
                {" "}
                del {WindDirection(forecastData.wind.deg)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
