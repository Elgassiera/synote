This document explains how to deploy synote.js on ubuntu
#Pre-installation
1. install latest nginx
```sudo apt-get install nginx```
1. install ffmpeg
1. install mysql
```sudo apt-get install mysql-server```
1. Install compilers need for bcrypt package for sails server
```sudo apt-get install build-essential python2.7```
1. install Node.js
1. making sure the npm npm is the latest one, at least greater than v2.1.0 (sometimes, sudo is necessary)
```npm install -g npm@latest```
1. npm install -g sails (this is for synotejs server)
1. npm install -g grunt (this is for synotejs client)
1. npm install -g bower (this is for synotejs client)
1. npm install -g forever (this is used for starting the sails server)

#For sailsjs server
1. goto /server directory and
```sudo npm install```
1. mysql -u root -p
1. create database synotejs_prod;
1. grant all on synotejs_prod.* to 'synote'@'localhost' identified by 'synote';
1. mysql -u root -p synotejs_prod < server/db/backup-xx.sql (choose the correct backup)
1. exit mysql and use forever to start the server:
```forever start app.js --prod```
1. you can then type:
```forever list```
to check if the server has been started
1. NOTE: the production server port is still 1337 and we are not planning to proxy it through nginx at the moment, because there is only one server running. If we want to cluster, we may need to proxy it through nginx.
1. goto ws.synote.org:1337 to see if the server is running

#For angularjs client
1. jsHint is disabled in Gruntfile.js due to that there are too many warnings
1. the default bower for bootstrap switch has been overridded in the root bower.json as "dist/js/bootstrap-switch.js". We use flat-ui css instead of the bootstrap-switch one.
1. check the ngconstant section of Guntfile.js and change the server url (apiEndpoint) for production as plus.synote.org (remember to change the url everytime you pack it for other websites)
1. check the ngconstant section of Guntfile.js and change the hostURL for production as ws.synote.org (remember to change the url everytime you pack it for other websites)
1. remove the dist folder if exists
1. I have removed the cssmin step in Gruntfile.js
1. run:
```grunt build```
1. I follow this tutorial to create nginx website for the client side:
https://www.digitalocean.com/community/tutorials/how-to-set-up-nginx-virtual-hosts-server-blocks-on-ubuntu-12-04-lts--3
1. on the deployment server, also remove the dist folder under synote.js/client in case the old files are not overwritten:
```rm -R *```
1. remove all content in /var/www/synotejs/public_html:
```sudo rm -R *```
1. copy the generated dist folder to the target deployment directory in nginx
```sudo cp -R ~/synote.js/client/dist/* .```

1. textAngular Error: An Editor with name "synmark_content" already exists <text-angular name="synmark_content" placeholder="Synmark Content..." rows="5" ta-toolbar="[['bold','italics','underline','ul', 'ol']]" ng-model="synmarkContent" class="ng-pristine ng-untouched ng-valid ng-isolate-scope ta-root">