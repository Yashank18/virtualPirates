import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AnalyzeForm from './pages/AnalyzeForm';
import ResultsPage from './pages/ResultsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/analyze" element={<AnalyzeForm />} />
        <Route path="/results" element={<ResultsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App; 