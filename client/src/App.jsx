import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import {
  Login,
  Register,
  Landing,
  Header,
} from './views/index.js';
import AllTickers from './views/AllTickers.jsx';

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
  },
  {
    path: '/information-tickers',
    element: <AllTickers />
  },
]);

function App() {


  return (
    <>
    <Header />
    <RouterProvider router={router} />
    </>
  )
}

export default App
