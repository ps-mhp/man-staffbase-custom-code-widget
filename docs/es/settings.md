# Ajustes

El cuadro de diálogo de configuración muestra un campo **Código** que nunca se edita manualmente.
La edición se realiza en el editor de código situado encima; el botón **Editar código**
lo vuelve a abrir, y **Listo** aplica los cambios al campo.

## Pestañas del editor de código

| Pestaña | Descripción |
| --- | --- |
| CSS | Se inserta en la página como hoja de estilos y se aplica a **toda la página**, no solo al área del widget. Si se elimina el widget, el CSS también desaparece. |
| JavaScript | Se ejecuta con acceso a `container` (el elemento del widget) y a `widgetApi` (la interfaz de Staffbase). |

## Momento de inicio («Ejecutar:», solo en la pestaña JavaScript)

| Valor | Significado |
| --- | --- |
| inmediatamente al renderizarse | Ajuste predeterminado. El script se inicia en cuanto aparece el widget. Adecuado para todo aquello que no necesite otros elementos de la página. |
| cuando la página haya terminado de cargarse | El script espera hasta que el contenido de la página deje de cambiar; para scripts que manipulan elementos que se cargan posteriormente. En cualquier caso, se ejecuta como muy tarde a los 5 segundos. |

El CSS se aplica de inmediato en ambos casos. Esto es intencionado: así, la página
no se muestra brevemente sin estilo.

## Ayudas en el editor

| Función | Descripción |
| --- | --- |
| Comprobación de sintaxis | Se ejecuta mientras se escribe. Debajo del editor aparece «No se han encontrado errores de sintaxis» o la ubicación del error con el número de línea. Esto **no impide guardar el archivo**. En el caso del CSS, solo se comprueba la estructura de los corchetes, no cada propiedad. |
| Formato | Ajusta automáticamente la sangría del código. |
