# Recruitment Test Application

This project is a full-stack application built using ASP.NET Core for the backend and React with Vite for the frontend. It is designed to demonstrate the integration of a .NET backend with a React frontend, including features like API endpoints and real-time communication using SignalR.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)

## Prerequisites

Before you begin, ensure you have met the following requirements:

- [.NET SDK 8.0](https://dotnet.microsoft.com/download/dotnet/8.0) installed on your machine.
- [Node.js](https://nodejs.org/) (version 14 or later) installed.
- [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/) for managing JavaScript packages.

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/RecruitmentTestApplication.git
   cd RecruitmentTestApplication
   ```

2. **Install backend dependencies:**

   Navigate to the backend project directory and restore the NuGet packages:

   ```bash
   cd RecruitmentTestApplication
   dotnet restore
   ```

3. **Install frontend dependencies:**

   Navigate to the React app directory and install the required packages:

   ```bash
   cd react-app
   npm install
   ```

   or if you are using Yarn:

   ```bash
   yarn install
   ```

## Running the Application

### Backend

To run the .NET backend, use the following command from the root of the project:

```bash
dotnet run --project RecruitmentTestApplication/RecruitmentTestApplication.csproj
```

This will start the backend server, and you can access it at `http://localhost:5115`.

### Frontend

To run the React frontend, navigate to the `react-app` directory and use the following command:

```bash
npm run dev
```

or if you are using Yarn:

```bash
yarn dev
```

This will start the Vite development server, and you can access the frontend at `http://localhost:5173`.

## Environment Variables

The application uses several environment variables for configuration. You can set these in your terminal or create a `.env` file in the root of the project. Here are the key variables:

- `ASPNETCORE_ENVIRONMENT`: Set to `Development`, `Staging`, or `Production` depending on the environment.
- `STATIC_URL`: The URL for the static resources (default is `http://localhost:5173`).

## Project Structure

The project is structured as follows:

```
RecruitmentTestApplication/
├── RecruitmentTestApplication/          # Backend project
│   ├── Controllers/                      # API controllers
│   ├── Hubs/                             # SignalR hubs
│   ├── Models/                           # Data models
│   ├── Program.cs                        # Entry point for the application
│   └── appsettings.json                  # Configuration settings
└── react-app/                            # Frontend project
    ├── src/                              # Source files for React
    ├── public/                           # Static files
    ├── package.json                      # Frontend dependencies and scripts
    └── vite.config.js                    # Vite configuration
```
