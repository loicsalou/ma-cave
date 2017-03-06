# ma-cave
consultation de ma cave

# Notes de développement
Le répertoire assets qui contient les images est accessible depuis n'importe quel template, n'importe quel SCSS via le path "../assets".
La raison est que, au build, ionic crée en guis de contexte de serveur un répertoire "www" dans lequel on trouve, au premier niveau, le répertoire build et le répertoire assets.
Dans ke répertoire build, tout a été transpilé, minifié et webpackisé dans main.js, main.css. Tousles chemins indiqués é ce niveau doivent donc remonter d'un répertoire et redescendre dans assets.
Conclusion: toutes les images, tous les fichiers contenus dans assets sont inclus via un chamin "../assets".
