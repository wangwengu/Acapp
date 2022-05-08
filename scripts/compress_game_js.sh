#! /bin/bash

JS_PATH=/home/django/Acapp/Game/static/js # js路径
JS_PATH_DIST=${JS_PATH}/dist # 压缩文件夹
JS_PATH_SRC=${JS_PATH}/src # 源文件夹
find $JS_PATH_SRC -type f -name '*.js' | sort | xargs cat > ${JS_PATH_DIST}/game.js # 压缩文件
