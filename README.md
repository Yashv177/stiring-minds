# Startup Benefits Platform

This is a full-stack application designed to help startups access various benefits and deals. It consists of a backend API built with Node.js and Express, and a frontend built with Next.js. The platform allows users to browse deals, claim them, and manage their accounts.

## What This Project Does

### Backend Features
- **RESTful API**: Built with Node.js, Express, and TypeScript
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **Database**: MongoDB with Mongoose ODM
- **Validation**: Input validation using Joi
- **Rate Limiting**: Built-in protection against abuse
- **Error Handling**: Global error handling middleware

### Frontend Features
- **User Registration and Login**: Users can create accounts and log in securely.
- **Deal Browsing**: View available deals from different providers, with options to filter and search.
- **Claiming Deals**: Users can claim deals, with status tracking from pending to redeemed.
- **Verification System**: Some deals require user verification before claiming.
- **Responsive Design**: The frontend works well on all devices, from phones to desktops.
- **Smooth Animations**: Page transitions and interactions are animated for a better user experience.

## How the Project is Organized

```
stiring minds/
├── README.md              # This file
├── backend/               # Backend API
│   ├── src/
│   │   ├── app.ts         # Main app setup
│   │   ├── server.ts      # Server entry point
│   │   ├── controllers/   # Business logic for different parts
│   │   ├── middleware/    # Shared code like authentication
│   │   ├── models/        # Database structures
│   │   ├── routes/        # API endpoints
│   │   ├── utils/         # Helper functions
│   │   └── validations/   # Input checking
│   ├── package.json
│   └── README.md          # Backend details
├── frontend/              # Frontend application
│   ├── src/
│   │   ├── app/           # Pages and layouts
│   │   ├── components/    # Reusable UI pieces
│   │   ├── context/       # Global state
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utilities and API calls
│   ├── package.json
│   └── README.md          # Frontend details
└── run scripts            # Scripts to run the project
```

## Getting Started

### Prerequisites
- Node.js installed on your computer
- MongoDB database (local or cloud like MongoDB Atlas)

### Setting Up the Backend
1. Go into the backend folder:
   ```
   cd backend
   ```
2. Install the needed packages:
   ```
   npm install
   ```
3. Set up your environment variables by copying the example file:
   ```
   cp .env.example .env
   ```
   Then edit `.env` with your database URL and other settings.
4. Start the backend server:
   ```
   npm run dev
   ```

### Setting Up the Frontend
1. Go into the frontend folder:
   ```
   cd frontend
   ```
2. Install the needed packages:
   ```
   npm install
   ```
3. Set up your environment variables in `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:4000
   ```
4. Start the frontend development server:
   ```
   npm run dev
   ```

Now you can open your browser to `http://localhost:3000` to see the application.

## Key Features Explained

### For Users
- Create an account with your name, email, and password.
- Log in to access more features.
- Browse deals by category or search terms.
- Claim deals you're interested in.
- View your dashboard to see your claims and their status.

### For Developers
- The backend uses TypeScript for type safety.
- Authentication is handled with JWT tokens.
- The frontend uses modern React with Next.js 14.
- Styling is done with Tailwind CSS for consistency.
- Animations add polish with Framer Motion.

## API Overview

The backend provides RESTful endpoints for:
- Authentication (register, login)
- Managing deals (list, get details)
- Handling claims (create, list user's claims)
- Verification (request and check status)

All requests that need authentication include a JWT token in the header.

## Building for Production

For the backend:
```
npm run build
npm start
```

For the frontend:
```
npm run build
npm start
```

Make sure to set proper environment variables for production, like secure JWT secrets and database connections.

## Contributing

If you'd like to help improve this project, feel free to make changes and test them. Keep the code clean and add comments where needed. This is a community project, so let's make it better together.

## License

This project is open source under the MIT license. You can use it for your own purposes, just give credit where due.
