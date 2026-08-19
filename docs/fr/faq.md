# FAQ

**Question :** Mon code s'exécute-t-il également dans l'éditeur du CMS pendant que je le modifie ?

Réponse : Non. L'exécution n'a lieu que sur la page publiée et dans l'
aperçu. Dans l'éditeur, vous voyez à la place une carte affichant les premières lignes
de votre code. Ainsi, un script défectueux ne peut pas perturber l'interface
dans laquelle vous êtes en train de le corriger.

**Question :** Je ne vois que « Aucun code saisi pour l'instant. Modifier via les
paramètres du widget. » dans l'éditeur.

Réponse : Le widget est en place, mais vide. Ouvrez les paramètres du widget et
saisissez le code dans l’éditeur de code.

**Question :** Mon script doit agir sur un élément qui n’existe pas encore.

Réponse : Dans l’onglet JavaScript, sous **Exécuter :**, sélectionnez « lorsque la page est entièrement
chargée ». Le script attendra alors que le contenu de la page soit
complètement affiché.

**Question :** Mon CSS ou mon JavaScript ne fonctionne pas.

Réponse : Vérifiez les points suivants dans l’ordre : avez-vous effectué le test dans l’**Aperçu** et non
dans l’éditeur ? Y a-t-il un message d’erreur sous l’éditeur ? Après avoir cliqué sur **Terminé**,
avez-vous également enregistré les paramètres du widget ? Pour le JavaScript, ouvrez également la
console du navigateur de la page publiée — vous y trouverez des messages tels que
« Le JavaScript contient une erreur de syntaxe et n’a pas été exécuté » ou « Le
JavaScript a échoué lors de son exécution ».

**Question :** Une erreur de syntaxe s'affiche — puis-je quand même enregistrer ?

Réponse : Oui, la vérification ne bloque rien. Il s’agit d’une remarque, pas d’un blocage.
Le code JavaScript erroné ne sera toutefois pas exécuté sur la page.

**Question :** Mon CSS modifie également d’autres zones de la page.

Réponse : C’est normal — le CSS s’applique globalement. Si vous ne souhaitez cibler qu’une seule zone,
vous devez définir un sélecteur suffisamment précis.

**Question :** Puis-je placer plusieurs widgets de code personnalisé sur une même page ?

Réponse : Oui. Chacun dispose de son propre CSS, qui disparaît lorsque ce
widget est supprimé, sans perturber les autres. Il ne faut toutefois pas se fier à l’
ordre d’exécution des scripts —
il vaut mieux regrouper les dépendances dans un seul widget.

**Question :** Pourquoi mon script ne s’exécute-t-il pas à nouveau après l’enregistrement ?

Réponse : Le script n’est pas réexécuté si le code n’a pas été modifié. Seule une
modification effective du code relance le script.

**Question :** Mon minuteur continue de fonctionner alors que j’ai quitté la page.

Réponse : Lorsque l’on navigue au sein de l’application, la page n’est pas rechargée.
C’est pourquoi il faut renvoyer une fonction de nettoyage dans le script (voir « Étape
par étape ») qui arrête les minuteries et les écouteurs.

**Question :** Qui est autorisé à utiliser ce widget ?

Réponse : Toute personne autorisée à modifier la page — et elle peut ainsi
modifier la page à sa guise. C’est voulu, car le déclencheur habituel est justement
un élément qui n’appartient pas au widget lui-même. C’est exclusivement Staffbase qui
détermine qui dispose de cette autorisation.
