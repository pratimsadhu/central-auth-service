central-auth-service/
│── src/
│   ├── tests/
│   │   ├── setup.ts        # Test setup
│   ├── config/
│   │   ├── db.ts           # Database connection (PostgreSQL + Supabase)
│   │   ├── supabase.ts     # Supabase client initialization
│   ├── middleware/
│   │   ├── authMiddleware.ts  # JWT authentication middleware
│   ├── routes/
│   │   ├── authRoutes.ts   # Signup, Login, JWT routes
│   │   ├── userRoutes.ts   # User management routes
│   ├── controllers/
│   │   ├── authController.ts  # Auth logic (signup, login)
│   │   ├── userController.ts  # User-related logic
│   ├── utils/
│   │   ├── jwt.ts          # JWT token utilities
│   │   ├── bcrypt.ts       # Password hashing utilities
│   ├── index.ts            # Main server file
│── .env                    # Environment variables
│── .gitignore               # Ignore unnecessary files
│── package.json             # Project dependencies
│── tsconfig.json            # TypeScript configuration
│── README.md                # Documentation
