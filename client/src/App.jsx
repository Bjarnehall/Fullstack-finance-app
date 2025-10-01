import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import {
  Login,
  Register,
  Landing,
} from './views/index.js';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />
  }
]);

function App() {


  return (
    <RouterProvider router={router} />
  )
}

export default App
