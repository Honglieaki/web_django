#! /bin/bash

PATH_js=/home/django_ljh/acapp/game/static/js/
PATH_js_src=${PATH_js}src/
PATH_js_dist=${PATH_js}dist/

find $PATH_js_src -type f -name '*.js' | sort | xargs cat > ${PATH_js_dist}game.js



