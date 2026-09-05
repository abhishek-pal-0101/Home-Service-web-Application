# Home-Service-web-Application

# Home Line Services - Home Services Web Application

Home Line Services is a full-stack web application that allows users to book household services online. The application connects customers with service providers and provides a convenient platform for managing home service bookings.

Users can browse services, book services, manage their bookings, and submit reviews. Service providers can register, manage their services, and handle customer booking requests.

## Project Overview

The main purpose of this application is to provide an online platform where customers can easily find and book different home services from a single application.

The application supports different types of services such as:

* Plumbing
* Electrical
* Cleaning
* Painting
* AC Repair
* Other household services

The project follows a client-server architecture where the React frontend communicates with the Spring Boot backend through REST APIs.

## Features

### User Features

* User registration
* User login
* JWT-based authentication
* Browse available services
* View service details
* Book home services
* View booking details
* View booking history
* Manage bookings
* Cancel bookings
* Submit ratings and reviews
* User dashboard

### Service Provider Features

* Service provider registration
* Provider login
* Manage provider profile
* Add services
* Update services
* Delete services
* View customer bookings
* Manage booking requests
* Update booking status
* Provider dashboard

### Admin Features

* Admin login
* Manage users
* Manage service providers
* Manage services
* Manage service categories
* Manage bookings
* Monitor application activities

## Technology Stack

### Frontend

* React.js
* JavaScript
* HTML5
* CSS3
* Bootstrap
* Vite

### Backend

* Java
* Spring Boot
* Spring MVC
* Spring Data JPA
* Hibernate
* Spring Security
* RESTful APIs
* JWT Authentication

### Database

* MySQL

### Development Tools

* Git
* GitHub
* Maven
* Postman
* Visual Studio Code
* Eclipse / Spring Tool Suite

## System Architecture

```text
React.js Frontend
       |
       | HTTP / REST API
       |
Spring Boot Backend
       |
       +-------------------+
       |                   |
 Controller Layer      Security Layer
       |
 Service Layer
       |
 Repository Layer
       |
 Hibernate / JPA
       |
 MySQL Database
```

## Application Workflow

```text
User Registration
       |
       v
User Login
       |
       v
JWT Authentication
       |
       v
Browse Services
       |
       v
Select Service
       |
       v
Book Service
       |
       v
Service Provider Receives Booking
       |
       v
Provider Accepts Booking
       |
       v
Service Completed
       |
       v
User Gives Rating and Review
```

## Authentication and Authorization

The application uses Spring Security and JWT for authentication and authorization.

The authentication process works as follows:

```text
User Login
    |
    v
Backend Validates Credentials
    |
    v
JWT Token Generated
    |
    v
Token Sent to Frontend
    |
    v
Frontend Sends Token With Protected Requests
    |
    v
Spring Security Validates JWT
    |
    v
Request Authorized
```

The application supports role-based authorization for:

* ADMIN
* USER
* SERVICE_PROVIDER

## Database Design

The application uses MySQL as the relational database.

Main entities include:

* User
* Service Provider
* Service
* Category
* Booking
* Review

Basic relationship structure:

```text
User
 |
 +---- Booking
 |       |
 |       +---- Service
 |
 +---- Review

Service Provider
 |
 +---- Service
        |
        +---- Booking
```

## Project Structure

### Backend

```text
backend/
|
+-- src/
    |
    +-- main/
        |
        +-- java/
        |   |
        |   +-- controller/
        |   +-- service/
        |   +-- repository/
        |   +-- entity/
        |   +-- dto/
        |   +-- security/
        |   +-- exception/
        |   +-- HomeServicesApplication.java
        |
        +-- resources/
            |
            +-- application.properties
```

### Frontend

```text
frontend/
|
+-- src/
    |
    +-- components/
    +-- pages/
    +-- services/
    +-- context/
    +-- hooks/
    +-- assets/
    +-- App.jsx
    +-- main.jsx
```

## Installation and Setup

### Prerequisites

Make sure the following software is installed:

* Java 17 or higher
* Maven
* MySQL
* Node.js
* npm
* Git

## Backend Setup

Clone the repository:

```bash
git clone https://github.com/your-username/home-line-services.git
```

Navigate to the backend directory:

```bash
cd home-line-services/backend
```

Configure the MySQL database in:

```text
src/main/resources/application.properties
```

Example configuration:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/home_services
spring.datasource.username=root
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

server.port=8080
```

Create the database in MySQL:

```sql
CREATE DATABASE home_services;
```

Run the Spring Boot application:

```bash
mvn spring-boot:run
```

The backend will run on:

```text
http://localhost:8080
```

## Frontend Setup

Navigate to the frontend directory:

```bash
cd home-line-services/frontend
```

Install dependencies:

```bash
npm install
```

Start the React development server:

```bash
npm run dev
```

The frontend will normally run on:

```text
http://localhost:5173
```

## REST API

The backend provides REST APIs for authentication, users, services, bookings, providers, and reviews.

### Authentication APIs

```text
POST /api/auth/register
POST /api/auth/login
```

### Service APIs

```text
GET    /api/services
GET    /api/services/{id}
POST   /api/services
PUT    /api/services/{id}
DELETE /api/services/{id}
```

### Booking APIs

```text
POST   /api/bookings
GET    /api/bookings
GET    /api/bookings/{id}
PUT    /api/bookings/{id}
DELETE /api/bookings/{id}
```

### Review APIs

```text
POST /api/reviews
GET  /api/reviews/{serviceId}
```

Note: Update the API endpoint names according to the actual controller mappings in the project.

## API Testing

Postman can be used to test the REST APIs.

Recommended testing flow:

```text
Register User
      |
      v
Login User
      |
      v
Receive JWT Token
      |
      v
Add JWT Token to Authorization Header
      |
      v
Access Protected APIs
```

For protected APIs, use:

```text
Authorization: Bearer <JWT_TOKEN>
```

## Security

The application implements the following security features:

* JWT-based authentication
* Spring Security
* Password encryption
* Role-based authorization
* Protected REST APIs
* Authentication validation
* Authorization validation
* Exception handling

## CRUD Operations

The application implements CRUD operations for different resources.

CRUD stands for:

```text
Create
Read
Update
Delete
```

Examples include:

* Create a service
* View services
* Update service information
* Delete a service
* Create a booking
* View bookings
* Update booking status
* Delete or cancel bookings

## Key Learning Outcomes

This project helped in understanding and implementing:

* Core Java
* Object-Oriented Programming
* Spring Boot
* Spring MVC
* REST API development
* Spring Data JPA
* Hibernate ORM
* MySQL database integration
* CRUD operations
* Spring Security
* JWT authentication
* Role-based authorization
* React.js
* Frontend and backend integration
* API testing using Postman
* Git and GitHub
* Maven

## Future Enhancements

The following features can be added in future versions:

* Online payment integration
* Email notifications
* SMS notifications
* Real-time booking notifications
* Service provider location tracking
* Advanced search and filtering
* Service availability calendar
* Customer support chat
* Service provider verification
* Admin analytics dashboard
* Cloud deployment
* Mobile application

## Developer

Abhishek

Java Full Stack Developer

Technologies:

Java | Spring Boot | React.js | MySQL | REST APIs | Hibernate | JWT

## License

This project is developed for educational and portfolio purposes.

