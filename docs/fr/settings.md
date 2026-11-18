# Paramètres

La boîte de dialogue de configuration ouvre l'éditeur de code en plein écran. Le champ
**Code** situé derrière ne doit jamais être modifié manuellement ; si l'éditeur est fermé,
le bouton **Modifier le code** le rouvre. **Appliquer** enregistre l’
état actuel dans le champ, **Annuler** le rejette (avec une demande de confirmation si des
modifications ont été apportées). L’enregistrement n’a lieu qu’au moment de la configuration du widget.

## Onglets au-dessus de la zone de code

| Onglet | Description |
| --- | --- |
| CSS | Est inséré dans la page sous forme de feuille de style et s’applique à **toute la page**, pas seulement à la zone du widget. Si le widget est supprimé, le CSS disparaît également. |
| JavaScript | S'exécute avec un accès à `container` (l'élément du widget) et à `widgetApi` (l'interface Staffbase). |

Un chiffre rouge sur l'onglet indique une erreur dans ce langage.

## Exécution (panneau « Code » à droite)

| Option | Signification |
| --- | --- |
| Immédiatement lors du rendu | Paramètre par défaut. Le script démarre dès que le widget s’affiche. Convient à tout ce qui ne nécessite pas d’autres éléments de la page. |
| Une fois la page entièrement chargée | Le script attend que le contenu de la page cesse de changer — pour les scripts qui manipulent des éléments chargés ultérieurement. Il se lance dans tous les cas au plus tard après 5 secondes. |

Le CSS s’applique immédiatement dans les deux cas. C’est voulu : ainsi, la page
n’apparaît pas brièvement sans mise en forme.

## Aides dans l’éditeur

| Fonction | Description |
| --- | --- |
| Vérification syntaxique | S'effectue au fur et à mesure de la saisie. Une ligne contenant une erreur est surlignée en rouge, le message s'affiche juste en dessous. Dans le panneau **Vérification**, on peut lire, selon le langage, « aucune erreur » ou « 1 erreur à la ligne… » ; **Aller à l'emplacement de l'erreur** permet d'y accéder directement. La vérification **n’empêche pas la validation**. Pour le CSS, seule la structure des parenthèses est vérifiée, et non chaque propriété. |
| Barre d’état | Sous le code : langage, nombre de lignes, erreurs et position du curseur (« ligne 7, colonne 32 »). |
| Mise en forme | Indente automatiquement et proprement le code du langage sélectionné. S’il reste illisible, il reste inchangé et la ligne d’état en indique la raison. |
| Annuler | La flèche en haut de la page annule des étapes d’édition entières ; dans le code lui-même, utilisez ⌘/Ctrl Z de l’éditeur. |
| Aide | Le point d’interrogation en haut (F1) fournit des explications sur les langues, l’heure de démarrage et la vérification. |
