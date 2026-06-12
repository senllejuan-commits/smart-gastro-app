import { seedData } from '../src/data/seedData.js'
import { checkSaleStock, registerPurchase, registerSale } from '../src/utils/business.js'

const clone = structuredClone(seedData)
const beefBefore = clone.ingredients.find((item) => item.id === 'ing-2').stock
const afterPurchase = registerPurchase(clone, {
  date: '2026-06-03',
  supplierId: 'sup-1',
  ingredientId: 'ing-2',
  quantity: 1000,
  totalPrice: 12000,
  expiryDate: '2026-06-10',
})
const beefAfterPurchase = afterPurchase.ingredients.find((item) => item.id === 'ing-2').stock

const saleResult = registerSale(afterPurchase, {
  date: '2026-06-03',
  productId: 'prod-1',
  quantity: 2,
})
const beefAfterSale = saleResult.data.ingredients.find((item) => item.id === 'ing-2').stock

const impossibleWarnings = checkSaleStock(saleResult.data, 'prod-1', 1000)

console.log(JSON.stringify({
  purchaseAddsStock: beefAfterPurchase === beefBefore + 1000,
  saleDiscountsRecipeStock: beefAfterSale === beefAfterPurchase - 300,
  impossibleSaleWarns: impossibleWarnings.length > 0,
}, null, 2))
