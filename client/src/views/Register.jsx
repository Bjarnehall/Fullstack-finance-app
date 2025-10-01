import { Link, useRouteError } from 'react-router-dom';
import styled from 'styled-components';
import FormRow from '../models/FormRow';

function Register() {
  return (
    <Wrapper>
        <nav>
            <Link to='/' className='btn '>Home</Link>
        </nav>
        <form>
          <h4>register</h4>
          <FormRow type="email" name="email" />
          <FormRow type="password" name="password" />
          <button type="button">submit</button>
          <p>
            I have an account
            <Link to='/login'>Login</Link>
          </p>
        </form>
    </Wrapper>
  )
}

const Wrapper = styled.section`
  min-height: 100vh;

    nav {
      background-color: #acacac;
      padding: 0.5rem;
    }
    form {
      width: 90vw;
      max-width: 400px;
      background-color: #acacac;
      border-radius: 5px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.329), 0 2px 4px -1px rgba(0, 0, 0, 0.37);
      padding: 2rem 2.5rem;
      margin: auto;
      margin-top: 20vh;
    }
    .form-label {
      display: block;
      margin: 0.375rem;
    }
    .form-input {
      width: 100%;
      padding: 0.375rem 0.75rem;
      border-radius: 5px;
      border: 1px solid grey;
    }
    button {
      width: 100%;
      padding: 0.375rem 0.75rem;
      margin-top: 1rem;
      margin-bottom: 0.75rem;
    }
    h4 {
      margin-bottom: 0.75rem;
    }
`;

export default Register