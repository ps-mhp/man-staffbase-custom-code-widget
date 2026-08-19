# Paso a paso

## Añadir CSS propio

1. Coloca el widget **Código personalizado** en la página; la posición
   no importa, ya que es invisible. Recomendación: colócalo al final de la página para que no
   moleste al editar.
2. Abre la configuración del widget. Aparecerá el editor de código; si está
   cerrado, vuelve a abrirlo con el botón **Editar código**.
3. Selecciona la pestaña **CSS** e introduce las reglas.
4. Comprueba el mensaje que aparece debajo del editor: si dice «No se han encontrado errores de sintaxis
», la estructura es correcta.
5. Haz clic en **Listo** y guarda la configuración del widget.
6. Comprueba el resultado en la **vista previa**; el CSS no se aplica en el editor.

## Introducir código JavaScript propio

1. Abre la configuración del widget y, en el editor de código, selecciona la pestaña **JavaScript**
  .
2. Introduce el código. Tienes a tu disposición `container` (el elemento del
  widget en la página) y `widgetApi` (la interfaz de Staffbase).
3. En **Ejecutar:** selecciona el momento de inicio: la opción predeterminada es «inmediatamente al
   renderizarse»; para scripts que modifican elementos existentes de la página, «cuando la
   página haya terminado de cargarse».
4. Opcionalmente, haz clic en **Formatear**; el código se sangrará automáticamente
   de forma ordenada.
5. Comprueba el mensaje que aparece debajo del editor, haz clic en **Listo** y guarda la
   configuración del widget.
6. Comprueba el resultado en la **Vista previa**. Si no ocurre nada, abre la consola del navegador
   — los errores de ejecución se registran allí.

## No te olvides de limpiar

Todo lo que siga ejecutándose —temporizadores, detectores de eventos, observadores— debe
terminarse en cuanto desaparezca el widget. De lo contrario, seguirá ejecutándose al seguir navegando por
la aplicación, ya que la página no se recarga.

1. En el script, guarda el elemento en ejecución en una variable.
2. Al final, devuelve una función que lo elimine:

   ```js
   const timer = setInterval(() => console.log("tick"), 1000);
   return () => clearInterval(timer);
   ```

Esta función se ejecuta automáticamente cuando se elimina el widget.

## Si algo sale mal

1. Abre la pestaña con el código defectuoso y lee el mensaje que aparece debajo del
   editor; en él se indica el número de línea.
2. Si eso no ayuda, copia el contenido del campo
   y borra el código; a continuación, pulsa **Listo** y guarda.
3. Comprueba si la página vuelve a funcionar con normalidad y, a continuación,
   vuelve a introducir el código poco a poco.
