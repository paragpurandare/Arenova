# 🏆 Arenova — Sports Arena & Booking Platform

Arenova is a full-stack sports facility management and booking platform that allows users to discover sports clubs, book courts and time slots, rent sports equipment, and make online payments.

The project was initially developed using a **Modular Monolithic Architecture** and has been progressively evolved into a **Microservices-based architecture** with service discovery, API Gateway, Docker, and independently deployable services.

## ✨ Features

* 🔐 JWT-based authentication & role-based authorization
* 🏟️ Sports club and court management
* 🕐 Dynamic court slot generation and availability
* 📅 Sports facility booking
* 🏸 Equipment inventory & rental management
* 💳 Online payments using Razorpay
* 👤 Customer, Club Owner, Club Manager & Admin roles
* 🔎 Service discovery using Eureka
* 🚪 Centralized API routing through Spring Cloud Gateway
* 🐳 Dockerized backend services
* 🗄️ Separate databases for individual services

## 🏗️ Architecture

```text
                    React Frontend
                          │
                          ▼
                   API Gateway :8080
                          │
             ┌────────────┼────────────┐
             │            │            │
             ▼            ▼            ▼
        Slot :8081   Rental :8082   Payment :8083
             │            │            │
             └────────────┼────────────┘
                          ▼
                   Booking :8084

                    Monolith :8085
              Auth / Users / Clubs /
              Courts / Equipment / Admin

                          │
                          ▼
                    MySQL Database

                 Eureka Server :8761
                   Service Discovery
```

## 🧩 Services

| Service          | Port | Responsibility                                          |
| ---------------- | ---: | ------------------------------------------------------- |
| API Gateway      | 8080 | API routing & service communication                     |
| Eureka Server    | 8761 | Service discovery                                       |
| Slot Service     | 8081 | Court slots & availability                              |
| Rental Service   | 8082 | Equipment rentals                                       |
| Payment Service  | 8083 | Payment processing                                      |
| Booking Service  | 8084 | Booking management                                      |
| Monolith Service | 8085 | Authentication, users, clubs, courts, equipment & admin |

## 🛠️ Tech Stack

### Frontend

* React
* JavaScript
* Vite
* React Router
* Axios

### Backend

* Java 21
* Spring Boot 3.x
* Spring Data JPA / Hibernate
* Spring Security
* JWT
* Spring Cloud Gateway
* Netflix Eureka
* Spring Cloud LoadBalancer
* Maven
* Lombok
* ModelMapper
* OpenAPI / Swagger

### Database & Infrastructure

* MySQL 8.4
* Docker
* Docker Compose
* Jenkins
* Git & GitHub

### Payment

* Razorpay

## 🗄️ Database

Each service uses its own logical database:

```text
arenovaDB
arenova_slot_db
arenova_rental_DB
arenova_payment_DB
arenova_booking_DB
```

The MySQL database and required privileges are automatically initialized through Docker.

## 🚀 Running the Project

### Start Backend

```bash
cd services
docker compose up -d
```

Check the services:

```bash
docker compose ps
```

### Eureka Dashboard

```text
http://localhost:8761
```

### API Gateway

```text
http://localhost:8080
```

The React frontend can be run separately and communicates with the backend through the API Gateway.

## 📌 Project Structure

```text
Arenova-Sports-Ecosystem/
│
├── backend/        # Modular monolith
├── client/         # React frontend
│
└── services/
    ├── api-gateway/
    ├── eureka-server/
    ├── slot-service/
    ├── rental-service/
    ├── payment-service/
    ├── booking-service/
    ├── mysql-init/
    └── docker-compose.yml
```

## 👨‍💻 Contributors

**Parag Purandare**
**Prasad Aher**

---

⭐ Built as a full-stack, enterprise-oriented sports management and booking platform.
