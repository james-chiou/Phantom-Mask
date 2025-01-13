# API Documentation

## 1. List all pharmacies open at a specific time and on a day of the week if requested.

**URL** `/pharmacies/open`

**Method**: `GET`

**Parameters**:
- `day` (query parameter): The opening day of the pharmacy.  (required)
- `time` (query parameter): The opening hours of the pharmacy. (required)
  
**Example Request**:
GET /pharmacies/open?day=Mon&time=10:00

**Response**:
```json
[
  {
    "id": 1,
    "name": "DFW Wellness",
    "cash_balance": 328.41,
    "opening_hours": "Mon, Wed, Fri 08:00 - 12:00 / Tue, Thur 14:00 - 18:00"
  }
]
```
**Error Response**:
400 - Bad Request: If the input data is invalid.
```json
{
  "error": "Invalid day input"
}
```
## 2. List all masks sold by a given pharmacy by pharmacy name, sorted by mask name or price

**URL**: `/pharmacies/{name}/masks`

**Method**: `GET`

**Parameters**:
- `name` (path parameter): The name of the pharmacy. (required)
- `sortBy` (query parameter): Sort by `name` or `price`. (optional)

**Example Request**:
GET /pharmacies/Keystone Pharmacy/masks?sortBy=name

**Response**:
```json
[
  {
    "id": 1,
    "name": "True Barrier (green) (3 per pack)",
    "price": 12.35
  }
]
```
**Error Response**:
404 - Not Found: If the pharmacy is not found.
```json
{
  "error": "Pharmacy not found"
}
```
## 3. List all pharmacies with more or less than x mask products within a price range.

**URL**: `/pharmacies/filter`

**Method**: `GET`

**Parameters**:
- `minPriceVal` (query parameter): The lower bound of the price. (required)
- `maxPriceVal` (query parameter): The upper bound of the price. (required)
- `minMasksVal` (query parameter): The lower bound of the mask. (required)
- `maxMasksVal` (query parameter): The upper bound of the mask. (required)

**Example Request**:
GET /pharmacies//filter?minPriceVal=10&maxPriceVal=100&minMasksVal=5&maxMasksVal=50

**Response**:
```json
[
  {
    "name": "True Barrier (green) (3 per pack)",
    "maskCount": 9
  }
]
```
**Error Response**:
404 - Not Found: If the range of the price or mask is not found.
```json
{
  "error": "No results were found to match the criteria."
}
```
## 4. The top x users by total transaction amount of masks within a date range.

**URL**: `/users/top`

**Method**: `GET`

**Parameters**:
- `startDate` (query parameter): The day range. (required)
- `endDate` (query parameter): The day range. (required)
- `limit` (query parameter): Top x users. (required)

**Example Request**:
GET /users/top?startDate=2021-01-01&endDate=2021-01-29&limit=3

**Response**:
```json
[
  {
    "name": "Timothy Schultz",
    "totalAmount": 178.28
  }
 {
    "name": "Lester Arnold",
    "totalAmount": 158.2
  }
 {
    "name": "Wilbert Love",
    "totalAmount": 135.16
  }
]
```
**Error Response**:
404 - Not Found: If the range of the date is not found.
```json
{
  "error": "No results were found to match the criteria."
}
```
## 5. The total amount of masks and dollar value of transactions within a date range.

**URL**: `/transactions`

**Method**: `GET`

**Parameters**:
- `startDate` (query parameter): The day range. (required)
- `endDate` (query parameter): The day range. (required)

**Example Request**:
GET /transactions?startDate=2021-01-01&endDate=2021-01-29

**Response**:
```json
[
  {
    "pharmacy_name": "Keystone Pharmacy",
    "mask_name": "True Barrier (green) (3 per pack)",
    "totalMasks": 95,
    "totalValue": 1738.09
  }
]
```
**Error Response**:
404 - Not Found: If the range of the date is not found.
```json
{
  "error": "No results were found to match the criteria."
}
```

## 6. Search for pharmacies or masks by name, ranked by relevance to the search term.

**URL**: `/search`

**Method**: `GET`

**Parameters**:
- `name` (query parameter): The name of pharmacies or masks. (required)

**Example Request (The query satisfies the pharmacy name)**:
GET /search?name=PharmaMed 

**Response**:
```json
pharmacies:
[
  {
    "name": "PharmaMed",
    "opening_hours": Mon - Wed 08:00 - 17:00 / Thur, Sat 20:00 - 02:00,
  }
],
masks: []
```
**Example Request (The query satisfies the mask name)**:
GET /search?name=Barrier 

**Response**:
```json
"pharmacies": [],
"masks":
[
  {
    "mask": "True Barrier (black) (3 per pack)",
    "pharmacy": "HealthMart",
    "opening_hours": "Mon, Wed, Fri 08:00 - 12:00 / Tue, Thur 14:00 - 18:00",
    "price": 3.38
  }
]
```

**Error Response**:
404 - Not Found: If the query is not found.
```json
{
  "error": "No results were found to match the input."
}
```
## 7. Process a user purchases a mask from a pharmacy, and handle all relevant data changes in an atomic transaction.

**URL**: `/users/purchase`

**Method**: `POST`

**Request Body**:
- `userId`: The user's ID, to identify the user making the purchase. (required)
- `pharmacyId`: The pharmacy ID is used to identify which pharmacy conducted the transaction. (required)
- `maskId`: The ID of the mask is used to identify which mask was purchased. (required)
- `quantity`: The number of masks purchased. (required)

**Example Request**:
POST /users/purchase
```json
{
  "userId": 1,
  "pharmacyId": 1,
  "maskId": 1,
  "quantity": 3
}
```

**Response**:
```json
{
  "message": "Purchase successful",
  "totalCost": 41.099999999999994
}
```

**Error Response**:
404 - Not Found: If the user is not found.
```json
{
  "error": "User not found"
}

404 - Not Found: If the pharmacy is not found.
```json
{
  "error": "Mask not found in this pharmacy"
}
```
400 - Bad Request: If the user's cash balance is insufficient.
```json
{
  "error": "Insufficient balance"
}
```
