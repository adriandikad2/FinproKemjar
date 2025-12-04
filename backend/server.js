require("dotenv").config()
const express = require("express")
const cors = require("cors")

// Import database connection
const connectDB = require('./config/db')

// Import routes
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const systemRoutes = require('./routes/systemRoutes')

// Import middleware
const logger = require('./middleware/logger')

const app = express()

// Connect to database
connectDB()

// CORS Configuration
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
)

app.use(express.json())

// Logger middleware
app.use(logger)

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/system', systemRoutes)

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

// Error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error)
  res.status(500).json({ message: 'Internal server error' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`✓ Backend running on http://localhost:${PORT}`)
  console.log(`✓ Frontend should run on http://localhost:3000`)
  console.log(`✓ API Documentation:`)
  console.log(`  POST /api/auth/register - Register new user`)
  console.log(`  POST /api/auth/login - Login user`)
  console.log(`  GET /api/user/profile - Get user profile (auth required)`)
  console.log(`  PUT /api/user/profile - Update user profile (auth required)`)
  console.log(`  GET /api/system/ping?host=<host> - Ping host (auth required, VULNERABLE)`)
  console.log(`  GET /health - Health check`)
})
