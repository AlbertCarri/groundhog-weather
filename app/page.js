import { getWeather } from "@/utils/getWeather";
import SearchCity from "@/components/searchCity";

export default function Home() {

  const lat = -34.21
  const lon = -58.93

  getWeather({ lat, lon })

  return (
    <div>
      <SearchCity/>
    </div>
  );
}
