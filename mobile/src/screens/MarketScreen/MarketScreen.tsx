import { useState } from "react"
import { ScrollView, View } from "react-native"
import { ActivityIndicator, Searchbar } from "react-native-paper"
import { styles } from "./MarketScreen.styles"
import { ProductList } from "./components/ProductList"
import { Product } from "../../types/product"
import { useQuery } from "react-query"
import { apiClient, endpoints } from "../../api"
import { District } from "../../types/district"
import { Select } from "../../components/Select"
import { generateEndpoint } from "../../utils/generateEndpoint"
import { DistrictProductResponse } from "../../types/districtProductResponse"
import { Market } from "../../types/market"

export const MarketScreen = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchbarText, setSearchbarText] = useState("")
  const [selectedDistrictId, setSelectedDistrictId] = useState<District["id"]>()

  const { data: districts } = useQuery({
    queryKey: ["districts"],
    queryFn: async () => {
      console.log(`api/${endpoints.DISTRICTS}`)
      const { data } = await apiClient.get<District[]>(endpoints.DISTRICTS)

      return data
    },
  })
  const { data: products, isLoading: areProductsLoading } = useQuery({
    queryKey: ["districts", selectedDistrictId, searchQuery],
    queryFn: async () => {
      const {
        data: { commodities },
      } = await apiClient.get<DistrictProductResponse>(
        generateEndpoint(endpoints.DISTRICT_PRODUCTS, { id: selectedDistrictId ?? "" }) +
          searchQuery
      )

      const transformedComodities: Product[] = Object.entries(commodities).map(
        ([productId, productData]) => ({
          id: productId,
          name: productData.name,
          markets: Object.entries(productData.markets).map<Market>(([marketId, marketData]) => ({
            id: marketId,
            name: marketData.name,
            averagePrice: marketData.average_price,
            date: marketData.name,
            historicalPrices: marketData.historical_prices,
          })),
        })
      )

      return transformedComodities
    },
    enabled: !!selectedDistrictId,
  })

  const handleDistrictChange = (districtId: number) => {
    setSearchbarText("")
    setSearchQuery("")
    setSelectedDistrictId(districtId)
  }

  const handleSearchSubmit = () => {
    setSearchQuery(searchbarText)
  }

  const handleClearIconPress = () => {
    setSearchbarText("")
    setSearchQuery("")
  }

  return (
    <ScrollView>
      <View style={styles.marketScreen}>
        <View style={styles.header}>
          <Searchbar
            theme={{ colors: { outline: "tomato" } }}
            placeholder="Search"
            mode="view"
            value={searchbarText}
            onChangeText={setSearchbarText}
            onClearIconPress={handleClearIconPress}
            onSubmitEditing={handleSearchSubmit}
          />
          <Select<District>
            options={districts ?? []}
            selectedOption={selectedDistrictId}
            placeholder="Select district..."
            onOptionChange={handleDistrictChange}
          />
        </View>

        {areProductsLoading ? (
          <ActivityIndicator style={styles.loader} color="tomato" size="large" />
        ) : (
          <ProductList products={products ?? []} />
        )}
      </View>
    </ScrollView>
  )
}
