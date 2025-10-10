import { Link, useRouteError } from 'react-router-dom';
import styled from 'styled-components';
import FormRow from '../models/FormRow';
import { useState } from "react";
const api_url="http://localhost:3005"

function Register() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch(`${api_url}/api/users/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
          const errorText = await response.text();
          alert("Login failed: " + errorText);
          return;
      }

      alert("Created new user:");
    } catch (error) {
        console.error(error);
        alert("An error ocurred creating user");
    }
  }

  return (
    <Wrapper>
        <nav>
            <Link to='/' className='btn '>Home</Link>
        </nav>
        <form onSubmit={handleSubmit}>
          <h4>register</h4>
          <FormRow type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
          <FormRow type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
          <button type="submit">submit</button>
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
