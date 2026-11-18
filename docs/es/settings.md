# Ajustes

El cuadro de diálogo de configuración abre el editor de código a pantalla completa. El campo
**Código** que aparece a continuación nunca se edita manualmente; si el editor está cerrado,
el botón **Editar código** lo vuelve a abrir. **Aplicar** guarda el
estado actual en el campo, mientras que **Cancelar** lo descarta (con un mensaje de confirmación si se ha
modificado algo). El cambio solo se guarda al guardar la configuración del widget.

## Pestañas sobre el área de código

| Pestaña | Descripción |
| --- | --- |
| CSS | Se inserta en la página como hoja de estilos y se aplica a **toda la página**, no solo al área del widget. Si se elimina el widget, el CSS también desaparece. |
| JavaScript | Se ejecuta con acceso a `container` (el elemento del widget) y a `widgetApi` (la interfaz de Staffbase). |

Un número en rojo en la pestaña indica un error en ese lenguaje.

## Ejecutar (panel «Código» a la derecha)

| Opción | Significado |
| --- | --- |
| Inmediatamente al renderizarse | Configuración predeterminada. El script se inicia en cuanto aparece el widget. Adecuado para todo aquello que no necesite otros elementos de la página. |
| Cuando la página haya terminado de cargarse | El script espera hasta que el contenido de la página deje de cambiar; es adecuado para scripts que manipulan elementos que se cargan posteriormente. En cualquier caso, se ejecuta como muy tarde a los 5 segundos. |

El CSS se aplica de inmediato en ambos casos. Esto es intencionado: así se evita que la página
aparezca brevemente sin estilo.

## Ayudas en el editor

| Función | Descripción |
| --- | --- |
| Comprobación de sintaxis | Se ejecuta mientras se escribe. Las líneas con errores aparecen resaltadas en rojo y el mensaje se muestra justo debajo. En el panel **Comprobación** aparece, según el lenguaje, «sin errores» o «1 error en la línea…»; **Ir a la ubicación del error** te lleva directamente allí. La comprobación **no impide guardar los cambios**. En el caso del CSS, solo se comprueba la estructura de los corchetes, no cada propiedad. |
| Barra de estado | Debajo del código: lenguaje, número de líneas, errores y la posición del cursor («línea 7, columna 32»). |
| Formato | Ajusta automáticamente la sangría del código del lenguaje seleccionado. Si no se puede leer, permanece sin cambios y la barra de estado indica el motivo. |
| Deshacer | La flecha de la cabecera deshace pasos completos de edición; en el propio código se utiliza ⌘/Ctrl+Z del editor. |
| Ayuda | El signo de interrogación de la parte superior (F1) explica los idiomas, la hora de inicio y la comprobación. |
