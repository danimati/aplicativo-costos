# Prompt de implementación: Project Detail por ciclos y páginas

Actúa como un ingeniero senior de Angular 21 y continúa el proyecto existente `costos-industrial`. Lee primero todo el repositorio, especialmente `src/app/app.routes.ts`, `src/app/app.config.ts`, `src/app/core/models`, `src/app/core/services`, `src/app/data/data.nav.ts` y `src/app/core/features/project-detail`.

## Objetivo

Completa y estructura toda la experiencia de detalle de proyecto (`project-detail`) para que cada proyecto pueda tener sus propios ciclos y páginas. Todas las páginas deben existir desde ahora y ser visualmente funcionales como plantilla, pero los botones de creación, edición, exportación, impresión y acciones similares no deben ejecutar todavía una operación real ni abrir formularios obligatorios. La estructura debe quedar preparada para conectar posteriormente un backend sin rehacer las páginas.

La navegación debe depender del proyecto. No cargues siempre todas las páginas para todos los proyectos: cada `Project` debe declarar su `navTemplate` y `ProjectDetailComponent` debe cargar esa plantilla para mostrar únicamente los ciclos y hojas aplicables a ese proyecto. Las rutas deben seguir siendo estables y compatibles con `/app/proyectos/:id/:page`.

## Reglas técnicas obligatorias

- Usa Angular 21, componentes standalone y el estilo actual del repositorio.
- No agregues `standalone: true` en los decoradores; en esta versión ya es el comportamiento predeterminado.
- Usa signals, `computed`, `input()` y `output()` cuando corresponda; evita estado global innecesario.
- Usa `ChangeDetectionStrategy.OnPush` en los componentes nuevos o modificados.
- Usa `inject()` y servicios con responsabilidad única.
- Usa `@if`, `@for` y `@switch`; no uses `*ngIf`, `*ngFor` ni `*ngSwitch`.
- Conserva el lenguaje visual existente: `Newsreader`, `JetBrains Mono`, variables CSS actuales, bordes finos, paneles tipo expediente, tablas tipo ledger, sellos y `BalancePanelComponent` cuando aporte valor.
- Mantén accesibilidad WCAG AA: encabezados correctos, foco visible, labels, botones con nombres claros, tablas con `caption` o contexto accesible, estados no dependientes únicamente del color y navegación usable con teclado.
- No introduzcas dependencias nuevas si no son imprescindibles.
- No uses `any`; define interfaces y tipos explícitos.
- No uses datos hardcodeados de un proyecto dentro de una página. Obtén siempre el `id` desde `ActivatedRoute`, preferiblemente como signal, y consulta el servicio correspondiente.
- No cambies el contrato público de los servicios existentes sin necesidad. Si hace falta ampliarlo, actualiza a la vez la implementación mock y la API placeholder.

## Arquitectura de datos y servicios

Conserva el patrón actual:

```ts
export abstract class SomeService {
  abstract getByProject(projectId: string): Observable<SomeModel[]>;
}
```

Y para cada contrato:

- `src/app/core/services/mock/...`: datos demo realistas, aislados por `projectId`, con `of(...).pipe(delay(150))` como los mocks existentes.
- `src/app/core/services/api/...`: implementación placeholder preparada para `HttpClient`, sin inventar endpoints definitivos si no están definidos.
- `src/app/app.config.ts`: selección mock/API basada en `environment.useMock`.
- `src/app/core/models/...`: interfaces pequeñas y tipadas, separadas por dominio.

Reutiliza y completa los servicios existentes:

- `ProjectService`: proyecto, etapas, fechas, progreso y `navTemplate`.
- `BomService`: materiales exactos o estimados, proveedor, precio, cantidad y subtotal.
- `CatalogService`: materiales, proveedores, precios, descuentos y estado del catálogo.
- `ProjectDocumentService`: documentos Markdown o archivos del proyecto.
- `ProjectNoteService` y su servicio de UI: notas del proyecto, separadas de documentos.
- `NotificationService`: avisos de estado o revisión.

Crea solamente los contratos/mock/API que hagan falta para representar las páginas nuevas. Como mínimo, evalúa estos dominios:

- `LaborService`: etapas, horas estimadas, valor hora y costo por etapa.
- `ProjectCostService`: costos fijos, variables, indirectos, margen, costo total y valor final.
- `ProcurementService`: solicitudes, órdenes de compra y estado de compra.
- `ProductionService`: actividades de fabricación y ensamble.
- `InstallationService`: instalación, cableado, programación y pruebas.
- `ReportService`: datos consolidados para avance, costos, horas e indicadores.
- `ProjectAccessService` o equivalente solo si usuarios/permisos son parte del proyecto y no de administración global.

Cada página debe depender de un servicio abstracto, aunque por ahora solo pinte datos mock. No debe acoplarse a arrays locales dentro del componente salvo para textos estáticos, columnas o configuración de presentación.

## Modelo de navegación por proyecto

Conserva `NavCycle` y `NavLeaf` como la base del menú. Puedes agregar metadatos tipados si son necesarios, por ejemplo `enabled`, `order`, `priority` o `kind`, pero no conviertas el menú en una colección de rutas duplicadas.

La plantilla debe soportar que dos proyectos tengan diferentes hojas. Ejemplos:

- Un proyecto de estimación puede tener Ciclo I, Reportes y Configuración.
- Un proyecto en producción puede tener Ciclo I, Ciclo II, Reportes y Configuración.
- Un proyecto finalizado puede mostrar todos los ciclos y reportes históricos.
- Si un ciclo no tiene hojas habilitadas, no debe mostrarse.

`ProjectDetailComponent` debe:

1. Leer el `id` de la ruta.
2. Consultar el proyecto mediante `ProjectService`.
3. Cargar y limpiar correctamente la plantilla en `NavStateService`.
4. Mantener sincronizados ciclo y hoja con la ruta, incluidos los botones atrás/adelante del navegador.
5. Manejar proyecto inexistente o sin plantilla con un estado visual claro, sin errores de consola.
6. No conocer detalles de cada página ni duplicar lógica de negocio.

Las hojas deben conservar rutas estables y únicas. Actualiza `app.routes.ts` para que todas las hojas existentes sean navegables y tengan `data.cycle`, `data.leaf` y `data.title` coherentes. El redirect de un proyecto debe llevar a la primera hoja habilitada de su plantilla, no a una hoja fija que el proyecto no tenga.

## Ciclos y contenido obligatorio

Crea o completa las páginas que ya existen en la estructura actual. Cada página debe tener una plantilla visual coherente, estado vacío/loading/error razonable y datos mock representativos. Las acciones pueden ser botones visuales sin efecto real, pero deben tener nombres y ubicación correctos para conectar después.

### Ciclo I: Ingeniería y estimación

Ruta base: `pages/ciclo-i/`.

#### 1. Documentación y notas
Ruta: `documentacion`.

Debe contener:

- Lista de documentos del proyecto.
- Documento seleccionado y vista Markdown.
- Estado para documento de archivo no previsualizable.
- Notas del proyecto separadas visualmente de documentos.
- Metadatos: fecha, tipo, responsable o última actualización.
- Acciones visuales `Nuevo`, `Subir`, `Guardar`, `Eliminar` sin persistencia adicional por ahora.

Reutiliza `ProjectDocumentService`, `ProjectNoteService`, `MarkdownPipe` y `NotesModalComponent`. Corrige cualquier dato fijo de proyecto.

#### 2. Lista de materiales / BOM
Ruta: `bom`.

Debe contener:

- Resumen del tablero y especificaciones generales.
- Tabla de materiales con código, descripción, familia, proveedor, tipo de cálculo, cantidad, precio unitario y subtotal.
- Diferenciación visible entre cantidades exactas y estimadas/tipificadas.
- Nota metodológica para consumos aproximados.
- Total de materiales y conteo de ítems.
- Estado de revisión y responsable.
- Acciones visuales para agregar, importar, imprimir y exportar, sin comportamiento real.

Usa el `projectId` de la ruta y `BomService`; elimina el `PRY-2024-089` fijo actual.

#### 3. Mano de obra y etapas
Ruta: `mano-obra`.

Debe contener:

- Etapas: entendimiento del problema, diseño, fabricación, configuración, instalación y calibración, permitiendo que el mock tenga variaciones.
- Horas estimadas por etapa.
- Valor de la hora.
- Costo estimado por etapa.
- Total de horas y costo total de mano de obra.
- Responsable, estado y observaciones.
- Aviso claro de que es proyección y no medición de productividad, tiempo efectivo ni tiempo muerto.

Debe depender de `LaborService`.

#### 4. Plantillas base
Ruta: `plantillas`.

Debe contener:

- Plantilla aplicada al proyecto.
- Resumen de versión, familia de tablero, autor y fecha.
- Bloques de materiales, mano de obra y parámetros heredados.
- Estado `vigente`, `borrador` o `histórica`.
- Acciones visuales `Aplicar`, `Duplicar`, `Comparar` y `Guardar como plantilla`, sin ejecución real.

Debe quedar claro qué viene heredado y qué fue modificado en el proyecto.

### Ciclo II: Taller y producción

Ruta base: `pages/ciclo-ii/`.

Este ciclo representa ejecución operativa posterior a la estimación. No debe alterar automáticamente los costos ni simular una integración con ERP.

#### 5. Compras
Ruta: `compras`.

Debe contener:

- Materiales requeridos y su estado de compra.
- Proveedor seleccionado, cotización o referencia, precio y descuento.
- Estados como `pendiente`, `solicitado`, `ordenado`, `parcial` y `completo`.
- Fecha esperada y responsable.
- Resumen de valor solicitado y valor recibido.

Debe depender de `ProcurementService` y enlazar visualmente con el BOM sin duplicar su lógica.

#### 6. Recepción de materiales
Ruta: `recepcion`.

Debe contener:

- Lista de materiales esperados frente a recibidos.
- Cantidad solicitada, recibida y pendiente.
- Fecha de recepción, proveedor, lote o referencia.
- Incidencias, faltantes o materiales rechazados.
- Estado de recepción y responsable.

No debe registrar inventario real todavía.

#### 7. Fabricación
Ruta: `fabricacion`.

Debe contener:

- Órdenes o actividades de fabricación del tablero.
- Etapa, descripción, responsable, estado, avance y fecha objetivo.
- Evidencia o referencia visual como estado vacío, sin implementar subida real.
- Indicador de avance general de fabricación.

No debe medir tiempos reales ni productividad, porque RE-016, RE-017 y RE-018 están fuera del alcance actual.

#### 8. Ensamble
Ruta: `ensamble`.

Debe contener:

- Subensambles o conjuntos del tablero.
- Estado de cada conjunto, responsable y avance.
- Dependencias o bloqueos visibles.
- Resumen de conjuntos terminados, en proceso y pendientes.

Debe ser una plantilla operativa visual y no un sistema de captura de tiempos.

### Ciclo III: Instalación y puesta en marcha

Ruta base: `pages/ciclo-iii/`.

#### 9. Instalación
Ruta: `instalacion`.

Debe contener:

- Actividades de instalación en sitio.
- Ubicación o frente de trabajo.
- Responsable, estado, fecha prevista y avance.
- Requisitos previos y observaciones.

#### 10. Cableado
Ruta: `cableado`.

Debe contener:

- Circuitos, señales o grupos de cableado.
- Origen, destino, calibre o referencia, cantidad y estado.
- Pendientes de revisión y control de calidad.
- Resumen de cableado completo frente a pendiente.

No convertir esta página en un editor eléctrico especializado; es una vista de seguimiento.

#### 11. Programación
Ruta: `programacion`.

Debe contener:

- Controlador o sistema programado.
- Versión de programa, responsable, estado y fecha de revisión.
- Lista de entregables o hitos técnicos.
- Observaciones y bloqueos.

No implementar ejecución de PLC, conexión a maquinaria ni integración de hardware.

#### 12. Pruebas
Ruta: `pruebas`.

Debe contener:

- Casos o protocolos de prueba.
- Resultado `pendiente`, `aprobada`, `fallida` o `con observaciones`.
- Responsable, fecha, evidencia/referencia y observaciones.
- Resumen de pruebas aprobadas frente a pendientes.

No implementar telemetría ni captura automática de señales.

### Reportes y control

Ruta base: `pages/reportes/`.

Estas páginas son transversales y deben consumir datos consolidados de servicios, sin recalcular de forma distinta a las páginas de origen.

#### 13. Avance del proyecto
Ruta: `avance`.

Debe contener etapas, porcentaje, estado, responsable, fecha objetivo, hitos y bloqueos. Mostrar el avance general y el avance por ciclo.

#### 14. Costos
Ruta: `costos`.

Debe cubrir RE-029 a RE-035:

- Materiales.
- Mano de obra.
- Costos fijos asignados.
- Costos variables.
- Costos indirectos.
- Costo total.
- Porcentaje de ganancia.
- Ganancia estimada.
- Valor final estimado.
- Composición porcentual por familia de costo.

Usa la fórmula:

`Costo total = materiales + mano de obra + costos fijos asignados + costos variables + costos indirectos`

Por ahora, la comparación contra costo real (RE-027 y RE-037) debe mostrarse como estado no disponible o bloqueado si no existe dato real. No inventes costos ejecutados.

#### 15. Horas
Ruta: `horas`.

Debe mostrar el reporte de mano de obra proyectada por etapa: horas, valor hora y costo estimado. No debe medir horas efectivamente trabajadas ni tiempo muerto. El registro de capacidad disponible RE-015 puede permanecer como bloque futuro o estado `pendiente de caracterización`.

#### 16. Indicadores
Ruta: `indicadores`.

Debe contener indicadores derivados de datos mock, por ejemplo avance, distribución de costos, horas proyectadas, compras pendientes y pruebas aprobadas. Cada indicador debe indicar su fuente y evitar aparentar precisión real si el dato es solo demo.

### Configuración del proyecto

Ruta base: `pages/configuracion/`.

Distingue configuración del proyecto de administración global del sistema.

#### 17. Datos del proyecto
Ruta: `datos`.

Debe mostrar nombre, familia, fechas, estado, responsable, alcance, parámetros visibles y última actualización. Las acciones de editar/guardar son visuales por ahora.

#### 18. Usuarios
Ruta: `usuarios`.

Debe mostrar usuarios vinculados al proyecto, rol en el proyecto, estado y última actividad ficticia. No crear autenticación nueva ni reemplazar `AuthService`.

#### 19. Permisos
Ruta: `permisos`.

Debe mostrar una matriz visual de permisos por rol para consultar, editar, aprobar y administrar. La aplicación real de permisos puede quedar pendiente; no simular seguridad efectiva solo con ocultar botones.

## Componentes reutilizables a crear o revisar

Antes de duplicar HTML, identifica si conviene crear componentes pequeños dentro de `project-detail/components` o `src/app/core/shared`, respetando el estilo existente. Como mínimo evalúa:

- Encabezado de página de proyecto con eyebrow, título, subtítulo y acciones.
- Resumen/KPI strip.
- Tabla tipo ledger con estado vacío, loading y scroll responsive.
- Badge o stamp de estado.
- Barra de progreso accesible.
- Panel de resumen financiero reutilizable, extendiendo `BalancePanelComponent` solo si no rompe sus usos actuales.
- Timeline o lista de etapas.
- Estado vacío y estado de funcionalidad pendiente.
- Panel de bloqueos/incidencias.
- Selector o indicador de ciclo y hoja, si el shell actual no lo resuelve.

Los componentes compartidos deben recibir datos por `input()` y emitir eventos por `output()`. No deben conocer el `ProjectService` directamente si solo son visuales.

## Qué se omite explícitamente en esta iteración

No implementar todavía:

- Backend real, endpoints definitivos, base de datos, autenticación real ni autorización efectiva.
- Persistencia real de formularios o acciones de crear/editar/eliminar, salvo los flujos mock que ya existen para documentos y notas.
- Registro de tiempo efectivamente trabajado, tiempos muertos o productividad: RE-016, RE-017 y RE-018.
- Costos de maquinaria, herramientas o consumo energético específico de maquinaria: RE-022 y RE-023.
- Comparación estimado versus costo obtenido como dato real: RE-027 y RE-037 quedan preparados visualmente, pero bloqueados hasta modelar costos reales.
- Calibración automática con históricos: RE-028 queda como estado futuro o referencia visual.
- Registro de capacidad disponible RE-015 como insumo de cálculos; solo dejarlo identificado como pendiente de validación.
- Integraciones con ERP, contabilidad, proveedores, PLC, maquinaria, telemetría o almacenamiento de archivos remoto.
- Cálculo de inventario real, costos contables, impuestos o facturación.

## Criterios de aceptación

1. Cada proyecto carga solo los ciclos y hojas declarados por su `navTemplate`.
2. Un proyecto con una plantilla diferente navega correctamente sin modificar `app.routes.ts` en tiempo de ejecución.
3. Todas las rutas existentes de `project-detail` abren una página visual completa y coherente.
4. Ninguna página usa `PRY-2024-089` u otro proyecto fijo para consultar datos.
5. Cada página de datos consume un contrato de servicio abstracto y tiene mock correspondiente cuando el dominio lo requiere.
6. Los mocks están aislados por `projectId` y muestran estados variados suficientes para probar la interfaz.
7. Las páginas de costos, horas y reportes respetan las fórmulas y límites del documento de requisitos.
8. Las páginas no aparentan que una acción se guardó si todavía no hay persistencia; las acciones pendientes deben ser visuales o indicar estado no disponible.
9. La navegación atrás/adelante del navegador mantiene ciclo y hoja activos.
10. No aparecen errores de compilación, rutas rotas ni errores por proyecto inexistente.
11. La UI es responsive y accesible, especialmente tablas, botones, formularios visuales y estados de color.
12. Ejecuta `npm run build` y las pruebas existentes; corrige únicamente los errores relacionados con este trabajo.

## Forma de trabajar

Primero inspecciona y reutiliza lo existente. Después presenta un inventario breve de archivos que vas a crear o modificar y aplica los cambios por grupos pequeños. No borres datos ni cambios previos del usuario. Tras cada grupo importante ejecuta una validación enfocada. Al finalizar, resume:

- ciclos y páginas completados;
- servicios, modelos y mocks agregados;
- componentes reutilizables creados;
- funcionalidades deliberadamente omitidas;
- comandos de validación ejecutados y su resultado.

No conviertas esta tarea en una implementación de backend. El entregable de esta iteración es una experiencia `project-detail` completa, navegable, tipada, mockeable y preparada para crecer.
