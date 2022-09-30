import React from 'react';
import './App.scss';

import { Routes, Route } from 'react-router-dom';
import Home from './routes/Home';
import Root from './routes/Root';
import Auth from './routes/Auth';

// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <Root />,
//     errorElement: <div>Ошибка страницы router</div>,
//   },
//   {
//     element: <ProtectedRoute username={username} />,
//     errorElement: <div>Ошибка страницы router</div>,
//     children: [
//       {
//         path: `/user/:userId`,
//         element: <Home />,
//         errorElement: <div>Ошибка страницы router</div>,
//       },
//     ],
//   },
//   {
//     path: '/auth/login',
//     element: <Auth />,
//     errorElement: <div>Ошибка страницы router</div>,
//   },
//   {
//     path: '/auth/registration',
//     element: <Auth />,
//     errorElement: <div>Ошибка страницы router</div>,
//   },
// ]);

const App: React.FC = () => {
  // return <RouterProvider router={router} />;
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
