# System Architecture: Nova Bank

![System Diagram](./Screenshot%202026-06-20%20041724.png)

## Overview
Nova Bank is a secure, digital banking platform built with a hybrid authentication and relational data architecture. The system is designed for high security, fast user onboarding, and strict data integrity for financial transactions.

## Tech Stack
* **Frontend & API Gateway:** Next.js (React) & Tailwind CSS
* **Authentication:** Firebase Auth
* **Database:** PostgreSQL (Containerized via Docker)
* **Infrastructure:** Docker Compose

## Core Components

### 1. The Client (Next.js)
The frontend handles user input and state management. When a user logs in or signs up, the client communicates directly with Firebase (Option 1) or securely routes credentials through our Next.js API routes (Option 2) to ensure sensitive data is handled properly.

### 2. Identity & Access Management (Firebase)
To ensure enterprise-grade security for user passwords, we offloaded identity management to **Firebase**. 
* **Why?** It prevents us from having to manually hash passwords, mitigates SQL injection risks on the auth flow, and handles uniqueness constraints (like preventing duplicate emails) automatically.

### 3. Core Banking Database (PostgreSQL)
While Firebase handles *who* the user is, our PostgreSQL database handles *what* the user owns.
* **Data Integrity:** Bank accounts, balances, and transaction histories are strictly relational. Postgres enforces this through Foreign Keys and structured tables.
* **The Identity Bridge:** We link the two systems by storing the Firebase `uid` (a long string) as the Primary Key (`id`) in our Postgres `users` table. 

## Data Flow: The User Registration Journey
1.  User submits the signup form.
2.  Next.js API sends the email/password to Firebase Auth.
3.  Firebase securely creates the account and returns a unique `uid`.
4.  Next.js API sanitizes the remaining user data (Account Name, Account Number).
5.  Next.js API inserts a new record into the PostgreSQL `users` and `accounts` tables using the Firebase `uid` as the connecting ID.

## Key Engineering Decisions & Challenges
* **Schema Migration on the Fly:** Initially, our SQL database used standard integers for user IDs. When integrating Firebase, we faced type-matching crashes. We successfully engineered a live schema update to convert our Primary Keys to `VARCHAR(255)`, allowing our SQL database to seamlessly accept Firebase UIDs without losing referential integrity.