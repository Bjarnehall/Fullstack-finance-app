import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Menu } from '../views/index.js';
import TickerInformaiton from '../models/TickerInformation.jsx';
import styled from 'styled-components';
/*
Post client stored jwt token and check if valid
Returns valid = true/false
*/
async function isTokenValid(token) {
    const response = await fetch('http://localhost:3005/api/users/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    const answer = await response.json();
    return answer.valid;
};
/*
Component for landingpage
*/
function Landing() {
  const navigate = useNavigate();
  /*
  Check if user is logged in and token has not expiered
  if no token or isTokenValid returns false user is redirected
  to login page
  */
  useEffect(() => {
    const checkToken = async () => {
    const storedToken = localStorage.getItem("token");
    
    if (!storedToken) {
      navigate("/login");
      return;
    }

    const valid = await isTokenValid(storedToken);
    if (!valid) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };
  checkToken();
  }, [navigate]);
  /*
  Render Menu component
  */
  return (
    <Wrapper>
        <Menu />
    </Wrapper>
  )
}

const Wrapper = styled.section`

`;

export default Landing
