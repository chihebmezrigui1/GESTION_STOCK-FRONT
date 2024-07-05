import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './layouts/Navbar';
import UploadCSV from './pages/UploadCSV';
import Dashboard from './pages/Dashboard/dashboard';
import AddProduct from './pages/Product/AddProduct';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Navbar />}>
        <Route index element={<Dashboard />} />
        <Route path="/upload" element={<UploadCSV />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/addproduct" element={<AddProduct />} />
      </Route>
    </Routes>
  </Router>
);

export default App;