export const currency = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
})

export const numberFormat = new Intl.NumberFormat('es-AR', {
  maximumFractionDigits: 2,
})

export function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function getDaysUntil(dateText) {
  if (!dateText) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const date = new Date(`${dateText}T00:00:00`)
  return Math.ceil((date - today) / 86400000)
}

export function getIngredientName(ingredients, id) {
  return ingredients.find((ingredient) => ingredient.id === id)?.name || 'Sin ingrediente'
}

export function getSupplierName(suppliers, id) {
  return suppliers.find((supplier) => supplier.id === id)?.name || 'Sin proveedor'
}

export function getProductName(products, id) {
  return products.find((product) => product.id === id)?.name || 'Sin producto'
}

export function getLowStockIngredients(ingredients) {
  return ingredients.filter((ingredient) => Number(ingredient.stock) <= Number(ingredient.minStock))
}

export function getExpiringIngredients(ingredients) {
  return ingredients.filter((ingredient) => {
    const days = getDaysUntil(ingredient.expiryDate)
    return days !== null && days >= 0 && days <= 7
  })
}

export function getSuggestedPurchases(ingredients) {
  return getLowStockIngredients(ingredients).map((ingredient) => ({
    ingredient,
    suggestedQuantity: Math.max(Number(ingredient.minStock) * 2 - Number(ingredient.stock), Number(ingredient.minStock)),
  }))
}

export function checkSaleStock(data, productId, quantity) {
  const product = data.products.find((item) => item.id === productId)
  if (!product) return [{ message: 'Producto no encontrado.' }]

  return product.recipe
    .map((item) => {
      const ingredient = data.ingredients.find((entry) => entry.id === item.ingredientId)
      const needed = Number(item.quantity) * Number(quantity)
      if (!ingredient) return { message: 'La receta contiene un ingrediente inexistente.' }
      if (Number(ingredient.stock) < needed) {
        return {
          ingredientId: ingredient.id,
          message: `Stock insuficiente de ${ingredient.name}: necesita ${numberFormat.format(needed)} ${ingredient.unit} y hay ${numberFormat.format(ingredient.stock)} ${ingredient.unit}.`,
        }
      }
      return null
    })
    .filter(Boolean)
}

export function registerPurchase(data, purchase) {
  return {
    ...data,
    ingredients: data.ingredients.map((ingredient) =>
      ingredient.id === purchase.ingredientId
        ? {
            ...ingredient,
            stock: Number(ingredient.stock) + Number(purchase.quantity),
            expiryDate: purchase.expiryDate || ingredient.expiryDate,
          }
        : ingredient,
    ),
    purchases: [{ ...purchase, id: createId('pur') }, ...data.purchases],
  }
}

export function registerSale(data, sale) {
  const warnings = checkSaleStock(data, sale.productId, sale.quantity)
  if (warnings.length > 0) {
    return {
      data: {
        ...data,
        stockWarnings: warnings.map((warning) => ({
          id: createId('warn'),
          date: sale.date,
          productId: sale.productId,
          message: warning.message,
        })),
      },
      warnings,
    }
  }

  const product = data.products.find((item) => item.id === sale.productId)
  const ingredients = data.ingredients.map((ingredient) => {
    const recipeItem = product.recipe.find((item) => item.ingredientId === ingredient.id)
    if (!recipeItem) return ingredient
    return {
      ...ingredient,
      stock: Number(ingredient.stock) - Number(recipeItem.quantity) * Number(sale.quantity),
    }
  })

  return {
    data: {
      ...data,
      ingredients,
      sales: [{ ...sale, id: createId('sale') }, ...data.sales],
      stockWarnings: [],
    },
    warnings: [],
  }
}

export function getAlerts(data) {
  const lowStock = getLowStockIngredients(data.ingredients).map((ingredient) => ({
    type: 'stock',
    title: 'Stock bajo',
    message: `${ingredient.name} está en ${numberFormat.format(ingredient.stock)} ${ingredient.unit}.`,
  }))

  const expiring = getExpiringIngredients(data.ingredients).map((ingredient) => ({
    type: 'expiry',
    title: 'Próximo a vencer',
    message: `${ingredient.name} vence en ${getDaysUntil(ingredient.expiryDate)} día(s).`,
  }))

  const suggested = getSuggestedPurchases(data.ingredients).map(({ ingredient }) => ({
    type: 'purchase',
    title: 'Compra sugerida',
    message: `Comprar ${ingredient.name}: está por debajo del mínimo.`,
  }))

  const stockWarnings = (data.stockWarnings || []).map((warning) => ({
    type: 'warning',
    title: 'Sin stock suficiente',
    message: warning.message,
  }))

  return [...stockWarnings, ...lowStock, ...expiring, ...suggested]
}

export function getAiRecommendations(data) {
  const recommendations = []

  getLowStockIngredients(data.ingredients).forEach((ingredient) => {
    recommendations.push(`Comprar ${ingredient.name}: el stock actual está por debajo del mínimo.`)
  })

  getExpiringIngredients(data.ingredients).forEach((ingredient) => {
    recommendations.push(`Usar ${ingredient.name} antes del vencimiento.`)
  })

  const cheeseSupplier = data.suppliers.find((supplier) =>
    supplier.ingredientIds?.some((id) => getIngredientName(data.ingredients, id).toLowerCase().includes('queso')),
  )
  if (cheeseSupplier) {
    recommendations.push(`Revisar proveedor de queso (${cheeseSupplier.name}) por posible aumento de costo.`)
  }

  const beef = data.ingredients.find((ingredient) => ingredient.name.toLowerCase().includes('carne'))
  const burger = data.products.find((product) => product.name.toLowerCase().includes('hamburguesa'))
  if (beef && burger) {
    recommendations.push(`${burger.name} consume gran parte del stock de ${beef.name.toLowerCase()}.`)
  }

  if (recommendations.length === 0) {
    recommendations.push('El stock está estable. Mantener la frecuencia actual de compras.')
  }

  return recommendations
}
