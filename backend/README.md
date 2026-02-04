# Let's Play

**Let's Play** is a secure and scalable RESTful API built with **Spring Boot** and **MongoDB**.  
It allows management of **users** and **products** with full **CRUD operations**, **JWT-based authentication**, and **role-based access control**.  
This project demonstrates backend development best practices, secure coding, and RESTful API design principles.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Roles and Permissions](#roles-and-permissions)
- [Project Structure](#project-structure)
- [Database Design](#database-design)
- [API Endpoints](#api-endpoints)
- [Installation and Running](#installation-and-running)
- [Learning Outcomes](#learning-outcomes)
- [Security Measures](#security-measures)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview

Let's Play is an e-commerce-like backend system designed to manage users and products.

- Admins can manage all users and products.
- Normal users can manage only their own products.
- Authentication is handled with **JWT tokens**, and all endpoints enforce proper role-based access control.
- The project follows RESTful API conventions and best practices for clean, modular, and secure backend development.

---

## Features

- **User Management**
  - Register and login with secure password hashing (BCrypt)
  - Admins can view, update, and delete all users
- **Product Management**
  - CRUD operations for products
  - Users can only manage their own products
  - Admins can manage all products
- **Authentication & Authorization**
  - JWT token-based authentication
  - Role-based permissions (Admin vs User)
- **Error Handling**
  - Global exception handling
  - Meaningful HTTP status codes (400, 401, 403, 404, 409, etc.)
- **Security**
  - Input validation and sanitization
  - Sensitive data like passwords are never returned
  - HTTPS recommended for secure data transmission

---

## Roles and Permissions

| Role | Permissions                                                   |
|------|---------------------------------------------------------------|
| ADMIN | Manage all users and products, full access to all endpoints |
| USER  | Manage only their own products, cannot view or modify other users |

---

## Project Structure

```
lets-play/
│
├── src/main/java/com/letsplay/
│   ├── controller/       # REST controllers for Users and Products
│   ├── model/            # MongoDB entity classes (User, Product)
│   ├── repository/       # MongoDB repositories
│   ├── security/         # JWT, authentication filters, security config
│   ├── service/          # Business logic services
│   └── exception/        # Custom exceptions and global handler
│
├── src/main/resources/
│   ├── application.properties   # MongoDB and Spring Boot config
│
├── pom.xml                     # Maven dependencies
└── README.md
```

---

## Database Design

### User
- `id` (String)
- `name` (String)
- `email` (String)
- `password` (String, hashed)
- `role` (String: ADMIN / USER)

### Product
- `id` (String)
- `name` (String)
- `description` (String)
- `price` (Double)
- `userId` (String, references owner)

**Relationship:** One user → Many products

---

## API Endpoints

### Authentication
- `POST /auth/register` – Register a new user
- `POST /auth/login` – Login and receive JWT token

### Users (Admin Only)
- `GET /users` – List all users
- `GET /users/{id}` – Get a specific user
- `PUT /users/{id}` – Update a user
- `DELETE /users/{id}` – Delete a user

### Products
- `GET /products` – Public: List all products
- `GET /products/{id}` – Public: Get a product by ID
- `POST /products` – Authenticated users: Create product
- `PUT /products/{id}` – Product owner/Admin: Update product
- `DELETE /products/{id}` – Product owner/Admin: Delete product

---

## Installation and Running

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/lets-play.git
cd lets-play
```

2. **Configure MongoDB connection** in `src/main/resources/application.properties`:
```properties
spring.data.mongodb.uri=mongodb://localhost:27017/letsplay
```

3. **Build and run the application:**
```bash
mvn clean install
mvn spring-boot:run
```

4. **API will be available at:**
```
http://localhost:8080
```

5. **Test endpoints** using Postman, Insomnia, or any REST client.

---

## Learning Outcomes

By building this project, you will learn how to:

- Design RESTful APIs with Spring Boot and MongoDB
- Implement JWT-based authentication and role-based authorization
- Perform CRUD operations securely with proper validation
- Hash and manage passwords safely using BCrypt
- Handle global exceptions and return meaningful HTTP responses
- Follow best practices for backend development and API design

---

## Security Measures

- Passwords are hashed and salted before storage
- Input validation to prevent injection attacks
- Sensitive fields like passwords are excluded from responses
- Role-based access ensures users can only access allowed resources
- HTTPS is recommended for secure data transmission

---

## Contributing

Contributions are welcome! You can submit issues, feature requests, or pull requests.

---

## License

This project is licensed under the MIT License.

