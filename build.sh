#!/usr/bin/env bash

APP_NAME=recipe

if [[ $(/usr/bin/id -u) -ne 0 ]]; then
    echo "Not running as root"
    exit
fi

sudo meteor --allow-superuser build --server-only /home/$APP_NAME/.
cd /home/$APP_NAME/
sudo rm -rf bundle/
sudo tar -xzf $APP_NAME.tar.gz
sudo rm -f $APP_NAME.tar.gz
cd bundle/programs/server/
sudo npm install --production
sudo chown $APP_NAME:leniglo -R /home/$APP_NAME
sudo find /home/$APP_NAME -type d -exec chmod 775 {} \;
sudo find /home/$APP_NAME ! -name '*.sh' -type f -exec chmod 664 {} \;
sudo pm2 restart /home/leniglo/ecosystem.config.js --only $APP_NAME
sudo pm2 show $APP_NAME
