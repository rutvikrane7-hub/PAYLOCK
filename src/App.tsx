import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DeliverablesProvider } from './context/DeliverablesContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DashboardPage } from './pages/DashboardPage';
import { PreviewPage } from './pages/PreviewPage';

export function App() {
  return (
    <DeliverablesProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-[#070b14] text-slate-100 selection:bg-cyan-500 selection:text-black">
          {/* Top Navbar */}
          <Navbar />

          {/* Main Routing View */}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/p/demo" element={<PreviewPage />} />
              <Route path="/p/:id" element={<PreviewPage />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>

          {/* Persistent Footer */}
          <Footer />
        </div>
      </BrowserRouter>
    </DeliverablesProvider>
  );
}

export default App;
