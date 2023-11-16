import React from 'react';
import ReactDOM from 'react-dom/client';
import '../src/assets/styles/style.css';
import '../src/assets/styles/reset.css';
import {createBrowserRouter, RouterProvider, redirect} from 'react-router-dom';
import Main from './pages/Main/Main';
import Result from './pages/Result/Result';

const router = createBrowserRouter([
  {
    path: '*',
    loader: () => redirect('/'),
  },
  {
    path: '/',
    element: <Main />,
  },
  {
    path: '/result',
    element: <Result />,
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  // <React.StrictMode>
  <RouterProvider router={router} />,
  // </React.StrictMode>,
);
