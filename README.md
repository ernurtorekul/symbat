# Smart Consultant - Cosmetic Product Recommendation Platform

A personalized cosmetic product recommendation platform that helps users find the most suitable beauty products based on their individual skin characteristics, preferences, and sensitivities.

## Features

- **Personalized Quiz**: Short assessment for skin type, tone, concerns, and allergies
- **Dual Browsing Modes**:
  - General Mode: Explore all products with filters
  - Personal Mode: AI-curated recommendations based on skin profile
- **AI Chat Assistant**: Product recommendations, ingredient explanations, and skincare advice
- **Comprehensive Product Database**: Integration with public cosmetology APIs

## Tech Stack

### Frontend
- React with TypeScript
- Vite (build tool)
- TailwindCSS (styling)

### Backend
- NestJS with TypeScript
- PostgreSQL (database)
- TypeORM (ORM)
- JWT Authentication
- OpenAI API integration

### External APIs
- Open Beauty Facts API (product database)
- OpenAI API (AI recommendations)

## Project Structure

```
smart-consultant/
├── backend/          # NestJS backend application
├── frontend/         # React frontend application
├── docs/            # Project documentation
└── README.md        # This file
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smart-consultant
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Database Setup**
   - Create PostgreSQL database
   - Configure environment variables

5. **Environment Configuration**
   - Create `.env` files in both backend and frontend
   - Add required API keys and database credentials

### Running the Application

1. **Start Backend**
   ```bash
   cd backend
   npm run start:dev
   ```

2. **Start Frontend**
   ```bash
   cd frontend
   npm run dev
   ```

## API Integration

### Supported Cosmetology APIs
- Open Beauty Facts (primary)
- Sephora API (unofficial)
- Ulta Beauty API (unofficial)
- CosDNA API (ingredient analysis)

## Development

### Scripts

**Backend:**
- `npm run start:dev` - Start in development mode
- `npm run build` - Build for production
- `npm run test` - Run tests

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.