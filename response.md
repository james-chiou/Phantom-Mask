## A. Required Information
### A.1. Requirement Completion Rate
- [x] List all pharmacies open at a specific time and on a day of the week if requested.
  - Implemented at "/pharmacies/open" API.
- [x] List all masks sold by a given pharmacy, sorted by mask name or price.
  - Implemented at "/pharmacies/:name/masks" API.
- [x] List all pharmacies with more or less than x mask products within a price range.
  - Implemented at "/pharmacies/filter" API.
- [x] The top x users by total transaction amount of masks within a date range.
  - Implemented at "/users/top" API.
- [x] The total number of masks and dollar value of transactions within a date range.
  - Implemented at "/transactions" API.
- [x] Search for pharmacies or masks by name, ranked by relevance to the search term.
  - Implemented at "/search" API.
- [x] Process a user purchases a mask from a pharmacy and handles all relevant data changes in an atomic transaction.
  - Implemented at "/users/purchase" API.
### A.2. API Document
  Following the [API_Document.md](API_Documentation.md) and use the Postman to test the APIs.
### A.3. Import Data Commands
1. Please ensure the pharmacies.json and users.json files are in the database.  
2. You can execute the program by running the
```JavaScript
node index.js
```
or you can run the
```JavaScript
npm install nodemon -g
nodemon index.js
```
If you succeed you can see the following message. Then you can follow the [A.2. API Document](https://github.com/james-chiou/Phantom-Mask/blob/master/response.md#a2-api-document) to test the APIs.
```bash
Database setup complete.
Server is running on http://localhost:3000
```

