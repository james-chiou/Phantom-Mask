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
