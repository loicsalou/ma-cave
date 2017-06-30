# ma-cave
Gestion de ma cave

# Notes de développement
Le répertoire assets qui contient les images est accessible depuis n'importe quel template, n'importe quel SCSS via le path "../assets".
La raison est que, au build, ionic crée en guis de contexte de serveur un répertoire "www" dans lequel on trouve, au premier niveau, le répertoire build et le répertoire assets.
Dans le répertoire build, tout a été transpilé, minifié et webpackisé dans main.js, main.css. Tous les chemins indiqués à ce niveau doivent donc remonter d'un répertoire et redescendre dans assets.
Conclusion: toutes les images, tous les fichiers contenus dans assets sont inclus via un chemin "../assets".

# Features

| Feature | description | implémentée |
| ------- | ----------- | ----------- |
| liste des bouteilles | lister les bouteilles de la cave | oui |
| recherche | recherche multicritères, par région, couleur, appellation, millésime... | oui |
| recherche | recherche par mot clé | oui |
| importer | importer la cave depuis cavus sous forme CSV | oui |
| importer | importer la cave depuis cavus sous forme XLS | oui |
| statistiques | gérer quelques statistiques | oui |
| statistiques | les montrer graphiquement | oui |
| importer | idéalement automatiser la connexion à cavus et récupérer le flux XLS | non |
| stocker les factures | photographier une facture et l'associer à un lot de bouteilles | non |
| gérer le login | identifier l'utilisateur (FB, tweeter, mail...) | mail, FB, ano |
| authentifier l'utilisateur | gérer l'empreinte digitale | non |
| mise à jour| mise à jour d'un lot de bouteille | partiel |
| détail| lister les photos liées à une bouteille | non |
| retirer une bouteille | mettre à jour le nombre de bouteilles restantes, saisir un court formulaire d'impression sur la bouteille | non |
| ranger les bouteilles | faciliter le travail pour retrouver les bouteilles rangées. Cela mérite beaucoup d'attentions: photographier les casiers ? pointer les emplacements ? d'n'd pour déplacer ? etc. | non |
|recherche|compléter avec options 'bouteilles actuellement en cave' et 'vaforites seulement' | oui |
| chargement | effectuer le chargement en background pour plus de fluidité, par blocs de 50 ? | oui |


# Conception
- pour l'instant je suis contraint pas les données issues de cavus. Le problème est que ce sont des libellés qui sont stockés. Il faudrait extraire les libellés dans des tables / json statiques livrés avec l'appli et changer les données pour utiliser des IDs qui pointent vers ces données.
- cela serait plus propre et éviterait les dysfonctionnements lors des recherches de régions par exemple.
- pour cela il faut modifier l'importation assez profondément. Chaque bouteille importée doit passer dans un importateur qui transforme les libellés en code. Peut être pas si lourd pour finir.

# Améliorations
- recherche par mot clé: demander la validation avant de lancer la recherche car trop rapide actuellement et ne fait pas de sens. FAIT
- Améliorer le modèle: distinguer les bouteilles des lots de bouteilles (au niveau des compteurs cela doit être visible). Gérer les producteurs séparément car communs à tous les utilisateurs 
- faire une synthèse graphique pour visualiser les trop pleins et les manques (en terme de région, couleur, millésimes...)
- login FB mettre infos utilisateur dans une page profil utilisateur avec toutes les infos FB
- ChartJs: remplacer le chart sur les bouteilles par couleur ou ajouter au moins un deuxième par région + accorder les couleurs en fonction des bouteilles 
- gérer les anomalies correctement
- homogénéiser les messages envoyés FAIT
  - erreurs: alert
  - infos: toasts
- upload des images si suffisamment volumineuses: mettre progressBar

# Architecture soft
- partage d'un contexte commun applicatif ? pour contenir diverses choses comme le user, la version etc.

# Modernisation
- Remplacer les Promises par des obeservables (upload des images notamment mais peut-être ailleurs aussi ?)

#Notes techniques
## Login FB
plutôt compliqué ! une fois suivi le tutorial https://javebratt.com/ionic-2-facebook-login/ il faut impératibvement
- autoriser une plateforme native (android / iOS par ex) dans le compte facebook developper
- pour cela il faut pouvoir fournir les infos techniques réclamées par FB comme le "hashage clé". Je n'ai pas compris la procédure indiquée ici: https://forum.ionicframework.com/t/facebook-plugin-not-installed-error/88285 mais en essayant l'app sur Android j'ai obtenu un message d'erreur FB lors du login m'indiquant que le hash "5a+U3FWyFV0pQSZ6FeoA3nHxGZ0=" n'est pas autorisé. Je suis donc retourné sur le compte développeur FB dans l'app, Paramètres / Général, partie plateforme android, pour ajouter ce hash dans les "Cachages clés"

==> ça a marché...
