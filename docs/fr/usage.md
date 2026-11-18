# Étape par étape

## Ajouter son propre CSS

1. Placez le widget **Code personnalisé** sur la page — son emplacement
   n'a pas d'importance, car il est invisible. Recommandation : tout en bas, afin qu'il ne
   gêne pas lors de la modification.
2. Ouvrez les paramètres du widget. L'éditeur de code s'affiche en plein écran ;
   s'il est fermé, le bouton **Modifier le code** le fait réapparaître.
3. Sélectionnez l'onglet **CSS** et saisissez les règles.
4. Vérifiez la barre d’état sous le code : si elle indique « Aucune erreur », la
   structure est correcte.
5. Cliquez sur **Appliquer** en haut à droite et enregistrez les paramètres du widget
  .
6. Vérifiez le résultat dans l’**Aperçu** — le CSS ne s’applique pas dans l’éditeur.

## Ajouter votre propre code JavaScript

1. Ouvrez les paramètres du widget et sélectionnez l’onglet **JavaScript**
   dans l’éditeur de code.
2. Saisissez le code. Vous disposez de `container` (l’élément du
   widget sur la page) et de `widgetApi` (l’interface de Staffbase).
3. Dans le panneau **Code**, à droite sous **Exécuter**, sélectionnez le moment de lancement —
   réglage par défaut « Dès le rendu » ; pour les scripts qui modifient des
   éléments existants de la page, « Une fois la page entièrement chargée ».
4. Vous pouvez cliquer sur **Mettre en forme** ; le code sera automatiquement
   indenté de manière soignée.
5. Dans le panneau, sous **Vérification**, vérifiez que les deux langages ne signalent « aucune erreur »
  , cliquez sur **Appliquer** et enregistrez les paramètres du widget.
6. Vérifiez le résultat dans l’**Aperçu**. Si rien ne se passe, ouvrez la console du navigateur
   — les erreurs d’exécution y sont consignées.

## N’oubliez pas de nettoyer

Tout ce qui continue de s’exécuter — minuteries, écouteurs d’événements, observateurs — doit être arrêté
dès que le widget disparaît. Sinon, ils continueront de s’exécuter lorsque l’on cliquera ailleurs dans
l’application, car la page n’est pas rechargée.

1. Dans le script, enregistrer l’élément en cours d’exécution dans une variable.
2. À la fin, renvoyer une fonction qui le supprime :

   ```js
   const timer = setInterval(() => console.log("tick"), 1000);
   return () => clearInterval(timer);
   ```

Cette fonction est automatiquement appelée lorsque le widget est supprimé.

## En cas de problème

1. Dans le panneau **Code**, cliquez sur **Aller à l’erreur** — l’éditeur bascule vers
   l’onglet contenant l’erreur et se positionne sur la ligne concernée ; le message apparaît juste
   en dessous. Un chiffre rouge sur l’onglet indique le langage concerné.
2. Si cela ne suffit pas, copiez le code dans le presse-papiers, puis videz-le,
   avant de cliquer sur **Appliquer** et d'enregistrer.
3. Vérifiez si la page fonctionne à nouveau normalement, puis réinsérez le code
   petit à petit.
