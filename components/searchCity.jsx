'use client'

import { getCitys } from "@/utils/getCitys"
import { useState } from "react"
import RenderWeather from "./renderWeather"
import { countries } from "@/utils/countries"

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
            <nav className="w-full flex justify-center mt-4">
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
                <button className="btn-buscar p-4 ml-4" onClick={modalCity}>BUSCAR</button>
            </nav>
            {modal && (
                <div className="modal w-full flex justify-center" onClick={() => setModal(false)}>
                    <div className="modal-container flex flex-col">
                        {[...Array(citys.length).keys()].map(i => (
                            <button className="btn-city p-4 mx-auto mb-4"
                                key={i}
                                type="text"
                                onClick={() => searchLatLon(citys[i].lat, citys[i].lon)}>
                                {citys[i].name} , {countries[citys[i].country]}{citys[i].state ? ' , ' : ' '}{citys[i].state}
                            </button>
                        ))}

                    </div>
                </div>
            )}
            <div>
                <RenderWeather coord={coord} />
            </div>
        </div>

    )
}