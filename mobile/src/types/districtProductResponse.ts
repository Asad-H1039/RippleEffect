import { District } from "./district"

export type DistrictProductResponse = District & {
  commodities: Record<
    string,
    {
      name: string
      markets: Record<
        string,
        {
          average_price: number
          date: string
          historical_prices: number[]
          name: string
        }
      >
    }
  >
}
