# AI Sensei – MERN AI-Powered Japanese Tutor

**AI Sensei** is an all-in-one Japanese learning platform built with the MERN stack (MongoDB, Express.js, React, Node.js). Features include JWT authentication, AI-powered teaching assistants, real-time chat, JLPT study roadmaps, and a clean, responsive UI.

---

## 🚀 Tech Stack

- **Frontend:** React 18 + TailwindCSS + Vite (lazy loading, code splitting)
- **Backend:** Node.js + Express 5 + Socket.IO (compression, caching)
- **Database:** MongoDB Atlas (with in-memory & sessionStorage caching)
- **Authentication:** JWT tokens + bcrypt password hashing
- **AI Integration:** Groq SDK (LLM-powered teachers)
- **Real-time:** Socket.IO for live chat & online status

---

## 📂 Project Structure

```
Ai-sensei/
├── Backend/
│   ├── controllers/     # Business logic for all routes
│   ├── models/          # MongoDB schemas (User, Message, Quiz, etc.)
│   ├── routes/          # API endpoint definitions
│   ├── middleware/      # Auth middleware
│   ├── services/        # AI service integration
│   ├── sockets/         # Socket.IO handlers
│   └── server.js        # Entry point with compression & CORS
│
└── Frontend/
    ├── src/
    │   ├── components/  # Reusable UI components (Navbar)
    │   ├── contexts/    # React contexts (AuthContext)
    │   ├── pages/       # Route pages (Home, Chat, AITeacher, etc.)
    │   ├── api/         # API service functions
    │   └── App.jsx      # Main app with lazy-loaded routes
    └── vite.config.js
```

---

## 🔌 Backend API Endpoints

### **Authentication** (`/api/auth`)

| Method | Endpoint           | Description                                    |
| ------ | ------------------ | ---------------------------------------------- |
| POST   | `/register`        | Create new user account (password auto-hashed) |
| POST   | `/login`           | Login with credentials, get JWT token          |
| POST   | `/forgot-password` | Send OTP to email (valid for 3 minutes)        |
| POST   | `/reset-password`  | Reset password using OTP                       |

### **User Management** (`/api/user`)

| Method | Endpoint               | Description                         |
| ------ | ---------------------- | ----------------------------------- |
| GET    | `/profile`             | Get logged-in user profile          |
| PUT    | `/profile`             | Update user profile                 |
| GET    | `/all`                 | Get all users (for finding friends) |
| GET    | `/:id`                 | Get specific user by ID             |
| GET    | `/notifications/count` | Get count of friend requests        |

### **Friends System** (`/api/user/friends`)

| Method | Endpoint                   | Description                 |
| ------ | -------------------------- | --------------------------- |
| GET    | `/friends`                 | Get user's friend list      |
| POST   | `/friends/request/:userId` | Send friend request         |
| PUT    | `/friends/accept/:userId`  | Accept friend request       |
| DELETE | `/friends/reject/:userId`  | Reject friend request       |
| GET    | `/friends/requests`        | Get pending friend requests |
| DELETE | `/friends/:userId`         | Remove friend               |

### **Messages/Chat** (`/api/users`)

| Method | Endpoint   | Description                                             |
| ------ | ---------- | ------------------------------------------------------- |
| GET    | `/latest`  | Get all conversations (with unread counts, cached 5min) |
| GET    | `/:userId` | Get all messages with specific user                     |
| POST   | `/:userId` | Send message to user (saved to DB + emitted via socket) |

### **AI Teachers** (`/api/ai`)

| Method | Endpoint        | Description                             |
| ------ | --------------- | --------------------------------------- |
| POST   | `/teacher`      | Ask general Japanese learning questions |
| POST   | `/grammar`      | Grammar-specific AI assistant           |
| POST   | `/kanjiTeacher` | Kanji learning AI assistant             |

### **Dictionary** (`/api/dictionary`)

| Method | Endpoint              | Description                        |
| ------ | --------------------- | ---------------------------------- |
| GET    | `/search?word=<term>` | Search Japanese-English dictionary |

### **Word of the Day** (`/api/wordoftheday`)

| Method | Endpoint | Description                            |
| ------ | -------- | -------------------------------------- |
| GET    | `/daily` | Get today's Japanese word with meaning |

### **Roadmaps** (`/api/roadmaps`)

| Method | Endpoint      | Description                  |
| ------ | ------------- | ---------------------------- |
| GET    | `/`           | Get all JLPT study roadmaps  |
| POST   | `/enroll/:id` | Enroll in a specific roadmap |

### **Quiz** (`/api/quiz`)

| Method | Endpoint  | Description                            |
| ------ | --------- | -------------------------------------- |
| GET    | `/:level` | Get quiz for JLPT level (N5, N4, etc.) |
| POST   | `/submit` | Submit quiz answers for grading        |

### **History** (`/api/history`)

| Method | Endpoint | Description                    |
| ------ | -------- | ------------------------------ |
| GET    | `/`      | Get user's interaction history |

---

## 🎨 Frontend Pages & Functions

### **Pages** (`/src/pages`)

#### **Home.jsx** (`/`)

- Displays Word of the Day
- Shows JLPT level progress
- Quick access to all features

#### **Login.jsx** (`/login`)

- User login form
- JWT token storage in localStorage
- Redirects to home on success

#### **Register.jsx** (`/register`)

- New user registration
- Email, name, password fields
- Auto-login after registration
- Password hashed with bcrypt

#### **ForgotPassword.jsx** (`/forgot-password`)

- Two-step password recovery
- Step 1: Enter email to receive OTP
- Step 2: Enter OTP + new password
- OTP valid for 3 minutes with countdown timer
- Resend OTP option after expiry
- Real-time validation

#### **Profile.jsx** (`/profile`)

- View/edit user profile
- Avatar upload
- Account settings

#### **AITeacher.jsx** (`/ai-teacher`)

- Chat interface with AI teacher
- Ask any Japanese learning question
- Real-time responses from LLM

#### **Dictionary.jsx** (`/dictionary`)

- Search Japanese words
- English translations
- Example sentences

#### **ChatNew.jsx** (`/chat`)

- **Key Features:**

  - Real-time messaging with Socket.IO
  - Online/offline status indicators
  - Typing indicators
  - Read receipts
  - Friend system integration
  - Unread message counts
  - Message persistence (works offline)
  - Frontend caching (2min TTL for chats)
  - WhatsApp-style UI with message bubbles
  - Mobile responsive sidebar

- **Tabs:**
  - **Chats:** All conversations sorted by recent
  - **All Users:** Search and add friends
  - **Friends:** Friend list with quick message
  - **Requests:** Accept/reject friend requests

#### **Roadmaps.jsx** (`/roadmaps`)

- Browse JLPT study paths (N5-N1)
- Visual progress tracking
- Enroll in roadmaps

#### **Quiz.jsx** (`/quiz/:level`)

- JLPT practice quizzes
- Instant feedback
- Score tracking

#### **DoubtSolver.jsx** (`/doubt-solver`)

- Specialized AI for clearing doubts
- Grammar/vocab focused help

---

## 🔄 Real-time Features (Socket.IO)

### **Events Emitted by Client:**

- `joinRoom(userId)` - Join personal socket room
- `sendMessage({ from, to, text })` - Send message
- `typing({ from, to })` - Show typing indicator
- `stopTyping({ from, to })` - Hide typing indicator
- `markAsRead({ messageIds, userId })` - Mark messages as read

### **Events Received by Client:**

- `onlineUsers(userIds[])` - List of online users
- `userOnlineStatus({ userId, status })` - User goes online/offline
- `receiveMessage(message)` - New message received
- `userTyping({ userId, isTyping })` - Someone is typing
- `messagesRead({ messageIds })` - Messages were read
- `friendRequest(data)` - New friend request
- `friendRequestAccepted(data)` - Friend request accepted
- `notificationCount({ count })` - Updated notification count

---

## ⚡ Performance Optimizations

### **Backend:**

- ✅ Gzip compression (70% bandwidth reduction)
- ✅ In-memory cache for latest chats (5min TTL)
- ✅ JSON payload limits (10MB)
- ✅ Cache auto-invalidation on new messages
- ✅ Response caching headers

### **Frontend:**

- ✅ Lazy loading routes (React.lazy)
- ✅ Code splitting (40-50% smaller bundles)
- ✅ React.memo on Chat component
- ✅ SessionStorage caching (2min chats, 1min messages)
- ✅ Suspense with loading spinners

---

## 🏁 Quick Start

### **1. Clone Repository**

```bash
git clone https://github.com/Surya2004-janardhan/AI-sensei.git
cd Ai-sensei
```

### **2. Backend Setup**

```bash
cd Backend
npm install
```

Create `.env` file (or copy from `.env.example`):

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
PORT=3000

# Email Configuration for OTP (Gmail)
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_app_specific_password
```

**Gmail App Password Setup:**

1. Enable 2-Factor Authentication on your Gmail
2. Visit: https://myaccount.google.com/apppasswords
3. Generate "App Password" for Mail
4. Use the 16-character password as `EMAIL_PASS`

Start server:

```bash
npm start
```

### **3. Frontend Setup**

```bash
cd Frontend
npm install
```

Update `src/api/axiosInstance.js` baseURL if needed:

```javascript
baseURL: "https://ai-sensei-lej2.onrender.com/api";
```

Start dev server:

```bash
npm run dev
```

### **4. Access Application**

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

---

## 📦 Key Dependencies

### **Backend:**

- `express` - Web framework
- `mongoose` - MongoDB ODM
- `socket.io` - Real-time communication
- `jsonwebtoken` - JWT auth
- `bcryptjs` - Password hashing (salt rounds: 10)
- `nodemailer` - Email service for OTP
- `compression` - Response compression
- `groq-sdk` - AI integration
- `cors` - CORS handling

### **Frontend:**

- `react` - UI library
- `react-router-dom` - Routing
- `socket.io-client` - Socket connection
- `axios` - HTTP requests
- `react-toastify` - Notifications
- `tailwindcss` - Styling

---

## 🔒 Security Features

- JWT-based authentication with 30h expiry
- Password hashing with bcrypt (10 salt rounds)
- OTP-based password reset (3-minute validity)
- Protected routes (middleware)
- Email verification for password recovery
- CORS configured
- XSS protection (disabled x-powered-by)
- Input validation
- Secure socket connections
- Automatic OTP cleanup on expiry

---

## 📱 Responsive Design

- Mobile-first approach
- Collapsible sidebar for chat
- Touch-friendly UI
- Adaptive layouts (sm, md, lg, xl breakpoints)
- Optimized for all devices

---

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

---

## 📧 Contact

**Developer:** Chintala Janardhan  
**Email:** chintalajanardhan2004@gmail.com  
**Repository:** [github.com/Surya2004-janardhan/AI-sensei](https://github.com/Surya2004-janardhan/AI-sensei)

---

## 📄 License

Educational project for Japanese language learning. All rights reserved.

---

> "千里の道も一歩から"  
> _A journey of a thousand miles begins with a single step._

**Start your Japanese mastery now, with AI Sensei!**
