# Paso a paso

## Añadir tu propio CSS

1. Coloca el widget **Código personalizado** en la página; la posición
   no importa, ya que es invisible. Recomendación: colócalo al final de la página para que no
   moleste al editar.
2. Abre la configuración del widget. El editor de código aparecerá a pantalla completa;
   si está cerrado, el botón **Editar código** lo volverá a abrir.
3. Selecciona la pestaña **CSS** e introduce las reglas.
4. Comprueba la barra de estado situada debajo del código: si pone «Sin errores», la
   estructura es correcta.
5. Haz clic en **Aplicar**, en la esquina superior derecha, y guarda la configuración
   del widget.
6. Comprueba el resultado en la **Vista previa**; el CSS no se aplica en el editor.

## Añadir tu propio código JavaScript

1. Abre la configuración del widget y, en el editor de código, selecciona la pestaña **JavaScript**
  .
2. Introduce el código. Tienes a tu disposición `container` (el elemento del
   widget en la página) y `widgetApi` (la interfaz de Staffbase).
3. En el panel **Código**, a la derecha, en **Ejecutar**, selecciona el momento de inicio:
   ajuste predeterminado «Inmediatamente al renderizarse»; para scripts que modifican
   elementos existentes de la página, «Cuando la página se haya cargado por completo».
4. Opcionalmente, haz clic en **Formatear**; el código se sangrará automáticamente
   de forma ordenada.
5. En el panel, en **Comprobación**, comprueba si ambos lenguajes indican «sin errores»
  ; haz clic en **Aplicar** y guarda la configuración del widget.
6. Comprueba el resultado en la **Vista previa**. Si no ocurre nada, abre la consola del navegador
   — allí se registran los errores de ejecución.

## No te olvides de limpiar

Todo lo que siga ejecutándose —temporizadores, detectores de eventos, observadores— debe
terminarse en cuanto desaparezca el widget. De lo contrario, seguirá ejecutándose al seguir navegando por
la aplicación, ya que la página no se recarga.

1. En el script, almacena el elemento en ejecución en una variable.
2. Al final, devuelve una función que lo elimine:

   ```js
   const timer = setInterval(() => console.log("tick"), 1000);
   return () => clearInterval(timer);
   ```

Esta función se invoca automáticamente cuando se elimina el widget.

## Si algo sale mal

1. En el panel **Código**, haz clic en **Ir al error**: el editor cambiará a
   la pestaña donde se encuentra el error y saltará a la línea correspondiente; el mensaje aparecerá justo
   debajo. Un número rojo en la pestaña indica qué lenguaje se ve afectado.
2. Si esto no ayuda, copia el código en el portapapeles y borra el contenido,
   luego haz clic en **Aplicar** y guarda los cambios.
3. Comprueba si la página vuelve a funcionar con normalidad y, a continuación,
   vuelve a pegar el código poco a poco.
