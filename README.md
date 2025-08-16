# CogniSite AI - AI-Powered Website Analysis & Content Generation

Transform your website content with intelligent AI analysis and professional content generation. CogniSite AI analyzes your website structure, identifies improvement opportunities, and generates compelling content for every section.

## 🚀 Features

- **Real-Time Website Analysis** - AI-powered scraping and content analysis using OpenAI GPT-4
- **Intelligent Content Generation** - Generate professional website copy tailored to your brand
- **Interactive Chat Interface** - Collaborate with AI to refine and improve your content
- **Project Management** - Save, organize, and track multiple website analysis projects
- **User Authentication** - Secure user accounts with Supabase authentication
- **Comprehensive Error Handling** - Robust error management with user-friendly messages
- **Modern UI/UX** - Beautiful, responsive interface built with React and TailwindCSS

## 📋 Prerequisites

- Node.js (v16.x or higher)
- npm or yarn
- OpenAI API account with API key
- Supabase account and project

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Sandyen12/cognisite_ai.git
cd cognisite_ai
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

The project includes a pre-configured `.env` file with working API keys for development. For production, replace with your own keys:

```bash
# CogniSite AI - Environment Configuration
# These are working API keys for development and testing

# Supabase Configuration (Working)
VITE_SUPABASE_URL=https://dfjzclljojsnbdirswde.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# OpenAI Configuration (Working)
VITE_OPENAI_API_KEY=your-openai-api-key

# Additional AI Services (Optional)
VITE_GEMINI_API_KEY=your-gemini-api-key-here
VITE_ANTHROPIC_API_KEY=your-anthropic-api-key-here

# Application Configuration
VITE_APP_NAME=CogniSite AI
VITE_APP_VERSION=1.0.0
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_ERROR_REPORTING=true
```

### 4. Database Setup

The Supabase database schema is already configured. The migration file is located at:
`supabase/migrations/20250116021500_website_analysis_platform.sql`

If you're using your own Supabase instance, run this migration to set up the required tables:

- `user_profiles` - User account information
- `projects` - Website analysis projects
- `website_sections` - Analyzed website sections
- `chat_messages` - AI chat conversations
- `generated_content` - AI-generated content
- `user_statistics` - User activity statistics

### 5. Start the Application

```bash
npm start
```

The application will be available at `http://localhost:5173`

## 🔧 Configuration Status

Visit `/setup-status` in your browser to check the configuration status and troubleshoot any issues:

- **System Status Check** - Verify all services are connected
- **Database Migration Status** - Check if all tables are properly set up
- **API Connection Tests** - Test OpenAI and Supabase connections
- **Configuration Validation** - Identify missing or invalid settings
- **Error Log Monitoring** - View recent errors and their solutions

## 🎯 Usage Guide

### 1. Website Analysis

1. Navigate to the landing page
2. Click "Get Started" or "Analyze Website"
3. Enter a website URL (e.g., `https://example.com`)
4. Watch the AI analyze the website in real-time
5. Review the generated insights and recommendations

### 2. Content Generation

1. From the project workspace, select a website section
2. Use the chat interface to request specific content
3. Provide context about your brand, tone, and requirements
4. Review and refine the AI-generated content
5. Copy the final content for use on your website

### 3. Project Management

- **Dashboard** - View all your analysis projects
- **Filters** - Sort by status, date, or search by name
- **Bulk Actions** - Delete multiple projects at once
- **Statistics** - Track your usage and activity

## 🏗️ Project Structure

```
cognisite_ai/
├── public/             # Static assets
├── src/
│   ├── components/     # Reusable UI components
│   │   └── ui/        # Base UI components (Button, Input, etc.)
│   ├── contexts/      # React contexts (Auth, Theme)
│   ├── lib/           # External service configurations
│   │   ├── openai.js  # OpenAI API client
│   │   └── supabase.js # Supabase client
│   ├── pages/         # Application pages
│   │   ├── landing-page/
│   │   ├── user-dashboard/
│   │   ├── project-workspace/
│   │   ├── website-analysis-loading/
│   │   ├── auth/
│   │   └── setup-status/
│   ├── services/      # Business logic services
│   │   ├── projectService.js
│   │   ├── chatService.js
│   │   ├── websiteAnalysisService.js
│   │   ├── errorHandlingService.js
│   │   └── configService.js
│   ├── styles/        # Global styles and Tailwind config
│   ├── utils/         # Utility functions
│   ├── App.jsx        # Main application component
│   ├── Routes.jsx     # Application routes
│   └── index.jsx      # Application entry point
├── supabase/
│   └── migrations/    # Database schema migrations
├── .env               # Environment variables
├── package.json       # Dependencies and scripts
├── tailwind.config.js # Tailwind CSS configuration
└── vite.config.js     # Vite configuration
```

## 🔌 API Integration

### OpenAI Integration

The application uses OpenAI's GPT-4 model for:
- Website content analysis
- Section-specific content generation
- Interactive chat responses
- SEO recommendations

**Key Features:**
- Automatic retry logic with exponential backoff
- Fallback responses when API is unavailable
- Token usage optimization
- Error handling with user-friendly messages

### Supabase Integration

Supabase provides:
- User authentication and authorization
- Real-time database operations
- Row Level Security (RLS) policies
- Automatic user profile creation

**Database Schema:**
- Comprehensive relational design
- Optimized indexes for performance
- Trigger-based automation
- Mock data for development

## 🛡️ Error Handling

The application includes comprehensive error handling:

### Error Categories
- **Network Errors** - Connection and timeout issues
- **Authentication Errors** - Login and permission issues  
- **API Errors** - OpenAI and external service failures
- **Database Errors** - Supabase connection issues
- **Analysis Errors** - Website scraping failures
- **Validation Errors** - Input and data validation

### Error Recovery
- Automatic retry for transient errors
- Fallback responses for API failures
- User-friendly error messages
- Suggested recovery actions
- Error logging and monitoring

## 🚀 Deployment

### Development
```bash
npm start
```

### Production Build
```bash
npm run build
npm run serve
```

### Environment Variables for Production
Ensure all environment variables are properly set:
- Replace development API keys with production keys
- Update Supabase URL to your production instance
- Configure analytics and monitoring services
- Set appropriate CORS policies

## 🔍 Troubleshooting

### Common Issues

**1. OpenAI API Errors**
- Verify your API key is valid and has sufficient credits
- Check if you've exceeded rate limits
- Ensure your API key has access to GPT-4

**2. Supabase Connection Issues**
- Verify your Supabase project is active
- Check if RLS policies are properly configured
- Ensure database migrations have been applied

**3. Website Analysis Failures**
- Some websites block automated scraping
- CORS policies may prevent direct access
- Try different website URLs for testing

**4. Build Issues**
- Clear node_modules and reinstall dependencies
- Check Node.js version compatibility
- Verify all environment variables are set

### Getting Help

1. Check the `/setup-status` page for configuration issues
2. Review the error log for detailed error information
3. Verify all API keys and configuration settings
4. Check the browser console for JavaScript errors

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/) and [Vite](https://vitejs.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Powered by [OpenAI](https://openai.com/) and [Supabase](https://supabase.com/)
- Icons by [Lucide React](https://lucide.dev/)

---

**CogniSite AI** - Transform your website content with the power of artificial intelligence. 🚀
