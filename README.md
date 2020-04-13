# node-express-boilerplate

Boilerplate code for Node/Express REST service with simple JWT authentication.

## To run:

- In your terminal navigate to the node-express-boilerplate/server folder and run `npm install`
- Inside the server folder create a .env file. This file must contain a port number, database url (this project has been set up using MongoDB Atlas) and your jwt secret, eg.:

  ```
  PORT={YOUR_PORT_NUMBER}
  DATABASE_URL={YOUR_URL_FOR_MONGODB}
  JWT_SECRET={YOUR_JWT_SECRET}
  ```

- Inside the server folder create `config.js`. This file is for any config objects, for example AWS S3 settings.
