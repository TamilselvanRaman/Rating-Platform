# Rating Platform

A full-stack web application for managing and rating stores, featuring role-based access control for Admins, Users, and Store Owners.

## 🚀 Features

- **Role-Based Access Control (RBAC)**:
  - **Admin**: Manage users and stores.
  - **Store Owner**: Manage their own store dashboard.
  - **User**: View stores and submit ratings (upcoming).
- **Authentication**: Secure login and registration using JWT.
- **Responsive UI**: Built with React, Tailwind CSS, and Framer Motion.
- **Backend**: Node.js, Express, and Prisma ORM with PostgreSQL.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS, PostCSS
- **State Management & Data Fetching**: React Hooks, Axios
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Animations**: Framer Motion

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Validation**: Zod
- **Authentication**: JSON Web Tokens (JWT), BCrypt
- **Security**: CORS, Cookie Parser

## 📂 Project Structure

```
Rating Platform/
├── backend/                # Node.js & Express Backend
│   ├── prisma/             # Prisma Schema & Migrations
│   ├── src/
│   │   ├── controllers/    # Route Controllers
│   │   ├── middlewares/    # Auth & Error Middleware
│   │   ├── routes/         # API Routes
│   │   └── utils/          # Utility functions
│   └── package.json
│
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable Components
│   │   ├── context/        # Auth Context
│   │   ├── pages/          # Application Pages
│   │   └── App.jsx         # Main App Component
│   └── package.json
│
└── README.md
```

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (running locally or via a cloud provider)

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend` directory and configure your environment variables:
   ```env
   PORT=5000
   DATABASE_URL="postgresql://user:password@localhost:5432/rating_platform?schema=public"
   JWT_SECRET="your_super_secret_key"
   NODE_ENV="development"
   ```

4. Push the database schema:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```
   The server will run on `http://localhost:5000`.

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:5173`.

## 🛣️ API Endpoints

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| **Auth** | | | |
| POST | `/api/auth/register` | Register a new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| POST | `/api/auth/logout` | Logout user | Private |
| **Users** | | | |
| GET | `/api/users/profile` | Get user profile | Private |
| **Stores** | | | |
| GET | `/api/stores` | Get all stores | Public/Private |
| POST | `/api/stores` | Create a store | Admin/Owner |
| **Admin** | | | |
| GET | `/api/admin/users` | Get all users | Admin |
| GET | `/api/admin/stores` | Manage stores | Admin |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.
