# ✨ JobSync Landing Page

A premium, theme-matched landing page implemented at the root route (`/`) to attract users and provide clear navigation to authentication services.

## 🎨 Design & Aesthetics
- **Theme Alignment**: Fully matched with the project's light theme, using the primary blue palette and branding elements.
- **Glassmorphism**: Modern UI cards with blur and subtle border effects for a professional look.
- **Responsive Design**: Mobile-first layout that scales beautifully across all devices.
- **Visuals**: Includes a custom-generated hero image served locally from the project.

## 🛠️ Technical Implementation
- **Component**: [LandingPage.jsx](file:///c:/Users/ASUS/OneDrive/Desktop/project/frontend-app/src/pages/LandingPage.jsx) - A dedicated component for the landing page.
- **Routing**: [index.jsx](file:///c:/Users/ASUS/OneDrive/Desktop/project/frontend-app/src/routes/index.jsx) - Configured as the root route with automatic dashboard redirection for authenticated users.
- **Styling**: [index.css](file:///c:/Users/ASUS/OneDrive/Desktop/project/frontend-app/src/index.css) - Extended with custom CSS variables, landing-page-specific classes, and specialized Chatbot styles (pulsing icon).
- **Hero Image**: [hero-image.png](file:///c:/Users/ASUS/OneDrive/Desktop/project/frontend-app/public/hero-image.png) - The main illustration, located in the `public` folder.
- **Background Image**: [landing-bg.png](file:///c:/Users/ASUS/OneDrive/Desktop/project/frontend-app/public/landing-bg.png) - The full-page office background image.
- **Chatbot Assistant**: [Chatbot.jsx](file:///c:/Users/ASUS/OneDrive/Desktop/project/frontend-app/src/components/common/Chatbot.jsx) - A floating assistant providing instant answers to common questions.

## 🤖 JobSync Assistant (Chatbot)
- **Feature**: Provides immediate help to visitors with a pulsing, interactive bubble.
- **Predefined Logic**: Handles common FAQs like system features, recruiter help, and support.
- **Styling**: Uses a high `z-index` (2000) and pulsing animation to ensure visibility over any background.
- **Customization**: Update `predefinedQuestions` in `Chatbot.jsx` to change or add more questions/answers.

## 🖼️ Image Usage & Updates
- **File Locations**: `public/hero-image.png` and `public/landing-bg.png`.
- **Reference in Code**: 
  - Hero image: Referenced in `LandingPage.jsx`.
  - Background image: Applied via CSS in `index.css` to `.landing-container`.
- **Replacing the Images**: Simply replace the files in the `public` folder with new images of the same name.

## 🔑 User Conversion
- **Call-to-Action**: Clear 'Get Started' and 'Explore Jobs' buttons to drive user engagement.
- **Public Access**: Accessible to all unauthenticated users without redirection to login.

## 🚀 How to View
1. Start the development server: `npm run dev`
2. Navigate to the root URL: `http://localhost:5173/`
3. If you are already logged in, the page will automatically redirect you to your dashboard. To see the landing page again, please log out.
