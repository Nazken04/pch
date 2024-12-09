import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import LoginPage from '../src/components/LoginPage';
import ProfilePage from '../src/components/ProfilePage';
import RegisterPage from '../src/components/RegisterPage';
import CardCreationPage from '../src/components/CardCreationPage';
import Cases from '../src/components/JournalPage';
import Header from '../src/components/Header';
import CardDetailsPage from '../src/components/CardDetailsPage'; // Импортируем новый компонент

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/create-card" element={<CardCreationPage />} />
        <Route path="/cases" element={<Cases />} />
        <Route path="/card-details/:id" element={<CardDetailsPage />} /> {/* Новый маршрут для карточки */}
      </Routes>
    </Router>
  );
}

export default App;
