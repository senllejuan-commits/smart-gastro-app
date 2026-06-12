import { useEffect, useMemo, useState } from 'react'
import { loadStore, resetStore, saveStore } from './utils/storage'
import {
  checkSaleStock,
  createId,
  currency,
  getAiRecommendations,
  getAlerts,
  getDaysUntil,
  getExpiringIngredients,
  getIngredientName,
  getLowStockIngredients,
  getProductName,
  getSuggestedPurchases,
  getSupplierName,
  numberFormat,
  registerPurchase,
  registerSale,
} from './utils/business'

const units = ['kg', 'gr', 'litro', 'ml', 'unidad']
const productCategories = ['comida', 'bebida', 'postre', 'cafetería', 'otro']
const supplierCategories = ['carnes', 'verduras', 'panificados', 'bebidas', 'lácteos', 'otros']

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: 'DB' },
  { id: 'ingredients', label: 'Ingredientes', icon: 'IN' },
  { id: 'products', label: 'Productos', icon: 'PR' },
  { id: 'recipes', label: 'Recetas', icon: 'RC' },
  { id: 'suppliers', label: 'Proveedores', icon: 'PV' },
  { id: 'purchases', label: 'Compras', icon: 'CO' },
  { id: 'sales', label: 'Ventas', icon: 'VE' },
  { id: 'ai', label: 'Recomendaciones IA', icon: 'IA' },
]

const emptyIngredient = {
  name: '',
  unit: 'gr',
  stock: 0,
  minStock: 0,
  expiryDate: '',
  supplierId: '',
}

const emptyProduct = {
  code: '',
  name: '',
  price: 0,
  category: 'comida',
  recipe: [],
}

const emptySupplier = {
  name: '',
  category: 'otros',
  phone: '',
  email: '',
  ingredientIds: [],
  referencePrice: 0,
}

function App() {
  const [data, setData] = useState(loadStore)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    saveStore(data)
  }, [data])

  const alerts = useMemo(() => getAlerts(data), [data])

  function updateData(nextData, message) {
    setData(nextData)
    setNotice(message)
    window.setTimeout(() => setNotice(''), 2600)
  }

  function resetDemoData() {
    updateData(resetStore(), 'Datos de ejemplo restaurados.')
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">SG</span>
          <div>
            <strong>Smart Gastro APP</strong>
            <small>MVP para restaurantes</small>
          </div>
        </div>
        <nav>
          {tabs.map((tab) => {
            return (
              <button
                className={activeTab === tab.id ? 'nav-item active' : 'nav-item'}
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                type="button"
              >
                <span className="nav-icon">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <p className="eyebrow">Gestión independiente con reglas inteligentes</p>
            <h1>{tabs.find((tab) => tab.id === activeTab)?.label}</h1>
          </div>
          <button className="secondary-button" type="button" onClick={resetDemoData}>
            Restaurar demo
          </button>
        </header>

        <div className="mobile-tabs">
          {tabs.map((tab) => (
            <button
              className={activeTab === tab.id ? 'chip active' : 'chip'}
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>

        {notice && <div className="notice">{notice}</div>}

        {activeTab === 'dashboard' && <Dashboard data={data} alerts={alerts} />}
        {activeTab === 'ingredients' && <IngredientsView data={data} setData={updateData} />}
        {activeTab === 'products' && <ProductsView data={data} setData={updateData} />}
        {activeTab === 'recipes' && <RecipesView data={data} setData={updateData} />}
        {activeTab === 'suppliers' && <SuppliersView data={data} setData={updateData} />}
        {activeTab === 'purchases' && <PurchasesView data={data} setData={updateData} />}
        {activeTab === 'sales' && <SalesView data={data} setData={updateData} />}
        {activeTab === 'ai' && <RecommendationsView data={data} />}
      </main>
    </div>
  )
}

function Dashboard({ data, alerts }) {
  const lowStock = getLowStockIngredients(data.ingredients)
  const expiring = getExpiringIngredients(data.ingredients)
  const suggested = getSuggestedPurchases(data.ingredients)

  return (
    <section className="page-grid">
      <div className="metrics-grid">
        <Metric title="Productos" value={data.products.length} icon="PR" />
        <Metric title="Ingredientes" value={data.ingredients.length} icon="IN" />
        <Metric title="Stock crítico" value={lowStock.length} icon="ST" tone="danger" />
        <Metric title="Por vencer" value={expiring.length} icon="VC" tone="warning" />
        <Metric title="Compras sugeridas" value={suggested.length} icon="CO" />
        <Metric title="Ventas registradas" value={data.sales.length} icon="VE" />
      </div>

      <div className="content-split">
        <Panel title="Resumen de alertas">
          <AlertList alerts={alerts} />
        </Panel>
        <Panel title="Compras sugeridas">
          {suggested.length === 0 ? (
            <EmptyState text="No hay compras sugeridas por ahora." />
          ) : (
            <div className="suggestion-list">
              {suggested.map(({ ingredient, suggestedQuantity }) => (
                <div className="suggestion" key={ingredient.id}>
                  <strong>{ingredient.name}</strong>
                  <span>
                    Sugerido: {numberFormat.format(suggestedQuantity)} {ingredient.unit}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </section>
  )
}

function IngredientsView({ data, setData }) {
  const [form, setForm] = useState(emptyIngredient)
  const [editingId, setEditingId] = useState(null)

  function submit(event) {
    event.preventDefault()
    const ingredient = {
      ...form,
      stock: Number(form.stock),
      minStock: Number(form.minStock),
    }

    const ingredients = editingId
      ? data.ingredients.map((item) => (item.id === editingId ? { ...ingredient, id: editingId } : item))
      : [{ ...ingredient, id: createId('ing') }, ...data.ingredients]

    setData({ ...data, ingredients }, editingId ? 'Ingrediente actualizado.' : 'Ingrediente agregado.')
    setForm(emptyIngredient)
    setEditingId(null)
  }

  function edit(item) {
    setForm(item)
    setEditingId(item.id)
  }

  function remove(id) {
    setData(
      {
        ...data,
        ingredients: data.ingredients.filter((item) => item.id !== id),
        products: data.products.map((product) => ({
          ...product,
          recipe: product.recipe.filter((recipeItem) => recipeItem.ingredientId !== id),
        })),
      },
      'Ingrediente eliminado.',
    )
  }

  return (
    <section className="content-split">
      <Panel title={editingId ? 'Editar ingrediente' : 'Agregar ingrediente'}>
        <form className="form-grid" onSubmit={submit}>
          <Input label="Nombre" value={form.name} onChange={(value) => setForm({ ...form, name: value })} required />
          <Select label="Unidad" value={form.unit} options={units} onChange={(value) => setForm({ ...form, unit: value })} />
          <Input label="Stock actual" type="number" value={form.stock} onChange={(value) => setForm({ ...form, stock: value })} required />
          <Input label="Stock mínimo" type="number" value={form.minStock} onChange={(value) => setForm({ ...form, minStock: value })} required />
          <Input label="Vencimiento" type="date" value={form.expiryDate} onChange={(value) => setForm({ ...form, expiryDate: value })} />
          <Select
            label="Proveedor"
            value={form.supplierId}
            options={[{ value: '', label: 'Sin proveedor' }, ...data.suppliers.map((supplier) => ({ value: supplier.id, label: supplier.name }))]}
            onChange={(value) => setForm({ ...form, supplierId: value })}
          />
          <div className="form-actions">
            <button type="submit">{editingId ? 'Guardar cambios' : 'Agregar'}</button>
            {editingId && (
              <button className="secondary-button" type="button" onClick={() => { setEditingId(null); setForm(emptyIngredient) }}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </Panel>

      <Panel title="Ingredientes cargados">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Ingrediente</th>
                <th>Stock</th>
                <th>Mínimo</th>
                <th>Vence</th>
                <th>Proveedor</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.ingredients.map((item) => (
                <tr key={item.id} className={Number(item.stock) <= Number(item.minStock) ? 'critical-row' : ''}>
                  <td>{item.name}</td>
                  <td>{numberFormat.format(item.stock)} {item.unit}</td>
                  <td>{numberFormat.format(item.minStock)} {item.unit}</td>
                  <td>{item.expiryDate || '-'}</td>
                  <td>{getSupplierName(data.suppliers, item.supplierId)}</td>
                  <td className="row-actions">
                    <button className="text-button" type="button" onClick={() => edit(item)}>Editar</button>
                    <button className="text-button danger" type="button" onClick={() => remove(item.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </section>
  )
}

function ProductsView({ data, setData }) {
  const [form, setForm] = useState(emptyProduct)
  const [editingId, setEditingId] = useState(null)

  function submit(event) {
    event.preventDefault()
    const product = { ...form, price: Number(form.price), recipe: form.recipe || [] }
    const products = editingId
      ? data.products.map((item) => (item.id === editingId ? { ...product, id: editingId } : item))
      : [{ ...product, id: createId('prod') }, ...data.products]

    setData({ ...data, products }, editingId ? 'Producto actualizado.' : 'Producto agregado.')
    setForm(emptyProduct)
    setEditingId(null)
  }

  function edit(item) {
    setForm(item)
    setEditingId(item.id)
  }

  function remove(id) {
    setData(
      {
        ...data,
        products: data.products.filter((item) => item.id !== id),
        sales: data.sales.filter((sale) => sale.productId !== id),
      },
      'Producto eliminado.',
    )
  }

  return (
    <section className="content-split">
      <Panel title={editingId ? 'Editar producto' : 'Agregar producto'}>
        <form className="form-grid" onSubmit={submit}>
          <Input label="Código" value={form.code} onChange={(value) => setForm({ ...form, code: value })} required />
          <Input label="Nombre" value={form.name} onChange={(value) => setForm({ ...form, name: value })} required />
          <Input label="Precio de venta" type="number" value={form.price} onChange={(value) => setForm({ ...form, price: value })} required />
          <Select label="Categoría" value={form.category} options={productCategories} onChange={(value) => setForm({ ...form, category: value })} />
          <div className="form-actions">
            <button type="submit">{editingId ? 'Guardar cambios' : 'Agregar'}</button>
            {editingId && (
              <button className="secondary-button" type="button" onClick={() => { setEditingId(null); setForm(emptyProduct) }}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </Panel>

      <Panel title="Productos del menú">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Receta</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.products.map((item) => (
                <tr key={item.id}>
                  <td>{item.code}</td>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{currency.format(item.price)}</td>
                  <td>{item.recipe.length} ingrediente(s)</td>
                  <td className="row-actions">
                    <button className="text-button" type="button" onClick={() => edit(item)}>Editar</button>
                    <button className="text-button danger" type="button" onClick={() => remove(item.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </section>
  )
}

function RecipesView({ data, setData }) {
  const [selectedProductId, setSelectedProductId] = useState(data.products[0]?.id || '')
  const product = data.products.find((item) => item.id === selectedProductId)

  function updateRecipe(recipe) {
    setData(
      {
        ...data,
        products: data.products.map((item) => (item.id === selectedProductId ? { ...item, recipe } : item)),
      },
      'Receta actualizada.',
    )
  }

  function addRecipeItem() {
    if (!product || data.ingredients.length === 0) return
    updateRecipe([...product.recipe, { ingredientId: data.ingredients[0].id, quantity: 1 }])
  }

  function changeItem(index, field, value) {
    const recipe = product.recipe.map((item, itemIndex) =>
      itemIndex === index ? { ...item, [field]: field === 'quantity' ? Number(value) : value } : item,
    )
    updateRecipe(recipe)
  }

  function removeItem(index) {
    updateRecipe(product.recipe.filter((_, itemIndex) => itemIndex !== index))
  }

  return (
    <section className="page-grid">
      <Panel title="Seleccionar producto">
        <Select
          label="Producto"
          value={selectedProductId}
          options={data.products.map((item) => ({ value: item.id, label: `${item.code} - ${item.name}` }))}
          onChange={setSelectedProductId}
        />
      </Panel>

      <Panel title={product ? `Receta: ${product.name}` : 'Receta'}>
        {!product ? (
          <EmptyState text="Cargá un producto para crear su receta." />
        ) : (
          <>
            <div className="recipe-list">
              {product.recipe.map((item, index) => {
                const ingredient = data.ingredients.find((entry) => entry.id === item.ingredientId)
                return (
                  <div className="recipe-row" key={`${item.ingredientId}-${index}`}>
                    <select value={item.ingredientId} onChange={(event) => changeItem(index, 'ingredientId', event.target.value)}>
                      {data.ingredients.map((entry) => (
                        <option key={entry.id} value={entry.id}>{entry.name}</option>
                      ))}
                    </select>
                    <input min="0" step="0.01" type="number" value={item.quantity} onChange={(event) => changeItem(index, 'quantity', event.target.value)} />
                    <span>{ingredient?.unit || ''}</span>
                    <button className="text-button danger" type="button" onClick={() => removeItem(index)}>Eliminar</button>
                  </div>
                )
              })}
            </div>
            <button type="button" onClick={addRecipeItem}>Agregar ingrediente</button>
          </>
        )}
      </Panel>
    </section>
  )
}

function SuppliersView({ data, setData }) {
  const [form, setForm] = useState(emptySupplier)
  const [editingId, setEditingId] = useState(null)

  function submit(event) {
    event.preventDefault()
    const supplier = { ...form, referencePrice: Number(form.referencePrice) }
    const suppliers = editingId
      ? data.suppliers.map((item) => (item.id === editingId ? { ...supplier, id: editingId } : item))
      : [{ ...supplier, id: createId('sup') }, ...data.suppliers]

    setData({ ...data, suppliers }, editingId ? 'Proveedor actualizado.' : 'Proveedor agregado.')
    setForm(emptySupplier)
    setEditingId(null)
  }

  function edit(item) {
    setForm(item)
    setEditingId(item.id)
  }

  function remove(id) {
    setData(
      {
        ...data,
        suppliers: data.suppliers.filter((item) => item.id !== id),
        ingredients: data.ingredients.map((ingredient) => ingredient.supplierId === id ? { ...ingredient, supplierId: '' } : ingredient),
      },
      'Proveedor eliminado.',
    )
  }

  function toggleIngredient(id) {
    const exists = form.ingredientIds.includes(id)
    setForm({
      ...form,
      ingredientIds: exists ? form.ingredientIds.filter((item) => item !== id) : [...form.ingredientIds, id],
    })
  }

  return (
    <section className="content-split">
      <Panel title={editingId ? 'Editar proveedor' : 'Agregar proveedor'}>
        <form className="form-grid" onSubmit={submit}>
          <Input label="Nombre" value={form.name} onChange={(value) => setForm({ ...form, name: value })} required />
          <Select label="Rubro" value={form.category} options={supplierCategories} onChange={(value) => setForm({ ...form, category: value })} />
          <Input label="Teléfono" value={form.phone} onChange={(value) => setForm({ ...form, phone: value })} />
          <Input label="Email" type="email" value={form.email} onChange={(value) => setForm({ ...form, email: value })} />
          <Input label="Precio de referencia" type="number" value={form.referencePrice} onChange={(value) => setForm({ ...form, referencePrice: value })} />
          <div className="check-list">
            <span>Ingredientes que provee</span>
            {data.ingredients.map((ingredient) => (
              <label key={ingredient.id}>
                <input checked={form.ingredientIds.includes(ingredient.id)} type="checkbox" onChange={() => toggleIngredient(ingredient.id)} />
                {ingredient.name}
              </label>
            ))}
          </div>
          <div className="form-actions">
            <button type="submit">{editingId ? 'Guardar cambios' : 'Agregar'}</button>
            {editingId && (
              <button className="secondary-button" type="button" onClick={() => { setEditingId(null); setForm(emptySupplier) }}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </Panel>

      <Panel title="Proveedores cargados">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Proveedor</th>
                <th>Rubro</th>
                <th>Contacto</th>
                <th>Ingredientes</th>
                <th>Referencia</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.suppliers.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.phone}<br />{item.email}</td>
                  <td>{item.ingredientIds.map((id) => getIngredientName(data.ingredients, id)).join(', ') || '-'}</td>
                  <td>{currency.format(item.referencePrice)}</td>
                  <td className="row-actions">
                    <button className="text-button" type="button" onClick={() => edit(item)}>Editar</button>
                    <button className="text-button danger" type="button" onClick={() => remove(item.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </section>
  )
}

function PurchasesView({ data, setData }) {
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    supplierId: data.suppliers[0]?.id || '',
    ingredientId: data.ingredients[0]?.id || '',
    quantity: 0,
    totalPrice: 0,
    expiryDate: '',
  })

  function submit(event) {
    event.preventDefault()
    setData(registerPurchase(data, form), 'Compra registrada. El stock fue actualizado.')
    setForm({ ...form, quantity: 0, totalPrice: 0, expiryDate: '' })
  }

  return (
    <section className="content-split">
      <Panel title="Registrar compra">
        <form className="form-grid" onSubmit={submit}>
          <Input label="Fecha de compra" type="date" value={form.date} onChange={(value) => setForm({ ...form, date: value })} required />
          <Select label="Proveedor" value={form.supplierId} options={data.suppliers.map((item) => ({ value: item.id, label: item.name }))} onChange={(value) => setForm({ ...form, supplierId: value })} />
          <Select label="Ingrediente" value={form.ingredientId} options={data.ingredients.map((item) => ({ value: item.id, label: item.name }))} onChange={(value) => setForm({ ...form, ingredientId: value })} />
          <Input label="Cantidad comprada" type="number" value={form.quantity} onChange={(value) => setForm({ ...form, quantity: value })} required />
          <Input label="Precio total" type="number" value={form.totalPrice} onChange={(value) => setForm({ ...form, totalPrice: value })} required />
          <Input label="Vencimiento del lote" type="date" value={form.expiryDate} onChange={(value) => setForm({ ...form, expiryDate: value })} />
          <div className="form-actions">
            <button type="submit">Registrar compra</button>
          </div>
        </form>
      </Panel>

      <Panel title="Historial de compras">
        <HistoryTable
          rows={data.purchases}
          columns={[
            ['Fecha', (row) => row.date],
            ['Proveedor', (row) => getSupplierName(data.suppliers, row.supplierId)],
            ['Ingrediente', (row) => getIngredientName(data.ingredients, row.ingredientId)],
            ['Cantidad', (row) => numberFormat.format(row.quantity)],
            ['Total', (row) => currency.format(row.totalPrice)],
          ]}
        />
      </Panel>
    </section>
  )
}

function SalesView({ data, setData }) {
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    productId: data.products[0]?.id || '',
    quantity: 1,
  })
  const warnings = checkSaleStock(data, form.productId, form.quantity)

  function submit(event) {
    event.preventDefault()
    const result = registerSale(data, form)
    setData(result.data, result.warnings.length ? 'Venta no registrada: stock insuficiente.' : 'Venta registrada. El stock fue descontado.')
  }

  return (
    <section className="content-split">
      <Panel title="Registrar venta">
        <form className="form-grid" onSubmit={submit}>
          <Input label="Fecha de venta" type="date" value={form.date} onChange={(value) => setForm({ ...form, date: value })} required />
          <Select label="Producto vendido" value={form.productId} options={data.products.map((item) => ({ value: item.id, label: `${item.code} - ${item.name}` }))} onChange={(value) => setForm({ ...form, productId: value })} />
          <Input label="Cantidad vendida" min="1" type="number" value={form.quantity} onChange={(value) => setForm({ ...form, quantity: value })} required />
          {warnings.length > 0 && (
            <div className="inline-warning">
              {warnings.map((warning) => <span key={warning.message}>{warning.message}</span>)}
            </div>
          )}
          <div className="form-actions">
            <button type="submit">Registrar venta</button>
          </div>
        </form>
      </Panel>

      <Panel title="Historial de ventas">
        <HistoryTable
          rows={data.sales}
          columns={[
            ['Fecha', (row) => row.date],
            ['Producto', (row) => getProductName(data.products, row.productId)],
            ['Cantidad', (row) => numberFormat.format(row.quantity)],
          ]}
        />
      </Panel>
    </section>
  )
}

function RecommendationsView({ data }) {
  const recommendations = getAiRecommendations(data)
  return (
    <section className="page-grid">
      <Panel title="Recomendaciones IA">
        <div className="recommendations">
          {recommendations.map((recommendation) => (
            <div className="recommendation" key={recommendation}>
              <strong>IA</strong>
              <span>{recommendation}</span>
            </div>
          ))}
        </div>
      </Panel>
      <Panel title="Ingredientes próximos a vencer">
        <div className="suggestion-list">
          {getExpiringIngredients(data.ingredients).map((ingredient) => (
            <div className="suggestion" key={ingredient.id}>
              <strong>{ingredient.name}</strong>
              <span>Vence en {getDaysUntil(ingredient.expiryDate)} día(s)</span>
            </div>
          ))}
          {getExpiringIngredients(data.ingredients).length === 0 && <EmptyState text="No hay vencimientos próximos." />}
        </div>
      </Panel>
    </section>
  )
}

function Metric({ title, value, icon, tone = 'default' }) {
  return (
    <div className={`metric ${tone}`}>
      <div className="metric-icon">{icon}</div>
      <span>{title}</span>
      <strong>{value}</strong>
    </div>
  )
}

function Panel({ title, children }) {
  return (
    <section className="panel">
      <h2>{title}</h2>
      {children}
    </section>
  )
}

function AlertList({ alerts }) {
  if (alerts.length === 0) return <EmptyState text="No hay alertas activas." />
  return (
    <div className="alerts-list">
      {alerts.map((alert, index) => (
        <div className={`alert ${alert.type}`} key={`${alert.title}-${index}`}>
          <strong>{alert.title}</strong>
          <span>{alert.message}</span>
        </div>
      ))}
    </div>
  )
}

function EmptyState({ text }) {
  return <p className="empty-state">{text}</p>
}

function Input({ label, onChange, ...props }) {
  return (
    <label>
      <span>{label}</span>
      <input {...props} onChange={(event) => onChange(event.target.value)} />
    </label>
  )
}

function Select({ label, options, onChange, ...props }) {
  const normalizedOptions = options.map((option) =>
    typeof option === 'string' ? { value: option, label: option } : option,
  )

  return (
    <label>
      <span>{label}</span>
      <select {...props} onChange={(event) => onChange(event.target.value)}>
        {normalizedOptions.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  )
}

function HistoryTable({ rows, columns }) {
  if (rows.length === 0) return <EmptyState text="Todavía no hay registros." />
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {columns.map(([label]) => <th key={label}>{label}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {columns.map(([label, render]) => <td key={label}>{render(row)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App
