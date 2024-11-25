import { View } from "react-native"
import { ProductItem } from "../ProductItem"
import { Product } from "../../../../types/product"
import { styles } from "./ProductList.styles"

type ProductListProps = {
  products: Product[]
}

export const ProductList = ({ products }: ProductListProps) => {
  return (
    <View style={styles.productList}>
      {products.map((product) => (
        <ProductItem key={product.id} product={product} />
      ))}
    </View>
  )
}
