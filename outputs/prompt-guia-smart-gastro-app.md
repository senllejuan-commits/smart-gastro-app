# Prompt guia para explicar y usar Smart Gastro APP

Usa este texto como prompt en ChatGPT o como guia para preparar la presentacion del proyecto.

---

Necesito que me ayudes a redactar y explicar paso a paso un MVP universitario llamado **Smart Gastro APP**, desarrollado para restaurantes.

La persona que va a leer o presentar esto no tiene experiencia tecnica, asi que explicalo con lenguaje simple, ordenado y practico.

## 1. Contexto general del MVP

Smart Gastro APP es una aplicacion web simple para restaurantes. Sirve para controlar:

- ingredientes;
- productos del menu;
- proveedores;
- compras;
- ventas;
- stock;
- vencimientos;
- costos;
- margenes;
- alertas;
- recomendaciones simuladas de IA.

La app no se conecta a sistemas externos, POS ni comandas reales. Funciona de manera independiente y manual.

La version final se abre desde un archivo HTML llamado:

```text
smart-gastro-ia.html
```

Ese archivo esta dentro de la carpeta:

```text
outputs
```

Para abrir la app, alcanza con hacer doble clic sobre ese archivo. No hace falta usar Terminal.

## 2. Nombre e identidad visual

Al principio la aplicacion se llamaba **Smart Gastro IA**.

Luego se cambio el nombre visible a:

```text
Smart Gastro APP
```

Tambien se incorporo una identidad visual basada en el logo **SG AI Consulting**:

- azul petroleo;
- turquesa;
- verde agua;
- fondo claro con estilo tecnologico;
- barra lateral con degradado;
- tarjetas y tablas mas modernas;
- logo visible en la barra lateral.

## 3. Modulos principales de la app

La aplicacion tiene estas secciones:

- Dashboard
- Ingredientes
- Productos
- Proveedores
- Compras
- Ventas
- Recomendaciones IA

Cada seccion cumple una funcion distinta dentro del control del restaurante.

## 4. Dashboard

El Dashboard muestra un resumen general:

- cantidad de productos;
- unidades vendidas;
- facturacion estimada;
- margen estimado;
- riesgo de desperdicio;
- lotes por vencer;
- ventas, rendimientos y margenes por producto;
- reporte de quiebres de stock;
- ventas registradas como ventas del dia;
- resumen de alertas;
- compras sugeridas;
- indicador de vencimiento y rotacion.

La tabla de ventas, rendimientos y margenes por producto muestra:

- unidades vendidas por producto;
- facturacion estimada;
- costo unitario de confeccion;
- precio de venta;
- porcentaje de costo sobre precio;
- margen unitario;
- margen porcentual;
- rendimiento sobre costo;
- margen total generado por las ventas cargadas.

El reporte de quiebres de stock muestra ingredientes con stock en cero o por debajo del minimo. Para cada ingrediente informa:

- estado: quiebre o riesgo;
- stock actual;
- stock minimo;
- faltante para llegar al minimo;
- productos afectados por ese ingrediente;
- accion sugerida.

El indicador de vencimiento y rotacion cruza dos datos:

```text
fecha de vencimiento del paquete/lote
consumo generado por las ventas registradas
```

Como simplificacion del MVP, todas las ventas registradas se consideran ventas realizadas hoy.

## 4. Panel Ejecutivo

El Panel Ejecutivo es una vista separada pensada para mostrar el estado del negocio al responsable de la operacion.

Muestra indicadores grandes:

- facturacion de hoy;
- margen de hoy;
- unidades vendidas;
- margen promedio;
- ticket promedio;
- alertas criticas.

Tambien incluye graficos de barras para:

- productos mas vendidos;
- facturacion por producto;
- margen generado por producto.

Ademas resume:

- producto mas vendido;
- costo total estimado;
- quiebres o riesgos de stock;
- riesgos de desperdicio;
- eventos proximos para preparar stock;
- alertas para decidir;
- desperdicio y vencimientos.

## 5. Eventos

La seccion Eventos permite cargar fechas importantes que pueden impactar en las ventas.

Ejemplos:

- feriados;
- fechas patrias;
- eventos deportivos;
- fines de semana largos;
- fechas especiales del restaurante.

Cada evento tiene:

- nombre;
- tipo;
- fecha;
- anticipacion del aviso;
- impacto esperado en ventas.

Si se carga una anticipacion de 30 dias, la IA empieza a avisar desde un mes antes. El aviso sugiere revisar stock de ingredientes criticos vinculados a los productos mas vendidos o principales.

Cuando un evento entra dentro del periodo de anticipacion, la app muestra una notificacion visible arriba de la pantalla con un boton para ir directo a Eventos. El menu Eventos tambien muestra un contador con la cantidad de avisos activos.

## 6. Ingredientes

En Ingredientes se pueden:

- agregar ingredientes;
- editar ingredientes;
- eliminar ingredientes.

Cada ingrediente tiene:

- codigo;
- nombre;
- familia de alimento;
- tipo de alimento: critico o no critico;
- unidad de stock;
- stock actual;
- stock minimo;
- costo por unidad de stock;
- vencimiento del paquete/lote.

La pantalla de Ingredientes separa la informacion en dos cuadros:

- Alimentos criticos;
- Alimentos no criticos.

Esto permite distinguir rapidamente alimentos que requieren mayor control operativo o sanitario.

Regla automatica:

- lacteos;
- verduras;
- panificados;
- proteinas.

Estas familias se consideran alimentos perecederos y quedan como criticos automaticamente.

Las unidades disponibles son:

```text
kg, gr, ml, unidad
```

Regla importante para mantener coherencia:

- Los ingredientes que se consumen enteros se cargan en `unidad`.
- Los ingredientes que se fraccionan por peso se cargan en `gr` o `kg`.
- Los ingredientes liquidos se cargan en `ml`.

Ejemplo:

```text
Pan de hamburguesa: unidad
Queso: unidad
Carne: gr
Tomate: gr
Lechuga: gr
Leche: ml
```

El pan de hamburguesa no debe cargarse en gramos si la receta usa panes enteros. Debe cargarse como `unidad`.

### Como se entiende el costo unitario

El costo unitario se interpreta segun la unidad elegida en el ingrediente.

Ejemplo con carne:

Si la carne se maneja en gramos:

```text
Unidad de stock: gr
```

Y se compran 10 kg a $15.000 el kilo:

```text
10 kg = 10000 gr
Precio total = $150.000
```

Entonces:

```text
$150.000 / 10000 gr = $15 por gr
```

Si una hamburguesa usa 150 gr de carne:

```text
150 gr x $15 = $2.250
```

Ese seria el costo de carne de un medallon dentro de la receta.

La app no interpreta automaticamente "medallon"; interpreta la cantidad exacta usada en la receta.

## 6. Productos

En Productos se pueden:

- agregar productos;
- editar productos;
- eliminar productos.

Cada producto tiene:

- codigo;
- nombre;
- precio de venta;
- categoria;
- receta asociada.

Al cargar o editar un producto, la app muestra todos los ingredientes disponibles. Para cada ingrediente se puede cargar la cantidad usada por una unidad del producto. Si un ingrediente no corresponde, se deja en blanco o en 0.

La app muestra:

- costo de confeccion;
- precio de venta;
- margen;
- porcentaje de margen;
- detalle de receta.

### Como se calcula el costo de confeccion

El costo de confeccion se calcula usando la receta del producto.

Ejemplo:

Hamburguesa clasica:

```text
Pan de hamburguesa: 1 unidad
Carne: 150 gr
Queso: 1 unidad
Tomate: 30 gr
Lechuga: 20 gr
```

La app multiplica cada ingrediente por su costo unitario y suma todo.

Luego compara:

```text
precio de venta - costo de confeccion = margen estimado
```

## 7. Proveedores

En Proveedores se pueden:

- agregar proveedores;
- editar proveedores;
- eliminar proveedores.

Cada proveedor tiene:

- nombre;
- rubro;
- telefono;
- email;
- precio de referencia.

Si se elimina un proveedor, los ingredientes no se eliminan. Simplemente quedan sin proveedor asociado.

## 8. Compras

En Compras se pueden:

- registrar compras;
- editar compras;
- eliminar compras.

El formulario de compras tiene este orden:

1. Fecha
2. Ingrediente
3. Cantidad de ingrediente comprada
4. Precio total pagado
5. Vencimiento de paquete / lote
6. Tipo de compra: planificada o urgente
7. Motivo si fue urgente

La cantidad comprada respeta la unidad definida en Ingredientes.

Cuando una compra se realiza fuera de la planificacion normal, se marca como urgente. Esto permite medir cuantas compras urgentes hubo, cuanto dinero representaron, que ingredientes las generaron y cual fue el motivo. El objetivo es usar esa informacion para anticipar mejor las compras futuras.

Ejemplo:

Si en Ingredientes la carne esta definida asi:

```text
Unidad de stock: gr
```

Entonces en Compras, al elegir carne, la cantidad se carga en gramos.

Para comprar 10 kg:

```text
Cantidad de ingrediente comprada: 10000
Precio total pagado: 150000
```

La app calcula:

```text
150000 / 10000 = 15
```

Es decir:

```text
$15 por gr
```

Cuando se registra una compra:

- aumenta el stock del ingrediente;
- actualiza el costo unitario;
- actualiza el vencimiento si se carga fecha de paquete/lote.

Si se edita una compra:

- revierte el stock anterior;
- aplica el nuevo stock;
- recalcula el costo.

Si se elimina una compra:

- descuenta del stock la cantidad que esa compra habia sumado.

## 9. Ventas

En Ventas se pueden:

- registrar ventas;
- editar ventas;
- eliminar ventas.

Cada venta tiene:

- fecha;
- producto vendido;
- cantidad vendida.

Cuando se registra una venta:

1. La app busca la receta del producto.
2. Multiplica los ingredientes por la cantidad vendida.
3. Descuenta esos ingredientes del stock.

Ejemplo:

Si se venden 2 hamburguesas y cada hamburguesa usa 150 gr de carne:

```text
2 x 150 gr = 300 gr
```

La app descuenta 300 gr de carne del stock.

Si se edita una venta:

- devuelve primero el stock de la venta anterior;
- descuenta despues el stock de la venta corregida.

Si se elimina una venta:

- devuelve al stock los ingredientes que se habian descontado.

## 10. Vencimientos

La app permite cargar el vencimiento de paquete o lote.

La fecha de vencimiento no se inventa automaticamente como verdad absoluta. Para alimentos cerrados, la fecha recomendada es la impresa en el paquete o etiqueta del lote.

Ejemplo:

```text
Leche cerrada
Vencimiento del paquete: 12/06/2026
```

Esa fecha se carga en la app.

Luego el sistema calcula:

- cuantos dias faltan para vencer;
- si vence dentro de los proximos 7 dias;
- si hay riesgo de desperdicio segun el consumo registrado.

## 11. Indicador de vencimiento y rotacion

Este indicador muestra:

- ingrediente;
- dias hasta vencer;
- consumo de hoy;
- dias estimados para consumir todo el stock;
- stock estimado al vencimiento;
- estado.

Estados posibles:

```text
Se consume antes
Riesgo de desperdicio
Riesgo alto
Vencido
Sin consumo hoy
```

Ejemplo:

Tomate:

```text
Stock actual: 5000 gr
Vence en: 4 dias
Consumo de hoy: 900 gr
```

Calculo:

```text
5000 / 900 = 5,5 dias
```

Como tarda 5,5 dias en consumirse pero vence en 4 dias:

```text
Riesgo de desperdicio
```

Otro ejemplo:

Carne:

```text
Stock actual: 3000 gr
Vence en: 6 dias
Consumo de hoy: 1500 gr
```

Calculo:

```text
3000 / 1500 = 2 dias
```

Como se consume en 2 dias y vence en 6:

```text
Se consume antes
```

## 12. Alertas inteligentes

La app genera alertas por reglas simples:

- stock bajo;
- proximo a vencer;
- sin stock suficiente;
- compra sugerida;
- riesgo de desperdicio.

No usa una IA real conectada a internet. Las recomendaciones IA son simuladas mediante reglas logicas.

## 13. Recomendaciones IA

La seccion Recomendaciones IA muestra sugerencias como:

- comprar un ingrediente con stock bajo;
- usar un ingrediente antes de que venza;
- revisar un proveedor;
- detectar productos que consumen mucho stock.
- avisar eventos cercanos del calendario patrio argentino;
- avisar partidos nocturnos del Mundial FIFA 2026 de selecciones importantes para preparar stock.
- predecir ventas futuras a partir del historial de ventas cargado;
- estimar facturacion y margen esperado para el dia siguiente;
- detectar tendencia de cada producto comparando ventas recientes contra ventas anteriores.

Estas recomendaciones son simuladas y sirven para mostrar como podria funcionar una IA en una version futura.

## 14. Como explicar el MVP en una presentacion

Una forma simple de presentarlo:

> Smart Gastro APP es un MVP para restaurantes que permite cargar ingredientes, productos, recetas, compras, proveedores y ventas. A partir de esos datos, el sistema actualiza stock, calcula costos, estima margenes, alerta sobre vencimientos y sugiere compras. El objetivo no es reemplazar un sistema comercial completo, sino demostrar la logica central de gestion gastronomica apoyada por reglas inteligentes.

## 15. Limitaciones del MVP

El MVP tiene algunas limitaciones:

- no tiene usuarios ni login;
- no se conecta a POS;
- no se conecta a proveedores reales;
- no usa IA real;
- los datos quedan guardados localmente en el navegador;
- los vencimientos reales dependen del paquete/lote o proveedor.

## 16. Ultimas mejoras realizadas

Las mejoras agregadas durante el desarrollo fueron:

- apertura simple desde archivo HTML;
- cambio de nombre a Smart Gastro APP;
- incorporacion del logo y paleta SG AI Consulting;
- edicion y eliminacion de ingredientes;
- edicion y eliminacion de productos;
- edicion y eliminacion de proveedores;
- edicion y eliminacion de compras;
- edicion y eliminacion de ventas;
- conteo de productos vendidos en la seccion Ventas;
- filtro de fechas en el historial de Ventas;
- calculo de costo de confeccion;
- calculo de margen;
- calculo de costo unitario segun unidad de stock;
- codigos propios para ingredientes;
- separacion de alimentos criticos y no criticos;
- familias perecederas definidas como criticas: lacteos, verduras, panificados y proteinas;
- aviso de desperdicio de materia prima por vencimiento o riesgo de desperdicio;
- panel ejecutivo con graficos de ventas, facturacion, margen, quiebres y desperdicio;
- eventos importantes con aviso anticipado para preparar stock;
- agenda precargada con calendario patrio argentino y partidos nocturnos del Mundial FIFA 2026 en horario argentino;
- simulacion base con historial previo separado y compras/ventas post implementacion desde el 01/05/2026 visibles en Compras y Ventas;
- seccion Objetivos para cargar una linea base previa y medir reduccion de quiebres, desperdicio y compras urgentes;
- historial previo simulado de 60 dias con compras problematicas anteriores a la implementacion;
- historial de ventas previo de 60 dias para explicar la demanda que generaba esas compras;
- compras simuladas post implementacion desde el 01/05/2026 para mostrar la mejora inicial;
- seguimiento de mejora contra metas de 6 meses;
- comparacion entre situacion previa a la app y datos cargados despues de la instalacion;
- prediccion IA de ventas por producto, facturacion esperada y margen esperado;
- dashboard subdividido en resumen, ventas y prediccion, stock, vencimientos/desperdicio y eventos;
- filtro de periodo en Panel Ejecutivo para ver hoy, 7 dias, 30 dias, 90 dias o todo el historial;
- descarga de reportes en Panel Ejecutivo, Compras y Ventas;
- filtros rapidos de periodo en Compras y Ventas: hoy, 7 dias, 30 dias, 90 dias o todo;
- recomendaciones de compra futura en Compras segun prediccion de ventas, recetas, stock actual y stock minimo;
- registro e impacto de compras urgentes para evaluar compras fuera de plan y anticiparlas mejor;
- dashboard de ventas, rendimientos y margenes por producto;
- reporte de quiebres de stock;
- carga de valores numericos con puntos para miles y coma para decimales;
- compras homogeneas con la unidad definida en ingredientes;
- carga de receta completa desde la seccion Productos;
- vencimiento de paquete/lote;
- criterio de vencimiento por ingrediente: fecha real de paquete o vida util estimada;
- vencimientos estimados de referencia: tomate 7 dias, lechuga 7 dias, queso 15 dias refrigerado y carne 6 dias;
- indicador de vencimiento y rotacion;
- dashboard mas completo.

## 17. Instruccion para pedir ayuda a ChatGPT

Podes pedirle a ChatGPT:

```text
Con esta informacion, ayudame a redactar una presentacion oral de 5 minutos para explicar el MVP Smart Gastro APP, con lenguaje universitario pero facil de entender.
```

Tambien podes pedir:

```text
Armame una defensa tecnica y funcional del proyecto Smart Gastro APP, explicando sus modulos, reglas de negocio, limitaciones y posibles mejoras futuras.
```
