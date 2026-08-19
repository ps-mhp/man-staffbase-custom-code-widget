# Código personalizado

El widget de código personalizado es la herramienta ideal para todo aquello que no permiten las funciones estándar del CMS:
un formato especial, ocultar de forma selectiva un
elemento o una pequeña interacción.

**No muestra nada por sí mismo.** En la página publicada es
invisible y no ocupa espacio. Solo contiene el código que introduzcas en
el cuadro de diálogo de configuración:

- **CSS** modifica el aspecto de la página. Se aplica a **toda la página**,
  no solo a la zona del widget.
- **JavaScript** modifica el comportamiento de la página y puede
  modificarla a tu antojo.

## Antes de empezar

Este widget requiere conocimientos de programación. No hay ningún control que
impida que un error deje la página inutilizable; aunque el widget
detecta los errores, un código «incorrecto, pero válido» seguirá funcionando. Si solo quieres
incrustar una imagen, una tabla o una entrada, te convendrá más utilizar los otros
widgets.

Regla general: comprueba primero si el resultado deseado se puede conseguir también con un
widget normal. El código personalizado es el último recurso, no el primero.

## Dónde se ejecuta el código

| Ubicación | JavaScript | CSS |
| --- | --- | --- |
| Página publicada | se ejecuta | surte efecto |
| Vista previa | se ejecuta | surte efecto |
| Editor del CMS (vista de edición) | **no** se ejecuta | **no** surte efecto |

En el editor, en el lugar del widget solo aparece una tarjeta con las primeras líneas
del código almacenado. Esto es intencionado: de lo contrario, un script defectuoso
destrozaría precisamente la interfaz en la que está intentando repararlo. Por lo tanto,
utilice siempre la **vista previa** para realizar pruebas.

En esta página de documentación **no se muestra ningún ejemplo en vivo**
por la misma razón: de lo contrario, el código se ejecutaría en la documentación en lugar de en su página.
