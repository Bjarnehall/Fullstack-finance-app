import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useEffect, useState } from 'react';



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


  function handleLogout() {
    localStorage.removeItem("token");
        navigate("/login");
    }

  return (
    <Wrapper>
        <nav>
            <button onClick={handleLogout} className="btn">logout</button>
        </nav>
    </Wrapper>
  )
}

const Wrapper = styled.section`
    nav {
        background-color: #acacac;
        padding: 0.5rem;
    }
`;

export default Landing