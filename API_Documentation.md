# API Documentation

## 1. List all pharmacies open at a specific time and on a day of the week if requested.

**URL** `/pharmacies/open`

**Method**: `GET`

**Parameters**:
- `day` (query parameter): The opening day of the pharmacy.
- `time` (query parameter): The opening hours of the pharmacy.
  
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
- `name` (path parameter): The name of the pharmacy (required).
- `sortBy` (query parameter): Sort by `name` or `price` (optional).

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
- `minPriceVal` (query parameter): The lower bound of the price (required).
- `maxPriceVal` (query parameter): The upper bound of the price (required).
- `minMasksVal` (query parameter): The lower bound of the mask (required).
- `maxMasksVal` (query parameter): The upper bound of the mask (required).

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
404 - Not Found: If the pharmacy is not found.
```json
{
  "error": "No results were found to match the criteria."
}
```
## 4. The top x users by total transaction amount of masks within a date range.

**URL**: `/users/top`

**Method**: `GET`

**Parameters**:
- `startDate` (query parameter): The day range (required).
- `endDate` (query parameter): The day range (required).
- `limit` (query parameter): Top x users (required).

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
404 - Not Found: If the pharmacy is not found.
```json
{
  "error": "No results were found to match the criteria."
}
```
## 5. The total amount of masks and dollar value of transactions within a date range.

**URL**: `/transactions`

**Method**: `GET`

**Parameters**:
- `startDate` (query parameter): The day range (required).
- `endDate` (query parameter): The day range (required).

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
404 - Not Found: If the pharmacy is not found.
```json
{
  "error": "No results were found to match the criteria."
}
```
