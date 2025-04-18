# BarakahBot: Revolutionizing Zakat Collection and Distribution

BarakahBot is a modern, user-friendly platform designed to streamline the collection and distribution of Zakat funds through an intelligent chatbot interface. Built for the Islamic fintech space, our solution makes charitable giving more accessible, transparent, and efficient.

## Project Overview

Zakat, the Islamic practice of almsgiving, is a vital pillar of faith that requires Muslims to donate a portion of their wealth to those in need. BarakahBot simplifies this process by providing:

- An AI-powered Zakat calculator
- Seamless payment processing with multiple options
- Campaign-based fund allocation
- User account management
- Transparent donation tracking

This project was developed for the UNIKL Hackathon 2025, addressing the challenge of digitizing traditional Islamic financial practices.

## Key Features

- **ZakatBot**: Interactive chatbot for calculating Zakat obligations
- **Smart Campaigns**: Target your donations to specific causes
- **Multi-payment Options**: Support for credit cards, bank transfers (FPX), and e-wallets (GrabPay, Alipay)
- **User Dashboard**: Track donations and upcoming payment schedules
- **Seamless Authentication**: Secure login and registration with email verification

## Technical Architecture

### Frontend

The frontend is built with Next.js 14 using the App Router and TypeScript, styled with Tailwind CSS. The UI components leverage the Shadcn UI library for a consistent and modern interface.

### Backend

The backend utilizes Next.js API routes with TypeScript for server-side processing. Appwrite handles user authentication, session management, and database operations. Stripe integration enables secure payment processing with webhook support.

### AI Integration

The ZakatBot calculator connects to OpenRouter AI services for intelligent calculation and conversational interactions.

## Module Breakdown

### Authentication (`src/app/api/auth/`)

Our authentication system uses Appwrite for secure user management with custom API routes for:

- Registration (`/register`): User creation with automatic verification emails
- Login (`/login`): Secure session creation with JWT tokens
- Verification (`/verify-email`): Email confirmation flow
- Session Management (`/me`, `/logout`): User session handling

The auth context (`src/context/AuthContext.tsx`) provides application-wide access to authentication state and methods.

### Payment Processing (`src/app/api/checkout-session/` & `src/app/api/webhook/`)

The payment system integrates Stripe for secure transactions with:

- Dynamic checkout session creation
- Multi-payment method support (cards, bank transfers, e-wallets)
- Custom payment configuration
- Webhook handling for payment event processing
- Automatic donation recording in Appwrite database

### ZakatBot (`src/components/zakatbot/`)

The core calculation and interaction engine includes:

- `ZakatBot.tsx`: Main component orchestrating the bot experience
- `ChatInterface.tsx`: Conversational UI with message history
- `Calculator.tsx`: Mathematical engine for Zakat calculations
- Integration with OpenRouter AI for natural language processing

### Dashboard (`src/app/dashboard/`)

The user dashboard provides:

- Donation history visualization
- Campaign tracking and management
- Payment schedules and reminders
- Profile management

### Campaign Management

The campaign system allows targeted fund collection with:

- Campaign creation and management
- Progress tracking
- Deadline monitoring
- Cause-specific donation allocation

## Setup Instructions

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/barakahbot.git
   cd barakahbot
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Configure environment variables
   Create a `.env.local` file with the following:
   ```
   OPENROUTER_API_KEY=your_openrouter_key
   NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_appwrite_project_id
   NEXT_PUBLIC_APPWRITE_ENDPOINT=your_appwrite_endpoint
   APPWRITE_API_KEY=your_appwrite_api_key
   NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_appwrite_db
   MAILGUN_API_KEY=your_mailgun_key
   MAILGUN_DOMAIN=your_domain
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your_stripe_public_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_webhook_secret
   STRIPE_PAYMENT_METHOD_CONFIGURATION=your_payment_config_id
   ```

4. Run the development server
   ```bash
   npm run dev
   ```

5. Set up Stripe webhook forwarding (for local testing)
   ```bash
   stripe listen --forward-to localhost:3000/api/webhook
   ```

## Database Structure

### Collections

- **Users**: User profiles and authentication data
- **Donation_History**: Record of all transactions with payment status
- **Campaigns**: Active fundraising initiatives
- **Messages**: Chat history for ZakatBot interactions

## Deployment

The application is deployed on Vercel with automatic CI/CD integration. The Appwrite backend is hosted on a custom server for data sovereignty and compliance with Islamic finance regulations.

## Team

Developed by Team Sigma Bois:
- Nur Aiman - Full Stack Engineer

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

*BarakahBot: Making Zakat simple, secure, and impactful.*