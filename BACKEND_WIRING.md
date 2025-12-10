# Backend API Wiring Documentation

This document tracks the status of backend API endpoints used by the HeatSeaker Admin Dashboard.

## Base URL
- **Default**: `http://localhost:8080`
- **Configuration**: Set in `Components/api/apiClient.tsx` (can be overridden via environment variable)

## Authentication Endpoints

### ✅ POST `/api/auth/login`
- **Status**: Wired (client-side implementation complete)
- **Purpose**: User authentication
- **Request Body**: 
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Response**: 
  ```json
  {
    "success": true,
    "token": "jwt_token_string",
    "user": { ... }
  }
  ```
- **Backend Required**: Yes - needs to implement JWT token generation and user validation

## Health Check Endpoints

### ⚠️ GET `/health`
- **Status**: Wired (client-side), Backend implementation needed
- **Purpose**: Application health check
- **Expected Response**:
  ```json
  {
    "status": "UP" | "DOWN",
    "message": "string",
    "timestamp": "ISO8601",
    "version": "string"
  }
  ```
- **Backend Required**: Yes

### ⚠️ GET `/health/db`
- **Status**: Wired (client-side), Backend implementation needed
- **Purpose**: Database health check
- **Expected Response**:
  ```json
  {
    "status": "UP" | "DOWN",
    "message": "string",
    "timestamp": "ISO8601",
    "connected": true
  }
  ```
- **Backend Required**: Yes

## Race Management Endpoints

### ⚠️ GET `/api/races`
- **Status**: Wired (client-side), Backend implementation needed
- **Purpose**: Get list of races with optional filters
- **Query Parameters**:
  - `startDate` (optional): ISO date string
  - `endDate` (optional): ISO date string
  - `trackId` (optional): Track identifier
- **Expected Response**:
  ```json
  {
    "races": [
      {
        "id": "string",
        "date": "ISO8601",
        "trackCode": "string",
        "trackName": "string",
        "raceNumber": "number",
        "status": "completed" | "pending" | "cancelled"
      }
    ]
  }
  ```
- **Backend Required**: Yes

### ⚠️ GET `/api/races/:id`
- **Status**: Wired (client-side), Backend implementation needed
- **Purpose**: Get detailed race information
- **Expected Response**:
  ```json
  {
    "id": "string",
    "date": "ISO8601",
    "trackCode": "string",
    "trackName": "string",
    "raceNumber": "number",
    "status": "string",
    "entries": [
      {
        "number": "number",
        "name": "string",
        "odds": "string",
        "jockey": "string",
        "trainer": "string"
      }
    ]
  }
  ```
- **Backend Required**: Yes

### ⚠️ GET `/api/races/:id/winner`
- **Status**: Wired (client-side), Backend implementation needed
- **Purpose**: Get winner information for a race
- **Expected Response**:
  ```json
  {
    "horseNumber": "number",
    "horseName": "string",
    "payout": "number",
    "time": "string"
  }
  ```
- **Backend Required**: Yes

### ⚠️ GET `/api/races/tracks`
- **Status**: Wired (client-side), Backend implementation needed
- **Purpose**: Get list of available tracks
- **Expected Response**:
  ```json
  [
    {
      "id": "string",
      "code": "string",
      "name": "string"
    }
  ]
  ```
- **Backend Required**: Yes

### ⚠️ GET `/api/races/winners`
- **Status**: Wired (client-side), Backend implementation needed
- **Purpose**: Get winners within a date range
- **Query Parameters**:
  - `startDate` (optional): ISO date string
  - `endDate` (optional): ISO date string
- **Backend Required**: Yes

### ⚠️ GET `/api/races/winners/track/:trackId`
- **Status**: Wired (client-side), Backend implementation needed
- **Purpose**: Get winners for a specific track
- **Backend Required**: Yes

### ⚠️ GET `/api/races/entries/daily`
- **Status**: Wired (client-side), Backend implementation needed
- **Purpose**: Get daily race entries
- **Query Parameters**:
  - `date` (required): ISO date string
  - `trackCode` (required): Track code
- **Backend Required**: Yes

### ⚠️ POST `/api/races/daily`
- **Status**: Wired (client-side), Backend implementation needed
- **Purpose**: Submit daily race data
- **Request Body**: JSON payload (structure depends on backend requirements)
- **Backend Required**: Yes

## Betting Endpoints

### ⚠️ POST `/api/submit-bets`
- **Status**: Wired (client-side), Backend implementation needed
- **Purpose**: Submit betting information
- **Request Body**:
  ```json
  {
    "betType": "WIN" | "PLACE" | "SHOW" | "EXACTA",
    "trackCode": "string",
    "raceNumber": "number",
    "amount": "number",
    "horseNumber": "number", // for WIN/PLACE/SHOW
    "combination": ["number"], // for EXACTA
    "comboType": "BOX" | "STRAIGHT" | "WHEEL" // for EXACTA
  }
  ```
- **Backend Required**: Yes

## Logging Endpoints

### ⚠️ GET `/api/logs`
- **Status**: Wired (client-side), Backend implementation needed
- **Purpose**: Get system logs
- **Query Parameters**:
  - `level` (optional): "info" | "warn" | "error"
  - `search` (optional): Search term
  - `limit` (optional): Number of results (default: 100)
- **Expected Response**:
  ```json
  {
    "logs": [
      {
        "id": "number",
        "level": "string",
        "message": "string",
        "timestamp": "ISO8601",
        "context": {}
      }
    ]
  }
  ```
- **Backend Required**: Yes

## Statistics Endpoints

### ⚠️ GET `/api/stats`
- **Status**: Not yet wired (commented out in code)
- **Purpose**: Get system statistics
- **Expected Response**: TBD
- **Backend Required**: Yes - needs to be implemented

## Documentation Endpoints

### ⚠️ GET `/swagger.json`
- **Status**: Wired (client-side), Backend implementation needed
- **Purpose**: Get Swagger/OpenAPI documentation
- **Backend Required**: Yes

### ⚠️ GET `/api/schemas`
- **Status**: Wired (client-side), Backend implementation needed
- **Purpose**: Get database schemas
- **Backend Required**: Yes

### ⚠️ GET `/api/docs/readme`
- **Status**: Wired (client-side), Backend implementation needed
- **Purpose**: Get README documentation
- **Backend Required**: Yes

## Summary

### Successfully Wired (Client-Side Complete)
All endpoints listed above have client-side implementations. The frontend is ready to consume these APIs once the backend is implemented.

### Backend Implementation Required
**All endpoints require backend implementation.** The frontend includes:
- Error handling for failed requests
- Loading states
- Fallback UI for missing data
- Request/response logging (in ApiTest page)

### Next Steps for Backend Team
1. Implement authentication endpoint (`/api/auth/login`)
2. Implement health check endpoints
3. Implement race management endpoints
4. Implement betting submission endpoint
5. Implement logging endpoint
6. Implement statistics endpoint
7. Implement documentation endpoints

### Testing
Use the **API Test Console** page (`/ApiTest`) in the dashboard to test endpoints once the backend is available.
