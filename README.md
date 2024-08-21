# Simple Login
Simple Login is a functional react + typescript + sass project demonstrating a simple login flow for a web application.

Users can register a new user, login as that user, and delete their account.

All saved data is stored in the browser's local storage to mock a API service with persistent storage. 

> This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# Motivation
The motivation for this project was to illustrate how a react app could be structured with components and hooks to acheive an authentication workflow.

Main priorities used when designing were:
1. Testability - Designing well modules to be testable tends to lead to, in my expierence, a more resilient application that can be confidently upgraded and patched. In this application, the hooks and utilities exist as modules with clear inputs and outputs that enable unit and integration testing.
2. Readability - Using clear and descriptive names, in my expierence, results a more debuggable application where excitisting functionality can be understood and faults easily identified. Encapsulating the authentication service functionality into a hook called useAuthService is intended to quickly convey meaning to that module’s functionality.
3. Reusability - Focusing on building deep modules that are highly reusable and well tested, in my expierence, leads to subsequent feature development requiring mostly reuse of already existing modules and thus low develeopment cycle and lead times. Using a dedicated hook to interface with the browser’s local storage enables future local storage requirements to be implemented by reusing this hook.

By focusing on the above priorities, each layer of software is intentionally designed to fulfill specific purposes and be tested so that the application is resilient, debuggable, and extendable.

# Running
After cloning the repo, simply:

1. run `npm install`
2. run `npm start`

# Software design
This application is built with the following:

## Pages
The pages serve as the top layer controller as they render visual components, manage state, and leverage hooks

### Login
The landing page for the application is `Login`. This page collets user's sign-in information and routes them to the home page if they are authenticated or directs user's to register an account.

### RegisterAccount
The `RegisterAccount` page collects user's account information in the form of a username and a password. The form will verify that the password and the confirmed password match before attempt to create the user.

### Home
The `Home` page is where a hypothetical application would live. To mimic that, this application will show the logged in user and enable users to logout or delete the account.


## Hooks
The hooks in this application do most of the heavy lifting by managing complex state and actions.

### useAuthService
`useAuthService` serves as the data fetching service in the application. This hook is responsible for interacting mock APIs to create, find, and delete users 

### useLocalStorage
Local storage in this application serves two purposes. One is to mock a persistent data store typically interfaced with via an API and the second is to store logged in user's token for future API requests.
`useLocalStorage` encapsulates interfacing with the browser's local storage.

### useMockAuthServiceProvider
`useMockAuthServiceProvider` is a hook used to mock an API server responding to requests from this application. This hook implements simple username and password hashing as well as generating simple user authentication tokens with trivial expiration functionality.

## Components
The components module contains a few custom built UI components. 

### TextInput
A input field to gather text from the user including passwords

### LandingContainer
A wrapping component used to orient the background image with the content of the application

### Button
A clickable interface element to enable user actions

# Styling
Styling for this application was done with sass so that modular css could be used to style each component and page.
A common `theme.scss` file contains the global styles and reused theme variables across all scss files.