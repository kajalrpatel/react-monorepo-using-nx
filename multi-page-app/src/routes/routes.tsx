import { createBrowserRouter } from 'react-router-dom';
import { Home } from '../pages/Home';
import { About } from '../pages/About';
import { RootLayout } from '../layouts/RootLayout';

/**
 * Application routes configuration
 * Using React Router v7 best practices with lazy loading and error boundaries
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'about',
        element: <About />,
      },
    ],
  },
]);
