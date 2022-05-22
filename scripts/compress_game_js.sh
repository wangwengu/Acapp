#! /bin/bash

ROOT_PATH=/home/django/Acapp # 定义项目根目录
JS_PATH=/home/django/Acapp/Game/static/js # js路径
JS_PATH_DIST=${JS_PATH}/dist # 压缩文件夹
JS_PATH_SRC=${JS_PATH}/src # 源文件夹
find $JS_PATH_SRC -type f -name '*.js' | sort | xargs cat > ${JS_PATH_DIST}/game.js # 压缩文件

# 先执行python3 manage.py collectstatic命令
# 再输入yes
echo yes | python3 manage.py collectstatic
# 启动uwsgi
uwsgi --ini ${ROOT_PATH}/scripts/uwsgi.ini
