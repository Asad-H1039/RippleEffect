import { useQuery } from "react-query"
import { LocationList } from "../LocationList"
import { apiClient, endpoints } from "../../../../api"
import { Weather } from "../../../../types/weather"

const MOCKED_LOCATIONS = [
  { id: "0", name: "My current location", temperature: "20°C", condition: "Clouds", alert: "" },
  { id: "1", name: "Kigali", temperature: "25°C", condition: "Clear", alert: "" },
  { id: "2", name: "Butare", temperature: "22°C", condition: "Clouds", alert: "" },
  {
    id: "3",
    name: "Gisenyi",
    temperature: "28°C",
    condition: "Rainy",
    alert: "Heavy rainfall warning",
  },
]

export const LocationsTab = () => {
  const { data: weathers } = useQuery({
    queryKey: ["weathers"],
    queryFn: async () => {
      console.log(`api/${endpoints.DISTRICT_WEATHERS}`)
      const { data } = await apiClient.get<Weather[]>(endpoints.DISTRICT_WEATHERS)

      return data
    },
  })

  return <LocationList locations={weathers ?? []} />
}
