import { Card, DataTable, Divider, Icon, IconButton, Text } from "react-native-paper"
import { Product } from "../../../../types/product"
import { styles } from "./ProductItem.styles"
import { useState } from "react"
import { View } from "react-native"

type ProductItemProps = {
  product: Product
}

export const ProductItem = ({ product }: ProductItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const { name, markets } = product

  const cheapestMarket = markets.reduce((result, market) => {
    return market.averagePrice < result.averagePrice ? market : result
  }, markets[0])

  const priceTrend = cheapestMarket.historicalPrices[0] - cheapestMarket.historicalPrices[1] || 0

  console.log(product)

  return (
    <Card mode="contained">
      <Card.Title
        titleStyle={styles.title}
        title={name || "-"}
        subtitle={`${cheapestMarket.averagePrice} RWF`}
        right={({ size }) => (
          <View style={styles.iconsContainer}>
            {priceTrend > 0 && (
              <View style={styles.trendInfoContainer}>
                <Icon size={size} color="green" source="trending-up" />
                <Text style={styles.increaseColor}>{`+${priceTrend} RWF`}</Text>
              </View>
            )}
            {priceTrend < 0 && (
              <View style={styles.trendInfoContainer}>
                <Icon size={size} color="red" source="trending-down" />
                <Text style={styles.decreaseColor}>{`${priceTrend} RWF`}</Text>
              </View>
            )}

            <IconButton
              icon={isExpanded ? "chevron-up" : "chevron-down"}
              size={size}
              onPress={() => setIsExpanded((prev) => !prev)}
            />
          </View>
        )}
      />

      {isExpanded && (
        <Card.Content>
          <Divider />
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Market</DataTable.Title>
              <DataTable.Title sortDirection="ascending" numeric>
                Average
              </DataTable.Title>
              <DataTable.Title numeric>Min</DataTable.Title>
              <DataTable.Title numeric>Max</DataTable.Title>
            </DataTable.Header>
            {markets
              .sort((a, b) => a.averagePrice - b.averagePrice)
              .map((market) => (
                <DataTable.Row>
                  <DataTable.Cell>{market.name}</DataTable.Cell>
                  <DataTable.Cell numeric>{market.averagePrice}</DataTable.Cell>
                  <DataTable.Cell numeric>{Math.min(...market.historicalPrices)}</DataTable.Cell>
                  <DataTable.Cell numeric>{Math.max(...market.historicalPrices)}</DataTable.Cell>
                </DataTable.Row>
              ))}
          </DataTable>
        </Card.Content>
      )}
    </Card>
  )
}
