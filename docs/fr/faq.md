# FAQ

**Question :** Mon code s'exécute-t-il également dans l'éditeur du CMS pendant que je le modifie ?

Réponse : Non. Le code n'est exécuté que sur la page publiée et dans l'
aperçu. Dans la vue d'édition, on voit à la place une carte contenant les
premières lignes du code enregistré — sinon, un script erroné
dérangerait l'interface dans laquelle on souhaite justement le corriger.

**Question :** Qui est autorisé à ajouter ce widget à une page ?

Réponse : Toute personne disposant des droits Staffbase nécessaires pour modifier la page peut
modifier celle-ci à sa guise via ce widget — c’est voulu, car le
cas de figure le plus courant concerne justement un élément qui n’appartient pas au widget lui-même.
C’est Staffbase qui gère exclusivement cette autorisation, et non le widget.

**Question :** Mon script doit modifier un élément qui n’existe pas encore
— que faire ?

Réponse : Dans l'onglet JavaScript, réglez le moment de démarrage sur « Lorsque la page est entièrement
chargée ». Ainsi, le script attend que le contenu de la page soit
stabilisé, au lieu de s'exécuter immédiatement lors du rendu du widget.

**Question :** Mon CSS ou mon JavaScript disparaît soudainement ?

Réponse : Une erreur de syntaxe n’empêche pas l’enregistrement, mais elle s’affiche en
texte clair sous l’éditeur — vérifiez le message avant de fermer la boîte de dialogue.
En cas d’erreurs JavaScript lors de l’exécution, il est également utile de consulter la
console du navigateur de la page publiée.
