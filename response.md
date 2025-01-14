## A. Required Information
### A.1. Requirement Completion Rate
- [ ] List all pharmacies open at a specific time and on a day of the week if requested.
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
- [x] Process a user purchases a mask from a pharmacy, and handle all relevant data changes in an atomic transaction.
  - Implemented at "/users/purchase" API.
### A.2. API Document

### A.3. Import Data Commands
Please run these two script commands to migrate the data into the database.

```bash
$ rake import_data:pharmacies[PATH_TO_FILE]
$ rake import_data:users[PATH_TO_FILE]
```
