# Chat Application - [Live Demo](https://chat-application-m55y.vercel.app/)

A chat application built using React, Firebase (Firestore database), CSS, and EmailJS (for OTP verification).

### Desktop :-
<img src="https://github.com/dipeshdimi/ChatApplication/assets/82582216/cf09b2eb-d69a-4843-9b54-1cd8ea2447f0" width=49%> <img src="https://github.com/dipeshdimi/ChatApplication/assets/82582216/359c0c38-011e-4fb0-af73-2ccfc4426de7" width=49%>
<img src="https://github.com/dipeshdimi/ChatApplication/assets/82582216/5ceb661c-0a89-4d3a-a592-e6af477723f8"> 

### Mobile :-
<img src="https://github.com/user-attachments/assets/cc23e9c1-c248-4d04-9233-43d9b7adbc22" width=49%> <img src="https://github.com/user-attachments/assets/3816712c-812e-4c1e-b90f-99f04e7e3c6e" width=49%>


## Table of Contents

- [Chat Application](#chat-application)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Features](#features)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Usage](#usage)
  - [Authentication](#authentication)
  - [Conversations](#conversations)
  - [Message Types](#message-types)
  - [Logout](#logout)
  - [License](#license)

## Introduction

This is a real-time chat application that enables users to register, authenticate, and engage in conversations with other registered users. It supports various message types, including text, pictures, videos, and voicemails.

## Features

- User registration with username, email, password, and picture (optional)
- User authentication using Firebase
- User-to-user conversations
- Message types: text, picture, video, and voicemail
- Conversation deletion
- Logout functionality

<img src="https://github.com/dipeshdimi/ChatApplication/assets/82582216/97f5173c-0c87-4060-aa06-4a8401fd7b58" width=32%> <img src="https://github.com/dipeshdimi/ChatApplication/assets/82582216/08052332-973a-4197-a64c-4f4aa34546b0" width=33%> <img src="https://github.com/dipeshdimi/ChatApplication/assets/82582216/6134ad31-79f8-45b0-b1ab-6a45c1dd4caf" width=32%> 


## Getting Started

Follow these steps to set up and run this Chat App locally.

### Prerequisites

Ensure you have the following tools installed:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- Firebase account with Firestore enabled

### Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/dipeshdimi/ChatApplication.git
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Set up Firebase:**

   - Create a Firebase project and enable Firestore.
   - Obtain your Firebase configuration and update the app accordingly.

4. **Start the app:**

    ```bash
    npm start
    ```

## Usage

Once the app is running, open it in your web browser and follow the on-screen instructions for registration and login. Explore the various features and functionalities of the chat app.

## Authentication

User authentication is handled securely using Firebase. Users can register with their email, username, password, and picture (optional). An OTP will be shared (via EmailJS to the registered email address which would be required for further verification. Subsequent logins require the user's email and password.

## Conversations

Users can search for other registered users and initiate conversations with them. Conversations can be deleted entirely from the user's side.

## Message Types

The app supports different message types:

- **Text**: Send and receive text messages.
- **Picture**: Share images with other users.
- **Video**: Send and view video messages.
- **Voicemail**: Record and send voice messages.

## Logout

Users can log out of the app securely, ensuring the privacy of their data.

## License

This project is licensed under the [MIT License](LICENSE).
