# Étape par étape

## Définir son propre CSS

1. Placez le widget **Code personnalisé** sur la page — son emplacement n’a
   aucune importance, car il est invisible. Recommandation : tout en bas, afin qu’il ne
   gêne pas lors de la modification.
2. Ouvrez les paramètres du widget. L'éditeur de code s'affiche ; s'il est
   fermé, le bouton **Modifier le code** le fait réapparaître.
3. Sélectionnez l'onglet **CSS** et saisissez les règles.
4. Vérifiez le message sous l'éditeur : s'il indique « Aucune erreur de syntaxe
   détectée », la structure est correcte.
5. Cliquez sur **Terminé** et enregistrez les paramètres du widget.
6. Vérifiez le résultat dans l’**Aperçu** — le CSS ne s’applique pas dans l’éditeur.

## Ajouter son propre code JavaScript

1. Ouvrez les paramètres du widget et, dans l’éditeur de code, sélectionnez l’onglet **JavaScript**
  .
2. Saisissez le code. Vous disposez de `container` (l’élément du
   widget sur la page) et de `widgetApi` (l’interface de Staffbase).
3. Dans **Exécuter :**, sélectionnez le moment de démarrage — le paramètre par défaut est « dès le
   rendu » ; pour les scripts qui modifient des éléments existants de la page, choisissez « lorsque la
   page est entièrement chargée ».
4. Vous pouvez cliquer sur **Mettre en forme** ; le code sera automatiquement
   indenté de manière soignée.
5. Vérifiez le message sous l’éditeur, cliquez sur **Terminé** et enregistrez les
   paramètres du widget.
6. Vérifiez le résultat dans l’**Aperçu**. Si rien ne se passe, ouvrez la console du navigateur
   — les erreurs d’exécution y sont consignées.

## N’oubliez pas de nettoyer

Tout ce qui continue de s’exécuter — minuteries, écouteurs d’événements, observateurs — doit être arrêté
dès que le widget disparaît. Sinon, ils continueront de s’exécuter lorsque l’utilisateur naviguera dans
l’application, car la page n’est pas rechargée.

1. Dans le script, enregistrez l’élément en cours d’exécution dans une variable.
2. À la fin, renvoyer une fonction qui le supprime :

   ```js
   const timer = setInterval(() => console.log("tick"), 1000);
   return () => clearInterval(timer);
   ```

Cette fonction est automatiquement appelée lorsque le widget est supprimé.

## En cas de problème

1. Ouvrez l’onglet contenant le code défectueux et lisez le message affiché sous l’
   éditeur — il indique le numéro de ligne.
2. Si cela ne fonctionne pas, copiez le contenu du champ
   puis videz le code, cliquez sur **Terminé** et enregistrez.
3. Vérifiez si la page fonctionne à nouveau normalement, puis
   réinsérez le code petit à petit.
