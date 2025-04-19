# BarakahBot: Revolutionizing Zakat Collection and Distribution

**Project for UM Hackathon 2025**

BarakahBot is an innovative platform designed to modernize and simplify the process of Zakat collection and distribution using technology. Our solution leverages an intuitive chatbot interface and robust backend services to make charitable giving more accessible, transparent, and efficient for the Muslim community in Malaysia.

## Problem Statement

Zakat, a fundamental pillar of Islam, often involves manual calculations and traditional collection methods that can be cumbersome and lack transparency. Donors may find it difficult to accurately calculate their Zakat obligations and track how their contributions are utilized. BarakahBot addresses these challenges by providing a digital, intelligent, and transparent platform for Zakat management.

## Our Solution

BarakahBot offers a comprehensive digital ecosystem for Zakat, featuring:

1.  **ZakatBot**: An AI-powered conversational agent that guides users through Zakat calculations and answers related Fiqh questions.
2.  **Seamless Payment Integration**: Multiple secure payment options tailored for the Malaysian context (FPX, cards, e-wallets).
3.  **Campaign-Based Donations**: Allowing users to contribute to specific, verified charitable campaigns.
4.  **User Dashboard**: A personalized space for users to manage their profile, track donation history, and view campaign progress.
5.  **Secure Authentication**: Robust user account management with email verification.
6.  **Transparency**: Recording and displaying donation history.

## Key Features

*   **AI-Powered Zakat Calculation**: Interact with ZakatBot to easily calculate your Zakat obligations based on your assets.
*   **Guided Fiqh Assistance**: Get answers to common questions about Zakat, Sadaqah, and Waqf directly from ZakatBot.
*   **Multi-Payment Gateway**: Support for various payment methods via Stripe, including local Malaysian options.
*   **Verified Campaigns**: Donate to vetted charitable campaigns with progress tracking.
*   **Personalized Dashboard**: View your donation history, saved campaigns, and manage your profile.
*   **Secure User Accounts**: Register and log in securely with email verification.
*   **Modern UI**: Built with Next.js, Tailwind CSS, and Shadcn UI for a responsive and user-friendly experience.
*   **Smooth Animations**: Enhanced user experience with subtle animations using Framer Motion.

## Technical Architecture

BarakahBot is built as a full-stack application using the Next.js App Router, providing a unified development experience for both frontend and backend.

*   **Frontend**:
    *   **Framework**: Next.js 14 (App Router)
    *   **Language**: TypeScript
    *   **Styling**: Tailwind CSS
    *   **UI Components**: Shadcn UI
    *   **Animations**: Framer Motion
*   **Backend**:
    *   **Framework**: Next.js API Routes
    *   **Language**: TypeScript
    *   **Database & Authentication**: Appwrite (Self-hosted/Cloud)
    *   **Payment Gateway**: Stripe
    *   **Email Service**: Mailgun
    *   **AI Integration**: OpenRouter API

## Module Breakdown


### 1. Authentication & User Management (`src/app/api/auth/`, `src/context/AuthContext.tsx`, `src/middleware.ts`)

This module handles user registration, login, session management, and email verification using Appwrite as the backend-as-a-service.

*   **`/api/auth/register`**:
    *   **Purpose**: Handles new user account creation.
    *   **Functionality**: Receives email, password, and optional name. Uses Appwrite Server SDK (`node-appwrite`) to create a new user. Generates a unique verification token and stores it in the Appwrite database (`email_verifications` collection). Sends a verification email containing a link with the token and user ID via Mailgun.
    *   **Technologies**: Next.js API Route, `node-appwrite`, Mailgun API.
*   **`/api/auth/verify-email`**:
    *   **Purpose**: Handles the email verification process when a user clicks the link in their email.
    *   **Functionality**: Receives user ID and token. Queries the Appwrite database (`email_verifications`) to find a matching, non-expired token. If found, updates the user's `emailVerification` status to `true` in Appwrite using the Server SDK. Deletes the used verification token record.
    *   **Technologies**: Next.js API Route, `node-appwrite`.
*   **`/api/auth/login`**:
    *   **Purpose**: Handles user login with email and password.
    *   **Functionality**: Receives email and password. Uses Appwrite Server SDK to create an email/password session. If successful, it receives a session secret. This secret is then set as a secure HTTP-only cookie (`appwrite-session`) in the browser response.
    *   **Technologies**: Next.js API Route, `node-appwrite`.
*   **`/api/auth/logout`**:
    *   **Purpose**: Handles user logout.
    *   **Functionality**: Clears the secure `appwrite-session` cookie by setting its expiry date to the past. This effectively logs the user out by removing their session identifier from the browser.
    *   **Technologies**: Next.js API Route, Next.js `cookies`.
*   **`/api/auth/me`**:
    *   **Purpose**: Retrieves the currently authenticated user's profile data.
    *   **Functionality**: Reads the `appwrite-session` cookie from the request headers. Initializes an Appwrite Client SDK instance on the server side and sets the session cookie. Attempts to fetch the user's account details (`account.get()`). Returns the user data if the session is valid, or `null` if not. This route is crucial for client-side components to check authentication status.
    *   **Technologies**: Next.js API Route, Next.js `cookies`, `node-appwrite`.
*   **`src/context/AuthContext.tsx`**:
    *   **Purpose**: Provides application-wide access to the current user's authentication state and functions (login, logout, checkSession).
    *   **Functionality**: Uses React Context to manage the `user` state and `isLoading` state. On initial load, it calls `/api/auth/me` to check for an existing session. Provides `login` and `logout` functions that internally call the respective API routes and then update the user state by calling `checkSession`. Ensures components can react to authentication changes without direct API calls.
    *   **Technologies**: React Context, `useState`, `useEffect`, `useContext`, `fetch` API.
*   **`src/middleware.ts`**:
    *   **Purpose**: Protects sensitive routes (like `/dashboard`) by checking for a valid session cookie before allowing access.
    *   **Functionality**: Intercepts incoming requests. Checks if the requested path is a protected route. If so, it looks for the `appwrite-session` cookie. If the cookie exists, it attempts to verify its validity by making an Appwrite session check (using a temporary client instance with the session). If the session is invalid or missing, it redirects the user to the login page and clears the invalid cookie. Also redirects logged-in users away from login/register pages.
    *   **Technologies**: Next.js Middleware, `NextResponse`, `NextRequest`, `node-appwrite`.

### 2. Payment Processing (`src/app/api/checkout-session/route.ts`, `src/app/api/webhook/route.ts`, `src/app/payment-success/page.tsx`, `src/components/zakatbot/ChatInterface.tsx`, `src/lib/stripe-client.ts`)

Manages secure online payments for donations using Stripe, specifically configured for Malaysian Ringgit (MYR).

*   **`/api/checkout-session`**:
    *   **Purpose**: Creates a Stripe Checkout Session on the backend.
    *   **Functionality**: Receives donation `amount`, `userId`, and `campaign` details from the frontend. Uses the Stripe Server SDK (`stripe`) to create a `checkout.sessions.create` call. Configures the session with `myr` currency, the specified amount (converted to cents), product data (campaign name), success and cancel URLs, and metadata (user ID, campaign) for tracking. Uses a pre-configured `payment_method_configuration` for Malaysian payment methods.
    *   **Technologies**: Next.js API Route, Stripe Server SDK.
*   **`/api/webhook`**:
    *   **Purpose**: Receives and processes events from Stripe (webhooks).
    *   **Functionality**: Listens for `checkout.session.completed` events. Verifies the webhook signature using the `STRIPE_WEBHOOK_SECRET` for security. Extracts donation details (user ID, amount, campaign) from the session metadata. Records the successful transaction in the Appwrite database (`donation_history` collection) including amount, currency, timestamp, status ('completed'), and payment method.
    *   **Technologies**: Next.js API Route, Stripe Server SDK, `node-appwrite` (for database).
*   **`src/app/payment-success/page.tsx`**:
    *   **Purpose**: Displays a success message after a user completes payment on Stripe's hosted page and is redirected back.
    *   **Functionality**: Reads the `session_id` from the URL query parameters. Displays a confirmation message. (Optional: Can be enhanced to verify the session ID with the backend for extra security). Provides a link to the user dashboard.
    *   **Technologies**: React, Next.js `useSearchParams`, `useState`.
*   **Payment Initiation in `ChatInterface.tsx`**:
    *   **Purpose**: Triggers the payment flow from the ZakatBot interface.
    *   **Functionality**: When the user clicks "Proceed to Payment" after a Zakat calculation, this component calls the `/api/checkout-session` API route to create a Stripe session. Upon receiving the session ID, it uses the client-side Stripe.js library (`@stripe/stripe-js`) to redirect the user to the Stripe hosted checkout page. Includes checks for user authentication before allowing payment.
    *   **Technologies**: React, `fetch` API, `@stripe/stripe-js`.
*   **`src/lib/stripe-client.ts`**:
    *   **Purpose**: Initializes the client-side Stripe.js library.
    *   **Functionality**: Loads the Stripe.js script and initializes it with the public key (`NEXT_PUBLIC_STRIPE_PUBLIC_KEY`). Provides a promise that resolves to the Stripe object, used for client-side actions like redirecting to checkout.
    *   **Technologies**: `@stripe/stripe-js`.

### 3. ZakatBot (`src/app/zakatbot/page.tsx`, `src/components/zakatbot/ChatInterface.tsx`, `src/components/zakatbot/Calculator.tsx`, `src/components/zakatbot/TypewriterMessage.tsx`, `src/app/api/chat/route.ts`)

The core AI-powered conversational Zakat assistant.

*   **`src/app/zakatbot/page.tsx`**:
    *   **Purpose**: The main page component for the ZakatBot interface.
    *   **Functionality**: Sets page metadata (title, description). Renders the `ChatInterface` component within a centered container. Includes introductory text and a footer specific to the ZakatBot page.
    *   **Technologies**: Next.js Page, React.
*   **`src/components/zakatbot/ChatInterface.tsx`**:
    *   **Purpose**: Manages the chat UI and interaction logic.
    *   **Functionality**: Maintains the chat `messages` state. Handles user input, sends messages to the `/api/chat` API route. Displays bot responses, including a typewriter effect for the latest message. Toggles the visibility of the `Calculator` component. Integrates the "Proceed to Payment" button for calculated Zakat amounts, calling the payment flow.
    *   **Technologies**: React, `useState`, `useEffect`, `useRef`, `useCallback`, `fetch` API, `Calculator` component, `TypewriterMessage` component, `Dialog` component, Stripe payment initiation.
*   **`src/components/zakatbot/Calculator.tsx`**:
    *   **Purpose**: Provides a form for users to input their assets for Zakat calculation.
    *   **Functionality**: Manages the state of different asset types (cash, gold, silver, investments, etc.). Includes hardcoded (or placeholder for dynamic fetch) Nisab values for gold and silver. Calculates the total assets, determines the Nisab threshold, and calculates the Zakat amount (2.5% of total assets if above Nisab). Calls an `onCalculate` callback function (in `ChatInterface`) with the result.
    *   **Technologies**: React, `useState`, form handling, basic arithmetic.
*   **`src/components/zakatbot/TypewriterMessage.tsx`**:
    *   **Purpose**: Displays bot messages with a typing animation.
    *   **Functionality**: Receives `content` as a string. Uses `useState` and `useEffect` to gradually reveal the content character by character with a set `speed`. Uses `ReactMarkdown` to render markdown formatting in the bot's response. Includes a blinking cursor animation.
    *   **Technologies**: React, `useState`, `useEffect`, `useRef`, `setTimeout`, `ReactMarkdown`.
*   **`src/app/api/chat/route.ts`**:
    *   **Purpose**: Acts as a backend proxy for the OpenRouter AI API.
    *   **Functionality**: Receives the `messages` history from the frontend. Constructs a system prompt to define ZakatBot's persona and scope (Islamic topics, Malaysian context, specific formatting rules). Sends the messages to the OpenRouter API using the `OPENROUTER_API_KEY`. Returns the AI's response content back to the frontend. Includes error handling for API failures.
    *   **Technologies**: Next.js API Route, `fetch` API, OpenRouter API.

### 4. Dashboard (`src/app/dashboard/page.tsx`)

Provides a personalized overview for logged-in users.

*   **`src/app/dashboard/page.tsx`**:
    *   **Purpose**: User dashboard page.
    *   **Functionality**: Displays the user's name and email (fetched via `useAuth`). Shows statistics (currently mocked, except for total donations). Fetches and displays the user's donation history from the Appwrite database (`donation_history` collection) using the client-side Appwrite SDK. Displays saved campaigns (currently mocked data). Includes a profile edit modal (form state managed, but update logic is a placeholder). Shows security settings toggles (currently non-functional UI elements).
    *   **Technologies**: React, Next.js Page, `useAuth`, `useState`, `useEffect`, `appwrite-client` (for fetching donations), Shadcn UI components.

### 5. Landing Page & UI Components (`src/app/page.tsx`, `src/components/landing/*`, `src/components/ui/*`, `src/lib/animation-variants.ts`, `src/app/globals.css`, `tailwind.config.ts`)

Responsible for the public-facing website, user interface elements, and visual design.

*   **`src/app/page.tsx`**:
    *   **Purpose**: The main landing page composition.
    *   **Functionality**: Renders various section components (`Hero`, `Features`, `Programs`, `Fundraising`, `Cta`, `Footer`) to build the homepage layout.
    *   **Technologies**: Next.js Page, React.
*   **`src/components/landing/*`**:
    *   **Purpose**: Individual sections of the landing page.
    *   **Functionality**: Structure content, display information, include calls to action, and use UI/animation components.
    *   **Technologies**: React Components, Next.js `Link`, Framer Motion, Shadcn UI components.
*   **`src/components/ui/*`**:
    *   **Purpose**: Reusable UI components based on Shadcn UI primitives and styled with Tailwind CSS.
    *   **Functionality**: Provides consistent styling and behavior for buttons, cards, dialogs, inputs, etc. Includes custom components like `AnimatedCard` and `AnimatedContainer` which wrap Shadcn components with Framer Motion animations using defined `animation-variants`.
    *   **Technologies**: React Components, Radix UI primitives, `class-variance-authority`, `tailwind-merge`, Framer Motion.
*   **`src/lib/animation-variants.ts`**:
    *   **Purpose**: Defines animation configurations (`Variants`) for Framer Motion.
    *   **Functionality**: Specifies `initial`, `animate`, `exit`, `whileHover`, `whileTap` states and transitions for elements like cards and containers, including options for directional animations.
    *   **Technologies**: Framer Motion.
*   **`src/app/globals.css`**:
    *   **Purpose**: Global styles and Tailwind CSS configuration.
    *   **Functionality**: Imports Tailwind directives and custom CSS. Defines CSS variables for colors (including the brand palette) and radii, used by Tailwind and Shadcn components. Includes the blinking cursor animation for the typewriter effect.
    *   **Technologies**: CSS, Tailwind CSS.
*   **`tailwind.config.ts`**:
    *   **Purpose**: Tailwind CSS configuration file.
    *   **Functionality**: Extends the default Tailwind theme with custom colors (the brand palette), font variables, border radii, keyframes, and animations. Includes the `@tailwindcss/typography` plugin for styling markdown content and `tailwindcss-animate` for utility animations.
    *   **Technologies**: JavaScript/TypeScript, Tailwind CSS.

## Setup Instructions

Follow these steps to get BarakahBot running on your local machine.

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/barakahbot.git
    cd barakahbot
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**:
    Create a `.env.local` file in the root of your project. This file will contain the API keys and endpoint URLs for the services used. **Do NOT commit this file to your repository.**

    ```
    # OpenRouter Configuration (for ZakatBot AI)
    OPENROUTER_API_KEY=your_openrouter_key

    # Appwrite Configuration (Database, Auth, Users)
    # Public keys/endpoints are safe to expose in frontend code
    NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_appwrite_project_id
    NEXT_PUBLIC_APPWRITE_ENDPOINT=your_appwrite_endpoint # e.g., https://cloud.appwrite.io/v1 or your self-hosted endpoint

    # Server-side API Key - Keep this secret!
    APPWRITE_API_KEY=your_appwrite_api_key 

    # Appwrite Database ID (for donation history, email verifications, etc.)
    NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_appwrite_db_id # e.g., 'barakah_db'

    # Mailgun Configuration (for sending verification emails)
    MAILGUN_API_KEY=your_mailgun_api_key
    MAILGUN_DOMAIN=your_mailgun_domain # e.g., 'mg.yourdomain.com'

    # Application URL (used for email verification links and Stripe redirects)
    # Use localhost for local development
    NEXT_PUBLIC_APP_URL=http://localhost:3000 

    # Stripe Configuration (for payment processing)
    # Public key is safe to expose in frontend code
    NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your_stripe_public_key 

    # Server-side Secret Key - Keep this secret!
    STRIPE_SECRET_KEY=your_stripe_secret_key 

    # Stripe Webhook Secret (for verifying incoming Stripe events) - Keep this secret!
    STRIPE_WEBHOOK_SECRET=your_webhook_secret 

    # Stripe Payment Method Configuration ID (specific to your Stripe account and country)
    # This ID specifies which payment methods are enabled for checkout
    STRIPE_PAYMENT_METHOD_CONFIGURATION=your_payment_config_id 
    ```
    Replace the placeholder values (`your_...`) with your actual credentials obtained from the respective service providers.

4.  **Set up Appwrite Database Collections**:
    You need to create the following collections in your Appwrite project:
    *   `email_verifications`: To store temporary email verification tokens.
        *   Attributes:
            *   `user_id` (String)
            *   `token` (String)
            *   `expires_at` (DateTime)
        *   Permissions: Read/Write for specific roles or ensure your API key has necessary permissions.
    *   `donation_history`: To record successful donations.
        *   Attributes:
            *   `user_id` (String)
            *   `amount` (Float)
            *   `currency` (String)
            *   `timestamp` (DateTime)
            *   `payment_status` (String, e.g., 'completed')
            *   `payment_method` (String, e.g., 'card', 'bank_transfer', 'e_wallet')
        *   Permissions: Ensure your API key has write permissions. Users might need read permissions for their own documents.

5.  **Set up Stripe Webhook (for local testing)**:
    To receive payment success notifications from Stripe while running locally, you need to use the Stripe CLI to forward webhook events.
    *   Install the Stripe CLI: Follow the instructions [here](https://stripe.com/docs/stripe-cli).
    *   Log in to your Stripe account via the CLI: `stripe login`
    *   Start forwarding webhooks:
        ```bash
        stripe listen --forward-to localhost:3000/api/webhook
        ```
    *   The CLI will provide you with a `whsec_...` secret. Add this as your `STRIPE_WEBHOOK_SECRET` in the `.env.local` file.

6.  **Run the development server**:
    ```bash
    npm run dev
    ```
    Your application should now be running at `http://localhost:3000`.

## Database Structure

The application primarily interacts with the following collections in Appwrite:

*   **Users**: Appwrite's built-in Users collection manages user accounts, including email, name, and verification status.
*   **`email_verifications`**: (Custom Collection) Stores temporary tokens issued during the email registration verification process. Documents are short-lived and deleted after use or expiry.
*   **`donation_history`**: (Custom Collection) Records details of each successful donation transaction processed through Stripe. Linked to the user via `user_id`.
*   **`Campaigns`**: (Conceptual/Mocked in current dashboard) A collection intended to store details about various fundraising campaigns, their targets, descriptions, etc. The current dashboard uses mock data but the structure would support real campaign tracking.

## Deployment

The frontend application (BarakahBot) is designed to be deployed on platforms like **Vercel** or Netlify, leveraging Next.js capabilities.

The backend services (Appwrite) should be hosted separately. For this project, Appwrite is assumed to be running on a custom server (like `https://appwrite.ctrlz.my/v1`) for better control and potential compliance requirements, distinct from the frontend hosting.

Stripe and Mailgun are external cloud services.

## Team

Developed by Team Sigma Bois:
*   Nur Aiman - Full Stack Engineer

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*BarakahBot: Making Zakat simple, secure, and impactful.*
