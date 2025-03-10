import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Homepage from './Homepage';

export default function App() {
  return (
    <Router>
      <div className="p-4 bg-background">
        <Routes>
          <Route path="/" element={<Homepage/>} />
        </Routes>
      </div>
    </Router>
  );
}
