git pull
sudo meteor update
sudo meteor build .
sudo mv recipe_manager.tar.gz /opt/recipe_manager/.
cd /opt/recipe_manager/
sudo rm -rf bundle/
sudo tar -xvzf recipe_manager.tar.gz
sudo rm -f recipe_manager.tar.gz
cd bundle/programs/server/
sudo npm install
cd /opt/recipe_manager
sudo chown recipe-manager -R /opt/recipe_manager
sudo service recipe-manager restart
