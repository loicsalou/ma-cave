# ma-cave
Gestion d'une cave à vins.
consultation, mise à jour, rangement, création de casiers etc.

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
| retirer une bouteille | mettre à jour le nombre de bouteilles restantes, saisir un court formulaire d'impression sur la bouteille | oui |
| ranger les bouteilles | faciliter le travail pour retrouver les bouteilles rangées. pointer les emplacements, d'n'd pour déplacer ? etc. | oui |
|recherche|compléter avec options 'bouteilles actuellement en cave' et 'vaforites seulement' | oui |
| chargement | effectuer le chargement en background pour plus de fluidité, par blocs de 50 ? | non |


# Conception
- pour l'instant je suis contraint pas les données issues de cavus. Le problème est que ce sont des libellés qui sont stockés. Il faudrait extraire les libellés dans des tables / json statiques livrés avec l'appli et changer les données pour utiliser des IDs qui pointent vers ces données.
- cela serait plus propre et éviterait les dysfonctionnements lors des recherches de régions par exemple.
- pour cela il faut modifier l'importation assez profondément. Chaque bouteille importée doit passer dans un importateur qui transforme les libellés en code. Peut être pas si lourd pour finir.


# Notes techniques
## Ionic
L'application repose sur le framework Ionic 3.20.x à fin mai 2018.

## Angular
Ionic repose sur Angular 5.2.10 à fin mai 2018.
Le routeur d'Angular n'est pour l'instant pas utilisable dans Ionic, Ionic fournit le sien, plus simple mais plus 
limité (notamment en terme de gardes, resolvers et children pages)

## Firebase
Firebase est une DB NoSql hébergée par Google. Gratuite pour les petits volumes, elle est très intéressante car elle 
permet le databinding direct entre le GUI et la DB. Aucun backend n'est nécessaire.
Elle s'appuie énormément sur les Promises et donc les observables.

## RXJS
Angular est bâti sur RXJS. Je me suis très fortement appuyé sur RXJS afin d'améliorer au mieux les performances de 
l'application Angular sous-jacente (ChangeDetectionStrategy.OnPush) et également pour respecter la philosophie "réactive" d'Angular

## NGRX
L'application était devenue trop complexe et difficilement maintenable. Les données étaient manipulées dans toutes les 
pages, tous les composants, les observables émettaient depuis n'importe où (services, composants, pages...) et cela 
parfois partait en boucle. La liste des bouteilles, des casiers, dégustations etc. était stockée en plusieurs endroits 
de l'application: DB, services, pages, et partiellement composants. Les filtres étaient créés dans le browse et modifiés
 partout.
 
 Il fallait mettre en place une vraie gestion d'état. Pour cela j'ai donc choisi d'utiliser NGRX. 
 Il reste des défauts dans son utilisation: les bouteilles et casiers sont modifiables dans certianes pages. Il y a donc
  création d'objets Bottle et Locker en plusieurs endroits (updatePage, cellar page quand on déplace des bouteilles ou 
  qu'on redimensionne un casier qui n'est pas vide.
  Ces pages sont comme des formulaires, qui émettent des actions de modifications.

## Login FB
plutôt compliqué ! une fois suivi le tutorial https://javebratt.com/ionic-2-facebook-login/ il faut impératibvement
- autoriser une plateforme native (android / iOS par ex) dans le compte facebook developper
- pour cela il faut pouvoir fournir les infos techniques réclamées par FB comme le "hashage clé". Je n'ai pas compris la procédure indiquée ici: https://forum.ionicframework.com/t/facebook-plugin-not-installed-error/88285 mais en essayant l'app sur Android j'ai obtenu un message d'erreur FB lors du login m'indiquant que le hash "5a+U3FWyFV0pQSZ6FeoA3nHxGZ0=" n'est pas autorisé. Je suis donc retourné sur le compte développeur FB dans l'app, Paramètres / Général, partie plateforme android, pour ajouter ce hash dans les "Cachages clés"
- mise à jour du 30 septembre 2017: le hashkey exigé par facebook est en fait la version base64 de l'empreinte 
numnérique SHA1 du certificat qui a servi à signer l'APK. Pour convertir l'empreinte aller sur http://tomeko
.net/online_tools/hex_to_base64.php 

## Login Google
- 30-09-2017 : fonctionne bien sur browser mais ERROR 10 lors du login via Cordova, apparemment un problème de signature
 de l'APK
   
==> ça a marché...

cordova plugin add cordova-plugin-facebook4 --save --variable APP_ID="253712085111353" --variable APP_NAME="cellar-explorer"

## Optimisation des performances
J'utilise le plugin Chrome "Lighthouse" de Google pour analyser la home page et dégager les principaux problèmes. Grâce 
à ce plugin j'ai déjà changé:
- modularisation du code: un module par page en lazy load
- mise en place d'un service worker avec toutes la chaine de build (voir copy.config.js, webpacl.config.js et 
workbox-config.js). Voir l'article https://golb.hplar.ch/2017/12/Workbox-in-Ionic-and-Lazy-Loading-Modules.html
- mise en place de modernizr: pour modifier la config aller dans config/modernizr-config.json, ajouter les checks à 
faire (voir la liste des possibilités sur https://github.com/Modernizr/Modernizr/blob/master/lib/config-all.json. 
Après l'ajout dans le json regénérer le src/app/modernizr.js via le CLI "modernizr -c ./config/modernizr-config.json"

## ajouter une font maison
Dans src/app/scss/icons/fonts se trouve une police générée spécialement pour le projet.
Voir le fichier README_FONT.txt

# A REVOIR

il reste des choses à modifier pour améliorer l'application:
- les classes Bottle, Locker etc. devraient être des interfaces: cela simplifierait grandement leur utilisation en 
particulier dans le cadre de NGRX
- les events NGRX sont parfois difficiles à comprendre. Dans pas mal de situations on reçoit de multiples fois la liste 
des bouteilles par exemple (suite à une mise à jour par exemple). Il faut éclaircir ça et faire en sorte de limiter les 
plus d'events susceptibles de redéclencher un render.
