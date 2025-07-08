# 🛒 GradKart Marketplace

A modern, full-stack marketplace application built with Next.js and Express, deployed on Railway.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Local Development

```bash
# Clone the repository
git clone https://github.com/yourusername/gradkart-marketplace.git
cd gradkart-marketplace

# Install all dependencies
npm run install:all

# Start development servers
npm run dev
```

This will start:
- **Frontend**: http://localhost:3000 (Next.js)
- **Backend**: http://localhost:5000 (Express)

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🏗️ Project Structure

```
gradkart-marketplace/
├── client/                 # Next.js frontend
│   ├── app/               # App router pages
│   ├── components/        # React components
│   ├── lib/              # Utility functions
│   ├── hooks/            # Custom React hooks
│   ├── context/          # React context providers
│   ├── styles/           # Global styles
│   └── public/           # Static assets
├── server/               # Express backend
│   ├── src/
│   │   └── index.js      # Main server file
│   └── package.json
├── package.json          # Root monorepo config
├── railway.json         # Railway deployment config
└── DEPLOYMENT.md        # Deployment guide
```

## 🛠️ Tech Stack

### Frontend (client/)
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible components
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Leaflet** - Maps integration

### Backend (server/)
- **Express.js** - Node.js web framework
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security headers
- **Compression** - Response compression

### Deployment
- **Railway** - Hosting platform
- **GitHub** - Version control
- **NIXPACKS** - Build system

## 📱 Features

- 🏠 **Home Page** - Landing page with location selection
- 📍 **Location Management** - Address selection and storage
- 👤 **User Profiles** - Student profiles with avatars
- 🛒 **Marketplace** - Product browsing and search
- 📱 **Mobile Responsive** - Works on all devices
- 🗺️ **Map Integration** - Leaflet maps with OpenStreetMap
- 🔐 **Security** - CORS, Helmet, and best practices

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy to Railway

1. Push to GitHub
2. Connect Railway to your repo
3. Set root directory to `/server`
4. Add environment variables
5. Deploy!

Your app will be live at: `https://your-app.up.railway.app`

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# CORS Origins
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5000

# Next.js Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📊 API Endpoints

- `GET /api/health` - Health check
- `GET /api/hello` - Example endpoint

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Kill process on port 5000
   npx kill-port 5000
   ```

2. **Build fails**
   ```bash
   # Clean and reinstall
   npm run clean
   npm run install:all
   ```

3. **CORS errors**
   - Check `ALLOWED_ORIGINS` in environment variables
   - Ensure frontend and backend ports match

### Development Commands

```bash
# Install dependencies
npm run install:all

# Start development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Clean all
npm run clean
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/gradkart-marketplace/issues)
- **Documentation**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Railway Docs**: https://docs.railway.app

---

**Built with ❤️ for the GradKart community** 