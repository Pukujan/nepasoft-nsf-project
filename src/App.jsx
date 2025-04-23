import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar.jsx';
import Upload from './components/Upload.jsx';


const App = () => {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-4">
          <Routes>
            <Route path="/upload" element={<Upload />} />

            {/* Add more routes here if needed */}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
