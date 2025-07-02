# Smart Inventory System

A modern, AI-powered inventory management system built with React, TypeScript, and advanced features.

## 🚀 Features

- **Real-time Inventory Management** - Add, track, and manage inventory items
- **AI-Powered Insights** - Get intelligent recommendations and analytics
- **Voice Assistant** - Control the system with voice commands
- **Fruit Freshness Detection** - AI-powered image classification for fruit quality
- **Financial Reports** - Generate invoices, purchase orders, and cost analysis
- **Advanced Analytics** - Interactive charts and data visualization
- **News Integration** - Stay updated with business and technology news
- **Import/Export** - Support for CSV, Excel, and JSON formats

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Animations**: Framer Motion
- **Charts**: Recharts
- **AI**: Google Gemini AI, TensorFlow.js
- **Authentication**: Firebase Auth
- **Voice**: Web Speech API
- **Build Tool**: Vite

## 🌐 Live Demo

🔗 **[View Live Application](https://your-app-name.vercel.app)**

## 📦 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd smart-inventory-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Fill in your API keys in the `.env` file

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open browser**
   Navigate to `http://localhost:5173`

## 🔧 Environment Variables

Create a `.env` file with the following variables:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Google Gemini AI API Key
VITE_GEMINI_API_KEY=your_gemini_api_key

# Backend API URL (optional)
VITE_API_BASE_URL=http://localhost:8080
```

## 🚀 Deployment on Vercel

### Automatic Deployment

1. **Connect to Vercel**
   - Fork this repository
   - Connect your GitHub account to Vercel
   - Import the project

2. **Set Environment Variables**
   In your Vercel dashboard, add all the environment variables from `.env.example`

3. **Deploy**
   Vercel will automatically build and deploy your application

### Manual Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Application pages
├── services/           # API and business logic
├── contexts/           # React contexts
├── styles/             # Global styles
└── utils/              # Utility functions

public/
├── models/             # AI model files
└── assets/             # Static assets
```

## 🎯 Key Features

### Voice Assistant
- Natural language processing
- Navigation commands
- Inventory queries
- System control

### AI Fruit Detection
- TensorFlow.js model integration
- Real-time image classification
- Quality assessment recommendations

### Financial Management
- Invoice generation
- Purchase order creation
- Cost analysis reports
- Tax calculations

### Analytics Dashboard
- Real-time metrics
- Interactive charts
- Trend analysis
- Export capabilities

## 🔒 Security Features

- Firebase Authentication
- Protected routes
- Input validation
- XSS protection
- Content Security Policy

## 🎨 Design System

- **Typography**: Inter font family
- **Colors**: Tailwind CSS color palette
- **Components**: Custom design system
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage
```

## 📈 Performance

- **Lighthouse Score**: 95+
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Cumulative Layout Shift**: < 0.1

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Firebase](https://firebase.google.com/)
- [Google AI](https://ai.google.dev/)
- [TensorFlow.js](https://www.tensorflow.org/js)

## 📞 Support

For support, email [your-email@domain.com] or create an issue on GitHub.

---

**Built with ❤️ using modern web technologies**