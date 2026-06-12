import { seedData } from '../data/seedData'

const STORAGE_KEY = 'smart-gastro-ia-data'
const requiredCollections = ['suppliers', 'ingredients', 'products', 'purchases', 'sales']

function isValidStore(data) {
  return data && requiredCollections.every((key) => Array.isArray(data[key]))
}

function normalizeStore(data) {
  if (!isValidStore(data)) return seedData
  return {
    ...seedData,
    ...data,
    stockWarnings: Array.isArray(data.stockWarnings) ? data.stockWarnings : [],
  }
}

export function loadStore() {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (!saved) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData))
    return seedData
  }

  try {
    const data = normalizeStore(JSON.parse(saved))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return data
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData))
    return seedData
  }
}

export function saveStore(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function resetStore() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData))
  return seedData
}
