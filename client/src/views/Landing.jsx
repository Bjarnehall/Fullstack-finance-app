import { Link, useRouteError } from 'react-router-dom';
import styled from 'styled-components';


function Landing() {
  return (
    <Wrapper>
        <nav>
            <Link to='/login' className='btn '>Login</Link>
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