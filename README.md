API - PROJECT CORE WEBAPP 

Author: Petrica Nanca <petrica_nanca@yahoo.com>

Step 1: Clone the repo locally

$git clone https://github.com/petrican/CAPI

Step 2: Create a config file from the sample given

$cd CAPI

$cat config.js.sample > config.js


Step 3: Edit the config to match your mongoDB connection

Step 4: Start the server

$ npm start


you can use 'nodemon' during the developing. So stop the current running process (CTRL+C) then install nodemon. To do this you will need to install it globally by running the

$npm install -g nodemon

Then start the serv using

$nodemon

At this step the endpoints should be available at http://localhost:3000/
To test this access http://localhost:3000/api in your browser.

You should have this JSON repose:
{"message":"Welcome to Core APIs for your APP!","server":"Your Server"}


Happy coding!









