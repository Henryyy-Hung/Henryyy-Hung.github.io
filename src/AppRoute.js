import { BrowserRouter as Router, Routes, Route} from "react-router-dom";

import HomePage from './pages/HomePage/HomePage';

import NotFoundPage from './pages/NotFoundPage/NotFoundPage';

const AppRoutes = () => {
    
  return (
    <>
      <Router>
        <Routes>
            <Route path="/" element={<HomePage/>} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </>
  );
};

export default AppRoutes;