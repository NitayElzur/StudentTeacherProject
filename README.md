In order to run locally:
Make sure to run npm install for both the /front and /back folders
As well as paste the env file (sent in the email) to it's respective folder  
After finishing the steps above run:  
npm run dev for the front  
node ./server.js for the back  
  
Side Note:
In production mode a 'role' (i.e. student or teacher) will persist after a refresh of the page and even on another tab,
this is because for actual usage of the web app the student and teacher will be on different computers.
However, for testing purposes said feature is disabled in development as it causes interference.
