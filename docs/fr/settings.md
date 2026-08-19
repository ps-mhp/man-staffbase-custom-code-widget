# Paramètres

La boîte de dialogue de configuration affiche un champ **Code** qui n'est jamais modifié manuellement
. Les modifications s'effectuent dans l'éditeur de code situé au-dessus ; le bouton **Modifier le code**
le rouvre, tandis que **Terminé** applique l'état actuel au champ.

## Onglets de l’éditeur de code

| Onglet | Description |
| --- | --- |
| CSS | Est inséré dans la page sous forme de feuille de style et s’applique à **toute la page**, pas seulement à la zone du widget. Si le widget est supprimé, le CSS disparaît également. |
| JavaScript | S'exécute avec un accès à `container` (l'élément du widget) et à `widgetApi` (l'interface Staffbase). |

## Moment de démarrage (« Exécuter : », uniquement dans l’onglet JavaScript)

| Valeur | Signification |
| --- | --- |
| dès le rendu | Paramètre par défaut. Le script démarre dès que le widget s’affiche. Convient à tout ce qui ne nécessite pas d’autres éléments de la page. |
| une fois le chargement de la page terminé | Le script attend que le contenu de la page cesse de changer — pour les scripts qui manipulent des éléments chargés ultérieurement. Il démarre dans tous les cas au plus tard après 5 secondes. |

Le CSS s’applique immédiatement dans les deux cas. C’est voulu : ainsi, la page
n’apparaît pas brièvement sans mise en forme.

## Aides dans l’éditeur

| Fonction | Description |
| --- | --- |
| Vérification syntaxique | S’exécute au fur et à mesure de la saisie. Sous l’éditeur, le message « Aucune erreur de syntaxe détectée » s’affiche, ou bien l’emplacement de l’erreur avec son numéro de ligne. Cela **n’empêche pas l’enregistrement**. Pour le CSS, seule la structure des accolades est vérifiée, et non chaque propriété. |
| Mise en forme | Indente automatiquement le code de manière soignée. |
