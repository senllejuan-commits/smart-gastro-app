# Smart Gastro APP

MVP funcional de una aplicación web para restaurantes. Permite cargar productos del menú, ingredientes, recetas, proveedores, compras y ventas manuales. A partir de esos datos calcula stock, vencimientos, alertas y recomendaciones simuladas de IA mediante reglas lógicas.

## Tecnologías

- React con Vite
- CSS simple
- LocalStorage para persistencia local
- Reglas internas para alertas y recomendaciones

## Cómo instalar

1. Abrir una terminal en la carpeta del proyecto.
2. Instalar dependencias:

```bash
npm install
```

3. Ejecutar el servidor local:

```bash
npm run dev
```

4. Abrir la URL que muestre Vite, normalmente:

```bash
http://localhost:5173
```

## Funcionalidades incluidas

- Dashboard subdividido en resumen, ventas y predicción, stock y compras, vencimientos y desperdicio, y eventos.
- Dashboard con cantidad de productos, ventas por producto, facturación estimada, márgenes, stock crítico, reporte de quiebres, vencimientos y compras sugeridas.
- Panel Ejecutivo con filtro de período para revisar hoy, 7 días, 30 días, 90 días o todo el historial: facturación, margen, unidades vendidas, productos más vendidos, alertas, quiebres y desperdicio.
- Descarga de reportes en formato CSV desde Panel Ejecutivo, Compras y Ventas.
- Predicción IA de ventas por producto a partir del historial cargado, con facturación y margen esperado para el día siguiente.
- Sección Eventos para cargar feriados, fechas patrias, eventos deportivos o fechas especiales con anticipación configurable.
- Agenda precargada con calendario patrio argentino y partidos nocturnos del Mundial FIFA 2026 en horario argentino.
- Notificación visible cuando se aproxima un evento importante, con acceso directo a la sección Eventos.
- ABM de ingredientes con código, familia de alimento, clasificación crítico/no crítico, unidad, stock, mínimo, vencimiento y proveedor.
- ABM de productos del menú con código, nombre, precio, categoría y receta asociada desde el mismo formulario.
- Cálculo de costo estimado de confección por producto según receta y costo unitario de ingredientes.
- Comparación entre costo de confección, precio de venta, margen estimado y porcentaje de margen.
- Dashboard de ventas, rendimientos y márgenes por producto, con unidades vendidas, facturación, costo, margen y rendimiento sobre costo.
- Carga de valores numéricos con formato local: puntos para miles y coma para decimales.
- Reporte de quiebres de stock con estado del ingrediente, faltante para llegar al mínimo y productos afectados.
- Edición de recetas por producto, seleccionando ingredientes y cantidades utilizadas.
- Al crear o editar un producto, se cargan las cantidades usadas de todos los ingredientes disponibles; los campos en 0 o vacíos no se incluyen en la receta.
- ABM de proveedores con rubro, teléfono, email, ingredientes provistos y precio de referencia.
- Registro de compras con actualización automática del stock del ingrediente.
- Registro de compras urgentes con motivo, medición del peso sobre el total, total pagado y sobrecosto estimado.
- Registro de ventas con descuento automático de stock según receta.
- Filtros rápidos de período en Compras y Ventas: hoy, 7 días, 30 días, 90 días o todo.
- Recomendaciones de compra futura según predicción de ventas, recetas, stock actual y stock mínimo.
- Edición y eliminación de compras y ventas para corregir errores de carga.
- Sección Ventas con conteo de productos vendidos y filtro de fechas en el historial.
- Advertencia cuando una venta no puede realizarse por falta de stock.
- Alertas automáticas de stock bajo, vencimiento próximo y compras sugeridas.
- Indicador de vencimiento y rotación: estima consumo del día, días para consumir stock y posible desperdicio antes del vencimiento.
- Criterio de vencimiento por ingrediente: fecha real de paquete o vida útil estimada. Tomate y lechuga 7 días, queso 15 días refrigerado y carne 6 días.
- Aviso de desperdicio de materia prima cuando un lote vence o cuando se estima que quedará stock sin usar al vencimiento.
- Recomendaciones IA simuladas con reglas lógicas, incluyendo avisos anticipados por eventos patrios y deportivos para preparar stock.
- Sección Objetivos para cargar una línea base previa a la instalación y medir reducción de quiebres, desperdicio y compras urgentes.
- Historial previo simulado de 60 días con compras problemáticas para representar la situación anterior a la implementación.
- Historial de ventas previo de 60 días para explicar qué demanda generaba esas compras y alimentar la predicción.
- Compras y ventas post implementación desde el 01/05/2026, visibles en las secciones Compras y Ventas.
- El historial previo queda separado en Objetivos; el historial post implementación se muestra en las secciones operativas.
- Botón para restaurar la simulación base, conservando estructura, historial previo e historial post implementación desde el 01/05/2026.
- La medición de objetivos compara la línea base previa contra los datos cargados después de instalar la app.

## Datos iniciales

El sistema arranca con ingredientes como pan de hamburguesa, carne, queso, tomate, lechuga, café y leche. También incluye productos como hamburguesa clásica, café con leche y ensalada simple, con recetas asociadas. No arranca con ventas ni compras cargadas, para que la medición posterior a la instalación sea limpia.

## Limitaciones del MVP

- No tiene autenticación real.
- No se conecta a POS, pantallas de comanda ni sistemas externos.
- No utiliza una IA externa; las recomendaciones son simuladas con reglas.
- LocalStorage guarda datos solo en el navegador y dispositivo actual.
- No contempla usuarios, roles, auditoría ni control avanzado de lotes.

## Lógica principal

- Una compra aumenta automáticamente el stock del ingrediente comprado.
- Una compra también actualiza el costo unitario del ingrediente usando precio total dividido cantidad comprada.
- Cada compra queda registrada como un lote separado con su propia fecha de vencimiento de paquete/lote.
- El vencimiento cargado en una compra no pisa el vencimiento base del ingrediente; permite diferenciar stock viejo de abastecimiento nuevo.
- Una venta busca la receta del producto y descuenta cada ingrediente multiplicado por la cantidad vendida.
- El costo de confección del producto se calcula sumando cantidad usada por costo unitario de cada ingrediente.
- El costo unitario se interpreta según la unidad de stock. Por ejemplo, si la carne se maneja en gramos y 1 kg cuesta $10.000, el costo unitario es $10 por gramo; un medallón de 150 g cuesta $1.500.
- Las compras respetan la unidad definida en Ingredientes. Si Carne está en `gr`, una compra de 10 kg se carga como `10000 gr`; si Leche está en `ml`, una compra de `1000 ml` se carga como `1000 ml`.
- Al editar o eliminar compras y ventas, el stock se corrige para reflejar el cambio.
- Si el stock no alcanza, la venta no se registra y se muestra una advertencia.
- Los ingredientes tienen código propio y pueden clasificarse como críticos o no críticos para visualizarlos en cuadros separados.
- Los ingredientes de familias perecederas quedan como críticos automáticamente: lácteos, verduras, panificados y proteínas.
- Los ingredientes con stock menor o igual al mínimo generan alertas y compras sugeridas.
- Los ingredientes con vencimiento dentro de los próximos 7 días generan alertas de vencimiento.
- Si un lote ya venció o se estima que quedará materia prima al vencer, el Dashboard muestra un aviso de desperdicio o riesgo de desperdicio.
- Para el indicador de rotación del MVP, todas las ventas registradas se consideran ventas del día actual.
- La fecha de vencimiento no se calcula estadísticamente: se carga según el lote/proveedor. El sistema calcula días restantes y cruza ese dato con el consumo estimado.
- Para alimentos cerrados, la fecha de vencimiento recomendada es la impresa en el paquete o etiqueta del lote.
- El dashboard muestra el indicador de vencimiento y rotación por lote, para distinguir el stock inicial de las compras nuevas.
