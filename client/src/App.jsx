import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Login, Register, Landing, Header } from './views/index.js';
import AllTickers from './views/AllTickers.jsx';

/*
Router for handling component rendering of
given situation and choices
*/
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
  }
]);

function App() {
/*
Render Header component and router
*/
  return (
    <>
    <Header />
    <RouterProvider router={router} />
    </>
  )
}

export default App
