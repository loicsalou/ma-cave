# ATTENTION BIEN RETESTER L'APPLI APRES CE SCRIPT IL EST POSSIBLE QUE DES CLASSES UTILISEES DISPARAISSENT !!!!!!!!!
#!/bin/bash
PATH=$PATH:$(npm bin)
set -x

BUILDFOLDER=www/

# clean up previous build
#rm -fr $BUILDFOLDER

# Prod build
#npm run build:prod

# remove unused css
purifycss $BUILDFOLDER"build/main.a731bd3c3e.css" \
          $BUILDFOLDER"build/*.js" \
          --info \
          --min \
          --out $BUILDFOLDER"build/main2.a731bd3c3e.css" \
          --whitelist .bar-button-default

#!/usr/bin/env bash
