import { Market } from "./market"

export type Product = {
  id: string
  name: string
  markets: Market[]
}
