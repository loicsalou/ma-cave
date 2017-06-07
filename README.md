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
| recherche | recherche multicritèees, par région, couleur, appellation, millésime... | oui |
| recherche | recherche par mot clé | oui |
| importer | importer la cave depuis cavus sous forme CSV | oui |
| importer | importer la cave depuis cavus sous forme XLS | oui |
| statistiques | gérer quelques statistiques | oui |
| statistiques | les montrer graphiquement | non |
| importer | idéalement automatiser la connexion à cavus et récupérer le flux XLS | non |
| stocker les factures | photographier une facture et l'associer à un lot de bouteilles | non |
| gérer le login | identifier l'utilisateur (FB, tweeter, mail...) | non |
| authentifier l'utilisateur | gérer l'empreinte digitale | non |
| mise à jour| mise à jour d'un lot de bouteille | non |
| retirer une bouteille | mettre à jour le nombre de bouteilles restantes, saisir un court formulaire d'impression sur la bouteille | non |
| ranger les bouteilles | faciliter le travail pour retrouver les bouteilles rangées. Cela mérite beaucoup d'attentions: photographier les casiers ? pointer les emplacements ? d'n'd pour déplacer ? etc. | non |
|recherche|compléter avec options 'bouteilles actuellement en cave' et 'vaforites seulement' | non |
| chargement | effectuer le chargement en background pour plus de fluidité, par blocs de 50 ? | non |



# Améliorations
- recherche par mot clé: demander la validation avant de lancer la recherche car trop rapide actuellement et ne fait pas de sens.
- Améliorer le modèle: distinguer les bouteilles des lots de bouteilles (au niveau des compteurs cela doit être visible). Gérer les producteurs séparément car communs à tous les utilisateurs 
- faire une synthèse graphique pour visualiser les trop pleins et les manques (en terme de région, couleur, millésimes...)
