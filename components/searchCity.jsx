'use client'

import { getCitys } from "@/utils/getCitys"
import { useState } from "react"
import RenderWeather from "./renderWeather"

export default function SearchCity() {

    const [coord, setCoord] = useState([-34.21, -58.93])
    const [city, setCity] = useState('')
    const [citys, setCitys] = useState()
    const [modal, setModal] = useState(false)
    const [loading, setLoading] = useState(false)

    const searchLatLon = async (lat, lon) => {
        setCoord([lat, lon])
        setCity('')
        setModal(false)
    }

    const modalCity = async () => {
        const response = await getCitys(city)
        setCitys(response)
        setModal(true)

    }

    return (
        <div>
            <nav className="w-full flex justify-center">
                <input
                    className="w-60 p-4 text-xl text-gray-950 rounded-lg shadow-inner"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Entre la ciudad"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') modalCity()
                    }
                    }
                />
                <button className="w-32 bg-teal-800 text-xl rounded-lg p-4 ml-4 border-2" onClick={modalCity}>BUSCAR</button>
            </nav>
            {modal && (
                <div className="modal w-full flex justify-center align-middle" onClick={() => setModal(false)}>
                    <div className="modal-container w-1/4 flex flex-col">
                        {[...Array(citys.length).keys()].map(i => (
                            <button className="bg-slate-900 text-slate-300 border rounded-xl p-4"
                                key={i}
                                type="text"
                                onClick={() => searchLatLon(citys[i].lat, citys[i].lon)}>
                                {citys[i].name}/{citys[i].country}
                            </button>
                        ))}

                    </div>
                </div>
            )}
            <div className="w-3/4 flex justify-center text-2xl mt-12">
                <RenderWeather coord={coord} />
            </div>
        </div>

    )
}