import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster"
import IntroVideo from '@/components/IntroVideo';
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import AppLayout from '@/components/layout/AppLayout';
import Welcome from '@/pages/Welcome';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import ProtectedRoute from '@/components/ProtectedRoute';
import Today from '@/pages/Today';
import MyFoods from '@/pages/MyFoods';
import MealBuilder from '@/pages/MealBuilder';
import FoodLog from '@/pages/FoodLog';
import CalorieCalculator from '@/pages/CalorieCalculator';
import BarcodeScanner from '@/pages/BarcodeScanner';
import MealPrep from '@/pages/MealPrep';
import About from '@/pages/About';
import Support from '@/pages/Support';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsOfUse from '@/pages/TermsOfUse';
// Add page imports here

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      {/* Add your page Route elements here */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route element={<ProtectedRoute unauthenticatedElement={<Welcome />} />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Today />} />
          <Route path="/my-foods" element={<MyFoods />} />
          <Route path="/meal-builder" element={<MealBuilder />} />
          <Route path="/food-log" element={<FoodLog />} />
          <Route path="/calorie-calculator" element={<CalorieCalculator />} />
          <Route path="/scan-barcode" element={<BarcodeScanner />} />
          <Route path="/meal-prep" element={<MealPrep />} />
          <Route path="/about" element={<About />} />
          <Route path="/support" element={<Support />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfUse />} />
        </Route>
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {
  const [showIntro, setShowIntro] = useState(() => !sessionStorage.getItem('introShown'));

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const applyTheme = (isDark) => {
      document.documentElement.classList.toggle('dark', isDark);
    };
    applyTheme(mediaQuery.matches);
    const handleChange = (e) => applyTheme(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  if (showIntro) {
    return (
      <IntroVideo
        onFinish={() => {
          sessionStorage.setItem('introShown', '1');
          setShowIntro(false);
        }}
      />
    );
  }

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App