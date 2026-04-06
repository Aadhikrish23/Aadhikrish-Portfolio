````markdown
# Portfolio - MERN Stack Application

A full-stack portfolio website built with the MERN stack, featuring JWT authentication, admin dashboard, and dynamic content management for blogs, projects, and skills.

## Features

- **JWT Authentication**: Secure login system for admin users.
- **Admin Dashboard**: Manage blogs, projects, and skills through a protected interface.
- **Protected Routes**: Ensure only authenticated users can access admin features.
- **MVC Architecture**: Clean separation of concerns with models, views, and controllers.
- **Responsive Design**: Built with React and Tailwind CSS for a modern, mobile-friendly UI.
- **API Integration**: RESTful APIs for seamless data handling.
- **File Uploads**: Support for image uploads using Cloudinary.
- **TypeScript**: Type-safe development on both frontend and backend.

## Tech Stack

### Frontend
- **React**: Component-based UI library.
- **Vite**: Fast build tool and development server.
- **TypeScript**: Typed JavaScript for better code quality.
- **Tailwind CSS**: Utility-first CSS framework.
- **Axios**: HTTP client for API requests.

### Backend
- **Node.js**: JavaScript runtime for server-side development.
- **Express**: Web framework for building APIs.
- **MongoDB**: NoSQL database for data storage.
- **TypeScript**: Server-side type safety.
- **JWT**: JSON Web Tokens for authentication.
- **Cloudinary**: Cloud-based image management.

## Project Structure

```
Portfolio/
├── client/                          # Frontend (React + Vite)
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── APIServices/             # API service functions
│   │   ├── components/              # Reusable UI components
│   │   │   ├── common/              # Shared components (e.g., InfoCard, ProjectCard)
│   │   │   ├── layout/              # Layout components (e.g., Navbar, MainLayout)
│   │   │   ├── sections/            # Page sections (e.g., HeroSection, AboutSection)
│   │   │   └── ui/                  # UI-specific components
│   │   ├── context/                 # React context for state management
│   │   ├── pages/                   # Page components
│   │   │   ├── admin/               # Admin pages (e.g., Dashboard, BlogAdmin)
│   │   │   └── public/              # Public pages (e.g., Home, Blog)
│   │   ├── routes/                  # Routing configuration
│   │   ├── types/                   # TypeScript type definitions
│   │   └── utils/                   # Utility functions (e.g., axios setup)
│   ├── tailwind.config.js           # Tailwind CSS configuration
│   ├── tsconfig.json                # TypeScript configuration
│   └── vite.config.ts               # Vite configuration
├── server/                          # Backend (Node.js + Express)
│   ├── src/
│   │   ├── config/                  # Configuration files (e.g., MongoDB, Cloudinary)
│   │   ├── controllers/             # Route handlers
│   │   ├── middlewares/             # Custom middlewares (e.g., auth, error handling)
│   │   ├── models/                  # Mongoose models
│   │   ├── routes/                  # API routes
│   │   ├── services/                # Business logic services
│   │   ├── types/                   # TypeScript types
│   │   ├── utils/                   # Utility functions (e.g., error classes, slug generation)
│   │   └── validators/              # Input validation
│   ├── .env                         # Environment variables
│   ├── package.json                 # Dependencies and scripts
│   └── tsconfig.json                # TypeScript configuration
├── .hintrc                          # Hint configuration
└── README.md                        # Project documentation
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Cloudinary account for image uploads

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd Portfolio
   ```

2. **Install backend dependencies**:
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**:
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Setup**:
   - Create a `.env` file in the `server/` directory.
   - Add the following variables:
     ```
     MONGO_URI=<your-mongodb-connection-string>
     JWT_SECRET=<your-jwt-secret>
     CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
     CLOUDINARY_API_KEY=<your-cloudinary-api-key>
     CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
     ```

5. **Run the application**:
   - Start the backend server:
     ```bash
     cd server
     npm run dev
     ```
   - Start the frontend development server:
     ```bash
     cd ../client
     npm run dev
     ```

6. **Access the application**:
   - Frontend: `http://localhost:5173` (default Vite port)
   - Backend: `http://localhost:5000` (or as configured)

### Building for Production
- **Frontend**:
  ```bash
  cd client
  npm run build
  ```
- **Backend**: Ensure environment variables are set for production deployment.

## Usage

- **Public Access**: View the portfolio, blogs, projects, and skills.
- **Admin Login**: Access `/admin/login` to log in and manage content.
- **API Endpoints**: Refer to the routes in `server/src/routes/` for available APIs.

## Contributing

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Push to the branch.
5. Open a pull request.

## License

This project is licensed under the MIT License.
````