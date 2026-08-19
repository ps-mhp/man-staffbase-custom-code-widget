# Code personnalisé

Le widget « Code personnalisé » est l'outil idéal pour tout ce que les fonctionnalités natives du CMS
ne permettent pas de faire : une mise en forme spécifique, le masquage ciblé d'un
élément, une petite interaction.

**Il n'affiche rien en soi.** Sur la page publiée, il est
invisible et ne prend pas de place. Il ne contient que le code que vous
définissez dans la boîte de dialogue de configuration :

- **CSS** modifie l'apparence de la page. Il s'applique à **toute la page**,
  et pas seulement à la zone du widget.
- **JavaScript** modifie le comportement de la page et peut la
  remodeler à volonté.

## Avant de commencer

Ce widget nécessite des connaissances en programmation. Il n’y a aucun contrôle
empêchant qu’une erreur rende la page inutilisable — le widget intercepte
certes les erreurs, mais un code « incorrect, mais valide » fonctionnera quand même. Si vous souhaitez simplement
intégrer une image, un tableau ou un article, les autres
widgets sont plus adaptés.

Règle d’or : vérifiez d’abord si le résultat souhaité peut être obtenu avec un
widget standard. Le code personnalisé est le dernier recours, pas la première solution.

## Où le code s’exécute-t-il ?

| Emplacement | JavaScript | CSS |
| --- | --- | --- |
| Page publiée | s'exécute | s'applique |
| Aperçu | s'exécute | s'applique |
| Éditeur CMS (mode édition) | ne s'exécute **pas** | ne s'applique **pas** |

Dans l’éditeur, à la place du widget, vous ne verrez qu’une carte contenant les premières lignes
du code enregistré. C’est voulu : sinon, un script défectueux risquerait de
perturber précisément l’interface que vous êtes en train de corriger. Pour
les tests, utilisez donc toujours l’**aperçu**.

Pour la même raison, **aucun exemple en direct** n’est présenté
sur cette page de documentation — sinon, le code s’exécuterait sur la documentation plutôt que sur votre page.
