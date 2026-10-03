import { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import Coin from './pages/Coin/Coin';
import HistoryPage from './pages/History/History';
import AuthModal from './components/Modals/AuthModal';
import FeaturesModal from './components/Modals/FeaturesModal';
import BlogModal from './components/Modals/BlogModal';
import WatchlistDrawer from './components/Modals/WatchlistDrawer';
import { CoinContext } from './context/coinConstants';
import './App.css';

function AppContent() {
  const { activeModal, closeModal } = useContext(CoinContext);

  return (
    <div className="app">
      <Navbar />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/coin/:coinId" element={<Coin />} />
          <Route path="/history" element={<HistoryPage />} />
          {/* Support /histroy to preserve compatibility with reference URL */}
          <Route path="/histroy" element={<HistoryPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />

      {/* Global Modals & Drawers */}
      <AuthModal
        isOpen={activeModal === 'auth'}
        onClose={closeModal}
      />
      <FeaturesModal
        isOpen={activeModal === 'features'}
        onClose={closeModal}
      />
      <BlogModal
        isOpen={activeModal === 'blog'}
        onClose={closeModal}
      />
      <WatchlistDrawer
        isOpen={activeModal === 'watchlist'}
        onClose={closeModal}
      />
    </div>
  );
}

export default function App() {
  return <AppContent />;
}
