# Kanban Board Application

A full-stack Kanban board application built with modern web technologies. This mono-repo contains both frontend and backend applications for a collaborative task management system.

## 🚀 Tech Stack

### Frontend

- **React 18** - Modern UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Atlaskit** - pragmatic-drag-and-drop library for DnD by Atlassian
- **TanStack Query** - Data fetching and caching
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Pragmatic Drag and Drop** - Drag and drop functionality

### Backend

- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe server-side code
- **PostgreSQL** - Robust relational database
- **Prisma** - Type-safe database ORM
- **JWT** - Authentication tokens
- **Passport** - Authentication middleware
- **bcrypt** - Password hashing
- **Swagger** - API documentation
- **Class Validator** - Request validation

## 📋 Features

- **User Authentication** - Secure login/register with JWT
- **Role-based Access Control** - Admin, Member, and Viewer roles
- **Board Management** - Create and manage multiple Kanban boards
- **Column Management** - Customizable workflow columns
- **Task Management** - Create, edit, and move tasks between columns
- **Task Priority** - Low, Medium, High, and Urgent priority levels
- **Task Assignment** - Assign tasks to team members
- **Due Dates** - Set and track task (Frontend pending)
- **Comments** - Add comments to tasks for collaboration
- **Board Collaboration** - Invite team members to boards (Pending)
- **Drag & Drop** - Intuitive task movement between columns
- **Real-time Updates** - Live collaboration features (Pending)
- **Responsive Design** - Works on desktop and mobile devices

## 🏗️ Project Structure

```
kanban/
├── backend/                 # NestJS API server
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── board/          # Board management
│   │   ├── column/         # Column management
│   │   ├── tasks/          # Task management
│   │   ├── users/          # User management
│   │   ├── guards/         # Authorization guards
│   │   └── prisma/         # Database service
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── migrations/     # Database migrations
│   └── test/               # E2E tests
├── frontend/               # React application
│   ├── src/
│   │   ├── auth/           # Authentication components
│   │   ├── api/            # API layer
│   │   ├── components/     # Reusable UI components
│   │   ├── features/       # Feature-specific components
│   │   └── lib/            # Utilities and helpers
│   └── public/             # Static assets
└── README.md               # This file
```

## 🛠️ Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** (v12 or higher)

## 🚦 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/talalaslam15/kanban.git
cd kanban
```

### 2. Environment Setup

#### Backend Environment

Create a `.env` file in the `backend` directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/kanban_db"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"

# Server
PORT=3000
```

#### Frontend Environment (Optional)

Create a `.env` file in the `frontend` directory if you need to customize the API URL:

```env
VITE_API_URL=http://localhost:3000/api
```

### 3. Database Setup

1. Create a PostgreSQL database named `kanban_db`
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```
5. (Optional) Seed the database:
   ```bash
   npx prisma db seed
   ```

### 4. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Start development server
npm run dev
```

The backend server will start at `http://localhost:3000`

### 5. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend application will start at `http://localhost:5173`

## 📚 API Documentation

Once the backend is running, you can access the Swagger API documentation at:
`http://localhost:3000/api`

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Frontend Tests

```bash
cd frontend

# Run tests
npm run test
```

## 🏃‍♂️ Production Build

### Backend

```bash
cd backend
npm run build
npm run start:prod
```

### Frontend

```bash
cd frontend
npm run build
npm run preview
```

## 🔧 Development Scripts

### Backend

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start:prod` - Start production server
- `npm run lint` - Lint code
- `npm run format` - Format code with Prettier
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code

## 🗃️ Database Schema

The application uses the following main entities:

- **User** - Application users with roles (admin, member, viewer)
- **Board** - Kanban boards owned by users
- **BoardMember** - Many-to-many relationship between users and boards
- **Column** - Workflow columns within boards
- **Task** - Individual tasks with priority, assignee, and due dates
- **Comment** - Comments on tasks for collaboration

## 🔐 Authentication & Authorization

- JWT-based authentication
- Role-based access control (RBAC)
- Protected routes and API endpoints
- Board ownership and membership system

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## 🆘 Support

If you encounter any issues or have questions, please:

1. Check the existing [Issues](https://github.com/talalaslam15/kanban/issues)
2. Create a new issue if your problem isn't already reported
3. Provide detailed information about your environment and the issue

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) for the amazing backend framework
- [React](https://reactjs.org/) for the frontend library
- [Prisma](https://www.prisma.io/) for the database toolkit
- [TailwindCSS](https://tailwindcss.com/) for the styling
- [Atlaskit](https://atlaskit.atlassian.com/) for the UI components

---

**Happy Coding! 🎉**
