import React from 'react';
import './App.scss';

import { Routes, Route } from 'react-router-dom';
import Home from './routes/Home';
import Root from './routes/Root';
import Auth from './routes/Auth';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Root />} />
      <Route path="/auth/login" element={<Auth />} />
      <Route path="/auth/registration" element={<Auth />} />
      <Route path="/user/:userId" element={<Home />} />
      <Route path="*" element={<div>Ошибка страницы</div>} />
    </Routes>
  );
};

export default App;
