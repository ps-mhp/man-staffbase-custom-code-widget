# Preguntas frecuentes

**Pregunta:** ¿Se ejecuta mi código también en el editor del CMS mientras lo edito?

Respuesta: No. Solo se ejecuta en la página publicada y en la
vista previa. En el editor, en su lugar, verá una tarjeta con las primeras líneas
de su código. De este modo, un script con errores no puede estropear la interfaz
en la que lo está corrigiendo.

**Pregunta:** En el editor solo veo «Aún no hay código introducido. Edítelo a través de
la configuración del widget».

Respuesta: El widget está colocado, pero está vacío. Abre la configuración del widget e
introduce el código en el editor de código.

**Pregunta:** Mi script debe actuar sobre un elemento que aún no existe.

Respuesta: En la pestaña JavaScript, en **Ejecutar:** cambia a «cuando la página haya terminado
de cargarse». Así, el script esperará hasta que el contenido de la página se haya
estabilizado.

**Pregunta:** Mi CSS o JavaScript no funciona.

Respuesta: Comprueba lo siguiente, por orden: ¿Lo has probado en la **vista previa** y no
en el editor? ¿Aparece algún mensaje de error debajo del editor? ¿Se han guardado también los ajustes del widget después de hacer clic en **Listo**
? En el caso de JavaScript, abre además la
consola del navegador de la página publicada; allí aparecerán mensajes como
«El JavaScript tiene un error de sintaxis y no se ha ejecutado» o «El
JavaScript ha fallado al ejecutarse».

**Pregunta:** Aparece un error de sintaxis; ¿puedo guardar de todos modos?

Respuesta: Sí, la comprobación no bloquea nada. Es una indicación, no un bloqueo.
Sin embargo, el código JavaScript con errores ni siquiera se ejecutará en la página.

**Pregunta:** Mi CSS también modifica otras secciones de la página.

Respuesta: Así está previsto: el CSS se aplica de forma global. Si solo quieres
afectar a una sección, debes definir el selector de forma más específica.

**Pregunta:** ¿Puedo colocar varios widgets de código personalizado en una misma página?

Respuesta: Sí. Cada uno incluye su propio CSS, que desaparece al eliminar ese
widget, sin afectar a los demás. Sin embargo, no debes confiar en el
orden de ejecución de los scripts;
es mejor agrupar las dependencias en un único widget.

**Pregunta:** ¿Por qué mi script no se vuelve a ejecutar después de guardar?

Respuesta: Si el código no ha cambiado, no se vuelve a ejecutar. Solo un
cambio real en el código reinicia el script.

**Pregunta:** Mi temporizador sigue funcionando aunque haya salido de la página.

Respuesta: Al seguir navegando dentro de la aplicación, la página no se
recarga. Por eso, en el script hay que devolver una función de limpieza (véase «Paso
a paso») que detenga el temporizador y el listener.

**Pregunta:** ¿Quién puede utilizar este widget?

Respuesta: Cualquier persona con permiso para editar la página; y con ello puede
modificar la página como desee. Esto es intencionado, ya que el motivo habitual es precisamente
un elemento que no pertenece al propio widget. Solo Staffbase determina quién tiene
permisos.
