# Preguntas frecuentes

**Pregunta:** ¿Se ejecuta mi código también en el editor del CMS mientras lo edito?

Respuesta: No. Solo se ejecuta en la página publicada y en la
vista previa. En la vista de edición aparece, en su lugar, una tarjeta con las
primeras líneas del código almacenado; de lo contrario, un script defectuoso
destruiría la interfaz en la que se está intentando corregirlo.

**Pregunta:** ¿Quién puede añadir este widget a una página?

Respuesta: Cualquiera que tenga permiso de Staffbase para editar la página puede
modificarla como desee mediante este widget; esto es intencionado, ya que el
motivo habitual suele ser precisamente un elemento que no pertenece al propio widget.
El permiso para ello lo gestiona exclusivamente Staffbase, no el widget.

**Pregunta:** Mi script debe actuar sobre un elemento que aún no está
allí; ¿qué hago?

Respuesta: En la pestaña de JavaScript, cambia el momento de inicio a «Cuando la página haya terminado
de cargarse». De este modo, el script esperará hasta que el contenido de la página se haya
estabilizado, en lugar de ejecutarse inmediatamente al renderizarse el widget.

**Pregunta:** ¿Mi CSS o JavaScript desaparece de repente?

Respuesta: Un error de sintaxis no impide guardar el archivo, pero se muestra en
texto sin formato debajo del editor; comprueba el mensaje antes de cerrar el cuadro de diálogo.
En caso de errores de JavaScript en tiempo de ejecución, también conviene echar un vistazo a la
consola del navegador de la página publicada.
