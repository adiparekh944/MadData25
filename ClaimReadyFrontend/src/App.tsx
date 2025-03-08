import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './Navbar'; 
import Homepage from './Homepage';
import UploadPage from './UploadPage';
export default function App() {
  return (
    <Router>
      <div className="p-4 bg-background">
        <Navbar />
        <Routes>
          <Route path="/" element={<Homepage/>} />
          <Route path="/UploadPage" element={<UploadPage/>} />
        </Routes>
      </div>
    </Router>
  );
}
