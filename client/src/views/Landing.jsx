import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import {
  Menu,
} from '../views/index.js';
import TickerInformaiton from '../models/TickerInformation.jsx';



function Landing() {
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    
    if (!storedToken) {
      navigate("/login");
    }
  }, []);

  return (
    <Wrapper>
        <Menu />
        <TickerInformaiton symbol="AAPL" />
    </Wrapper>
  )
}

const Wrapper = styled.section`

`;

export default Landing