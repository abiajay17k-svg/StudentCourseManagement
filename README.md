# Mini Auction Management System

A simple, beginner-friendly full-stack auction management web application built with **Java Spring Boot**, **SQLite (Spring Data JPA / Hibernate)**, and **React + Vite**.

---

## 📌 Project Overview

The **Mini Auction Management System** allows users to:
1. **Manage Users:** Register new users and view all registered users.
2. **Manage Products:** Add items for auction with a starting base price and browse the auction catalog.
3. **Place & View Bids:** Place bids on products, browse the bidding history for any selected item, and identify the current highest bidder.

---

## 🛠️ Technologies Used

### Backend
- **Java**: Version 21
- **Framework**: Spring Boot 3.3.4
- **ORM / Persistence**: Spring Data JPA / Hibernate 6
- **Database**: SQLite with `sqlite-jdbc` and `hibernate-community-dialects`
- **Validation**: Jakarta Bean Validation (`spring-boot-starter-validation`)
- **Build Tool**: Apache Maven (Maven Wrapper included)

### Frontend
- **Framework**: React 18+
- **Build Tool**: Vite
- **Language**: JavaScript (ES6+)
- **Styling**: Clean, responsive, modern pure CSS (no bloated UI libraries)
- **API Communication**: Native browser `fetch()` API

---

## 🗄️ Database Information

The database is an embedded file-based **SQLite** database (`auction.db`). Spring Data JPA automatically creates and updates the schema on application startup.

### ER Diagram & Relationships

```
  +------------------+             +--------------------+
  |      USERS       | 1         * |        BIDS        |
  +------------------+-------------+--------------------+
  | PK user_id       |             | PK bid_id          |
  |    user_name     |             | FK user_id         |
  |    email         |             | FK product_id      |
  +------------------+             |    bid_amount      |
                                   +--------------------+
                                             * |
                                               | 1
                                   +--------------------+
                                   |      PRODUCTS      |
                                   +--------------------+
                                   | PK product_id      |
                                   |    product_name    |
                                   |    base_price      |
                                   +--------------------+
```

### Relationships Explained
- **One User to Many Bids (`1:M`)**: A user can place multiple bids across different products or on the same product.
- **One Product to Many Bids (`1:M`)**: An auction product can receive multiple bids from various users.
- **Each Bid (`M:1`)**: Every bid references exactly one `user_id` and one `product_id`. The `Bids` entity connects users and products.

### Tables & Columns
1. **`users`**
   - `user_id`: Integer, Primary Key, Auto Increment
   - `user_name`: Varchar, Not Null
   - `email`: Varchar, Not Null, Unique
2. **`products`**
   - `product_id`: Integer, Primary Key, Auto Increment
   - `product_name`: Varchar, Not Null
   - `base_price`: Double, Not Null (must be positive)
3. **`bids`**
   - `bid_id`: Integer, Primary Key, Auto Increment
   - `user_id`: Integer, Foreign Key references `users(user_id)`, Not Null
   - `product_id`: Integer, Foreign Key references `products(product_id)`, Not Null
   - `bid_amount`: Double, Not Null (must be positive and >= product base price)

---

## 🚀 How to Run the Application Locally

### Prerequisites
- **Java 21** installed (`java -version`)
- **Node.js 18+** and **npm** installed (`node -v`, `npm -v`)

---

### Step 1: Run the Backend (Spring Boot)

Open a terminal in the root workspace and run:

#### On Windows (PowerShell or Command Prompt):
```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

#### On Linux / macOS:
```bash
cd backend
chmod +x ./mvnw
./mvnw spring-boot:run
```

The Spring Boot backend will start on **`http://localhost:8080`**.  
The SQLite database file `auction.db` is created automatically inside the `backend/` directory.

---

### Step 2: Run the Frontend (React + Vite)

Open a second terminal window:

```powershell
cd frontend
npm install
npm run dev
```

The frontend development server will launch at:
👉 **`http://localhost:5173`**

Open `http://localhost:5173` in your web browser to interact with the application.

---

## 📡 REST API Endpoint Documentation

Base URL: `http://localhost:8080/api`

### 1. Users Endpoints

#### Create User
- **Method**: `POST`
- **Path**: `/api/users`
- **Request Body**:
  ```json
  {
    "userName": "Alice Johnson",
    "email": "alice@example.com"
  }
  ```
- **Response**: `201 Created`
  ```json
  {
    "userId": 1,
    "userName": "Alice Johnson",
    "email": "alice@example.com"
  }
  ```

#### Get All Users
- **Method**: `GET`
- **Path**: `/api/users`
- **Response**: `200 OK`
  ```json
  [
    {
      "userId": 1,
      "userName": "Alice Johnson",
      "email": "alice@example.com"
    }
  ]
  ```

---

### 2. Products Endpoints

#### Create Product
- **Method**: `POST`
- **Path**: `/api/products`
- **Request Body**:
  ```json
  {
    "productName": "Vintage Watch",
    "basePrice": 150.0
  }
  ```
- **Response**: `201 Created`
  ```json
  {
    "productId": 1,
    "productName": "Vintage Watch",
    "basePrice": 150.0
  }
  ```

#### Get All Products
- **Method**: `GET`
- **Path**: `/api/products`
- **Response**: `200 OK`
  ```json
  [
    {
      "productId": 1,
      "productName": "Vintage Watch",
      "basePrice": 150.0
    }
  ]
  ```

---

### 3. Bids Endpoints

#### Place a Bid
- **Method**: `POST`
- **Path**: `/api/bids`
- **Request Body**:
  ```json
  {
    "userId": 1,
    "productId": 1,
    "bidAmount": 175.0
  }
  ```
- **Response**: `201 Created`
  ```json
  {
    "bidId": 1,
    "user": {
      "userId": 1,
      "userName": "Alice Johnson",
      "email": "alice@example.com"
    },
    "product": {
      "productId": 1,
      "productName": "Vintage Watch",
      "basePrice": 150.0
    },
    "bidAmount": 175.0
  }
  ```

#### Get All Bids for a Product
- **Method**: `GET`
- **Path**: `/api/bids/product/{productId}`
- **Response**: `200 OK` (Bids ordered highest to lowest)
  ```json
  [
    {
      "bidId": 2,
      "user": {
        "userId": 2,
        "userName": "Bob Smith",
        "email": "bob@example.com"
      },
      "product": {
        "productId": 1,
        "productName": "Vintage Watch",
        "basePrice": 150.0
      },
      "bidAmount": 220.0
    },
    {
      "bidId": 1,
      "user": {
        "userId": 1,
        "userName": "Alice Johnson",
        "email": "alice@example.com"
      },
      "product": {
        "productId": 1,
        "productName": "Vintage Watch",
        "basePrice": 150.0
      },
      "bidAmount": 175.0
    }
  ]
  ```

#### Get Highest Bid for a Product
- **Method**: `GET`
- **Path**: `/api/bids/product/{productId}/highest`
- **Response**: `200 OK`
  ```json
  {
    "bidId": 2,
    "user": {
      "userId": 2,
      "userName": "Bob Smith",
      "email": "bob@example.com"
    },
    "product": {
      "productId": 1,
      "productName": "Vintage Watch",
      "basePrice": 150.0
    },
    "bidAmount": 220.0
  }
  ```

---

## 🛡️ Validation & Error Handling

- **Missing / Empty Fields**: Form fields are marked required and rejected with `400 Bad Request` if blank.
- **Positive Amounts**: Base prices and bid amounts must be strictly positive numbers (`> 0`).
- **Base Price Floor**: Bids below the item's starting base price are rejected with `400 Bad Request`.
- **Entity Existence Check**: Placing a bid for a nonexistent `user_id` or `product_id` returns `404 Not Found`.
- **Duplicate Email Prevention**: User emails must be unique; duplicate registrations return `400 Bad Request`.
- **CORS Configured**: Spring Boot allows cross-origin requests from the React dev server (`http://localhost:5173`).

---

## 📁 Directory Structure

```
StudentCourseManagement/
├── backend/
│   ├── .mvn/wrapper/
│   ├── mvnw
│   ├── mvnw.cmd
│   ├── pom.xml
│   └── src/
│       ├── main/
│       │   ├── java/com/auction/
│       │   │   ├── config/
│       │   │   │   └── CorsConfig.java
│       │   │   ├── controller/
│       │   │   │   ├── BidController.java
│       │   │   │   ├── ProductController.java
│       │   │   │   └── UserController.java
│       │   │   ├── dto/
│       │   │   │   └── BidRequest.java
│       │   │   ├── entity/
│       │   │   │   ├── Bid.java
│       │   │   │   ├── Product.java
│       │   │   │   └── User.java
│       │   │   ├── exception/
│       │   │   │   ├── BadRequestException.java
│       │   │   │   ├── GlobalExceptionHandler.java
│       │   │   │   └── ResourceNotFoundException.java
│       │   │   ├── repository/
│       │   │   │   ├── BidRepository.java
│       │   │   │   ├── ProductRepository.java
│       │   │   │   └── UserRepository.java
│       │   │   ├── service/
│       │   │   │   ├── BidService.java
│       │   │   │   ├── ProductService.java
│       │   │   │   └── UserService.java
│       │   │   └── AuctionManagementApplication.java
│       │   └── resources/
│       │       └── application.properties
│       └── test/
│           └── java/com/auction/
│               └── AuctionManagementApplicationTests.java
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── components/
│       │   ├── BidSection.jsx
│       │   ├── DashboardSection.jsx
│       │   ├── Navbar.jsx
│       │   ├── ProductSection.jsx
│       │   └── UserSection.jsx
│       ├── services/
│       │   └── api.js
│       ├── App.css
│       ├── App.jsx
│       ├── index.css
│       └── main.jsx
├── .gitignore
└── README.md
```
