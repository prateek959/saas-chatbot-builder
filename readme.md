# 🤖 VectorChat AI - SaaS Chatbot Builder

[![GitHub](https://img.shields.io/badge/GitHub-prateek959/saas--chatbot--builder-blue?logo=github&style=flat-square)](https://github.com/prateek959/saas-chatbot-builder)
[![Backend Deployment](https://img.shields.io/badge/Backend-Railway-blue?logo=railway&style=flat-square)](https://saas-chatbot-builder-production.up.railway.app)
[![Frontend Deployment](https://img.shields.io/badge/Frontend-Vercel-green?logo=vercel&style=flat-square)](https://saas-chatbot-builder.vercel.app)

A powerful, modern SaaS platform for building AI-powered chatbots without any coding. Upload your documents, create intelligent chatbots powered by Google Gemini AI, and embed them anywhere on the web.

---

## 🌟 Overview

**VectorChat AI** is an enterprise-grade chatbot builder that leverages cutting-edge AI technology to help businesses, creators, and developers build intelligent conversational systems. Whether you're looking to provide customer support, enhance user engagement, or create knowledge-based assistants, VectorChat AI makes it simple and affordable.

### Why VectorChat AI?

- **⚡ No-Code Solution**: Build powerful AI chatbots without writing a single line of code
- **🔐 Secure & Scalable**: Built with enterprise-grade security and horizontal scalability in mind
- **🧠 Advanced AI Integration**: Powered by Google's Gemini AI with vector embeddings for intelligent responses
- **📄 Multi-Document Support**: Upload PDFs, Word documents, and text files to train your chatbot
- **⚡ Real-Time Processing**: Queue-based architecture for fast document processing and response generation
- **🌐 Easy Embedding**: Generate ready-to-use widget code to embed your chatbot anywhere
- **👥 User Management**: Secure authentication with JWT tokens and encrypted passwords
- **💾 Conversation Memory**: Track and manage conversation history with session persistence

---

## ✨ Key Features

### 1. **Intelligent Chatbot Creation**
- Create multiple chatbots from different knowledge sources
- Upload and process documents automatically
- AI-powered responses based on your custom knowledge base
- Semantic search using vector embeddings for accurate answers

### 2. **Document Management**
- Support for multiple document formats:
  - 📄 PDF files
  - 📝 Word documents (.docx)
  - 📋 Text files
- Automatic text extraction and chunking
- Efficient vector embedding generation
- Smart processing queue for handling large documents

### 3. **Advanced AI Capabilities**
- **Google Gemini Integration**: Leverage state-of-the-art AI models
- **Vector Embeddings**: Semantic understanding of your content
- **Cosine Similarity Search**: Find the most relevant content pieces
- **Intelligent Response Generation**: Context-aware answers based on your documents
- **Conversation Memory**: Maintains chat history within sessions

### 4. **Widget Generation & Embedding**
- Auto-generate embedding code for your website
- Customizable chat widget
- Easy integration with any web platform
- API key-based access for security

### 5. **User Dashboard**
- Intuitive interface to manage all chatbots
- Real-time bot status monitoring
- Conversation analytics
- Chat testing interface
- Quick access to embedding codes

### 6. **Authentication & Security**
- Secure user registration and login
- JWT-based authentication
- Argon2 password hashing
- User session management
- API key generation and management

### 7. **Conversation Management**
- Track all conversations per bot and session
- View conversation history
- User-bot message logging
- Session-based chat tracking

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js (v16+)
- **Framework**: Express.js v5.2.1
- **Database**: MongoDB with Mongoose v9.2.0
- **Authentication**: JWT v9.0.3 + Argon2 v0.44.0
- **AI/ML**: Google Gemini API (@google/genai v1.41.0)
- **File Processing**: Multer v2.0.2, Mammoth v1.11.0 (DOCX), pdf-parse v1.1.4
- **Task Queue**: Node-Cron v4.2.1 for background job processing
- **API**: RESTful API with CORS v2.8.6

### Frontend
- **Framework**: React v19.2.0
- **Build Tool**: Vite v7.2.4
- **Styling**: Tailwind CSS v4.1.18
- **Routing**: React Router DOM v7.13.0
- **HTTP Client**: Axios v1.13.5
- **Package Manager**: npm

### DevOps & Deployment
- **Backend Hosting**: Railway.app
- **Version Control**: Git & GitHub
- **Development**: Nodemon for auto-reload

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Google Gemini API key
- npm or yarn

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
echo "MONGODB_URI=your_mongodb_uri" > .env
echo "JWT_SECRET=your_secret_key" >> .env
echo "GEMINI_API_KEY=your_gemini_api_key" >> .env
echo "PORT=3004" >> .env

# Start development server
npm run dev
```

### Full Application Setup

```bash
# Clone the repository
git clone https://github.com/prateek959/saas-chatbot-builder.git
cd saas-chatbot-builder

# Backend Setup
cd backend
npm install
# Create .env file with required variables (see Configuration section)
npm run dev

# Frontend Setup (in a new terminal)
cd ../frontend
npm install
npm run dev

# Access the application
# Frontend: http://localhost:5173
# Backend: http://localhost:3004
```

---

## 📋 Installation & Configuration

### 1. Backend Configuration

Create a `.env` file in the `backend` directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vectorchat

# JWT Configuration
JWT_SECRET=your_very_secure_jwt_secret_key

# Google Gemini API
GEMINI_API_KEY=your_google_gemini_api_key

# Server Configuration
PORT=3004
NODE_ENV=development

# CORS Settings
CORS_ORIGIN=http://localhost:5173
```

### 2. Frontend Configuration

The frontend automatically connects to the backend via API endpoints. Configure API base URL in your frontend environment if needed.

### 3. Database Setup

MongoDB collections are automatically created via Mongoose schemas:
- `users` - User accounts
- `bots` - Chatbot configurations
- `chunks` - Document chunks with embeddings
- `conversations` - Chat history
- `queues` - Processing queue jobs

---

## 📊 Project Architecture

```
VectorChat AI/
├── backend/
│   ├── config/
│   │   └── connection.js          # Database connection
│   ├── controllers/
│   │   ├── auth.controller.js     # Authentication logic
│   │   ├── bot.delete.controller.js
│   │   ├── bot.response.controller.js
│   │   ├── checkBot.controller.js
│   │   ├── conversation.controller.js
│   │   ├── docupload.controller.js
│   │   └── getscript.controller.js
│   ├── middleware/
│   │   └── auth.middleware.js     # JWT authentication middleware
│   ├── models/
│   │   ├── chatbot.model.js       # Chatbot schema
│   │   ├── chunk.model.js         # Document chunks schema
│   │   ├── conversation.schema.js # Conversation schema
│   │   ├── queue.schema.js        # Processing queue schema
│   │   └── user.model.js          # User schema
│   ├── public/
│   │   └── widget.js              # Embeddable chat widget
│   ├── routes/
│   │   ├── auth.routes.js         # Authentication routes
│   │   ├── bot.routes.js          # Chatbot management routes
│   │   └── conversation.schema.js # Conversation routes (misnamed, should be .routes.js)
│   ├── service/
│   │   ├── gemini.embedding.js    # Vector embedding service
│   │   └── gemini.service.js      # Gemini AI service
│   ├── utils/
│   │   ├── resumeparser.js        # Resume parsing utility
│   │   └── upload.js              # File upload utility
│   ├── workers/
│   │   └── queue.worker.js        # Background job processor
│   ├── server.js                  # Main server file
│   ├── package.json
│   └── .env                       # Environment variables
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── api/                   # API integration
    │   ├── assets/                # Static assets
    │   ├── auth/
    │   │   ├── Login.jsx          # Login component
    │   │   └── Signup.jsx         # Signup component
    │   ├── components/
    │   │   └── Sidebar.jsx        # Sidebar component
    │   ├── pages/
    │   │   ├── CreateBot.jsx      # Bot creation page
    │   │   ├── Dashboard.jsx      # Main dashboard
    │   │   ├── GetScript.jsx      # Widget code page
    │   │   └── TestBot.jsx        # Bot testing interface
    │   ├── App.jsx                # Main app component
    │   ├── main.jsx               # App entry point
    │   ├── App.css
    │   └── index.css
    ├── package.json
    ├── vite.config.js
    └── eslint.config.js
```

### Data Flow

```
Document Upload → Text Extraction → Chunking → 
Embedding Generation → Vector Storage → 
User Query → Embedding Search → 
Relevant Context Retrieval → AI Response → 
Conversation Logging
```

---

## 🔌 API Endpoints

### Authentication (`/user`)
- `POST /user/register` - User registration
- `POST /user/login` - User login

### Chatbot Management (`/bot`)
- `POST /bot/upload` - Upload document for chatbot training
- `POST /bot/test` - Test chatbot with a message
- `GET /bot/script` - Get embedding script for chatbot
- `POST /bot/ask` - Send message to chatbot (public endpoint)
- `POST /bot/add` - Add additional training data to the chatbot
- `DELETE /bot/delete` - Delete chatbot

### Conversations (`/conversation`)
- `GET /conversation/history` - Get conversation history

### Widget
- `GET /widget.js` - Get embeddable widget code (public)

---

## 🎯 Use Cases

1. **Customer Support**
   - 24/7 automated customer service
   - FAQ automation
   - Ticket triaging

2. **Knowledge Management**
   - Internal documentation assistant
   - Employee training chatbots
   - Company policy explainer

3. **E-Learning**
   - Course content assistant
   - Study helper
   - Interactive learning experience

4. **Lead Generation**
   - Website visitor engagement
   - Automated qualification
   - Product inquiry handling

5. **Healthcare**
   - Patient information assistant
   - Appointment scheduling helper
   - Health education bot

6. **HR & Recruitment**
   - Resume parser assistant
   - Job description explainer
   - Candidate FAQ handler

---

## 📦 Features in Detail

### Smart Document Processing
- Automatic text extraction from multiple file formats
- Intelligent chunking with overlap for context preservation
- Batch processing for efficiency
- Queue-based processing for reliability

### Vector Embeddings
- Google Gemini-powered embeddings
- Semantic similarity search
- Fast retrieval of relevant content
- Scalable embedding storage

### AI Response Generation
- Context-aware responses
- Multiple document reference handling
- Conversation memory integration
- Customizable response behavior

### Session Management
- Unique session IDs for each conversation
- Conversation history tracking
- User session isolation
- Persistent chat context

---

## 🔐 Security Features

- **Password Security**: Argon2 hashing algorithm
- **Authentication**: JWT with secure token generation
- **API Keys**: User-specific API keys for chatbot integration
- **CORS**: Configurable CORS for secure cross-origin requests
- **Environment Variables**: Sensitive data in .env files
- **Database Security**: MongoDB Atlas with IP whitelisting option

---

## 📈 Performance Optimizations

1. **Caching**: Conversation caching for repeated queries
2. **Queue Processing**: Background job processing with cron jobs
3. **Batch Embeddings**: Efficient batch processing of document chunks
4. **Vector Search**: Fast cosine similarity calculations

---

## 🚢 Deployment

### Backend Deployment (Railway)

The backend is deployed on Railway.app at: `https://saas-chatbot-builder-production.up.railway.app`

**Deployment Steps:**
1. Push code to GitHub
2. Connect Railway to GitHub repository
3. Configure environment variables in Railway dashboard
4. Railway automatically builds and deploys

### Frontend Deployment

The frontend is deployed on Vercel at: `https://saas-chatbot-builder.vercel.app`

**Deployment Options:**
- Vercel
- Netlify
- Railway
- GitHub Pages
- AWS S3 + CloudFront

---

## 📝 Usage Example

### Creating a Chatbot

```bash
1. Sign up for VectorChat AI
2. Go to Dashboard
3. Click "Create New Bot"
4. Upload your document (PDF, DOCX, or TXT)
5. Wait for processing (1-5 minutes depending on document size)
6. Test your bot in the testing interface
7. Copy the embedding code
8. Paste it on your website
9. Your chatbot is live!
```

### Embedding on Website

```html
<div id="vectorchat-widget"></div>
<script src="https://saas-chatbot-builder-production.up.railway.app/widget.js" 
        data-bot-id="YOUR_BOT_ID"
        data-api-key="YOUR_API_KEY"></script>
```

---

## 🤝 Contributing

We welcome contributions! Please feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code structure
- Write clear commit messages
- Test your changes thoroughly
- Update documentation as needed

---

## � Troubleshooting

### Common Issues

**Backend Connection Issues:**
- Ensure MongoDB is running and connection string is correct
- Check that all environment variables are set in `.env`
- Verify Google Gemini API key is valid

**Frontend Build Issues:**
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version (v16+ required)
- Ensure backend is running on port 3004

**Document Upload Problems:**
- Check file size limits
- Ensure supported formats (PDF, DOCX, TXT)
- Verify upload directory permissions

**Authentication Errors:**
- Clear browser localStorage/cookies
- Check JWT_SECRET consistency
- Verify user credentials

### Development Tips

- Use `npm run dev` for auto-reload during development
- Check browser console and server logs for errors
- Test API endpoints with tools like Postman or curl
- Monitor MongoDB for data consistency

---

## �🐛 Known Limitations & Future Improvements

### Current Limitations
- Document size limited to processing capacity
- Single language support (English)

### Upcoming Features
- 🌍 Multi-language support
- 🎨 Custom branding for widgets
- 📊 Advanced analytics dashboard
- 🔄 Conversation export
- 🎯 Advanced targeting & personalization
- 🔗 CRM & Email integration
- 📱 Mobile app
- 🎓 Custom training models

---

## 📞 Support & Contact

- **GitHub Issues**: [Report bugs and request features](https://github.com/prateek959/saas-chatbot-builder/issues)
- **GitHub Repository**: [VectorChat AI](https://github.com/prateek959/saas-chatbot-builder)
- **Backend API**: [https://saas-chatbot-builder-production.up.railway.app](https://saas-chatbot-builder-production.up.railway.app)

---

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- Google Gemini API for powerful AI capabilities
- MongoDB for reliable data storage
- Railway.app for seamless deployment
- React & Vite communities for excellent tools

---

## 🎯 Roadmap

- **Phase 1** ✅ Core chatbot creation and embedding
- **Phase 2** 🔄 Analytics and conversation tracking
- **Phase 3** 🔜 Multi-language and custom training
- **Phase 4** 🔜 Enterprise features and integrations

---

**Made with ❤️ by [Prateek](https://github.com/prateek959)**

---

### Quick Links
- 🌐 [Live Demo](https://saas-chatbot-builder.vercel.app)
- 📚 [Documentation](#) - *Coming Soon*
- 🚀 [Get Started](#quick-start)
- 💬 [Report Issues](https://github.com/prateek959/saas-chatbot-builder/issues)
