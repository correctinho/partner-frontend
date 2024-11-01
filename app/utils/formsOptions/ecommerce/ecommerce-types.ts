export type EcommerceDefinitionsTypes = {
  title: string
  phoneNumber: string
  salesType: string
  correctDelivery: string
  freightByDistance: string
  additionalDistances: additionalDistances[]

}

export const ecommerceDefinitionsDefaultValues: EcommerceDefinitionsTypes = {
  title: '',
  phoneNumber: '',
  salesType: '',
  correctDelivery: '',
  freightByDistance: '',
  additionalDistances: [{
    distance: '',
    value: ''
  }]
}


export type additionalDistances = {
  distance: string
  value: string
}

export type ProductTypes = {
  category: string | null
  title: string | null
  isMegaPromotion: boolean
  image: string | null
  price: number | null
  promotionPrice: number | null
  stock: number | null
  description: string | null
  weight: number | null
}

export const productsDefaultValues: ProductTypes = {
  category: null,
  title: null,
  isMegaPromotion: false,
  image: null,
  price: null,
  promotionPrice: null,
  stock: null,
  description: null,
  weight: null
}
