import { Link, useRouteError } from 'react-router-dom';
import styled from 'styled-components';
import FormRow from '../models/FormRow';
import { useState } from "react";
const api_url="http://localhost:3005"

function Login() {
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const response = await fetch(`${api_url}/api/users/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const message = document.getElementById('message');

            if (response.status === 404) {
                message.innerHTML = `<h5>Login failed</h5><p><small>User could not be found with that email</small></p>`
                return;
            }
            if (response.status === 401) {
                message.innerHTML = `<h5>Login failed</h5><p><small>Password is incorrect</small></p>`
                return;
            }

            const data = await response.json();
            localStorage.setItem("token", data.accesstoken);
            localStorage.setItem("email", data.email);
            window.dispatchEvent(new Event("storage"));
            console.log("Login response:", data);
            alert("Login successful!");

        } catch (error) {
            console.error(error);
            alert("An error occurred during login");

        }

    }

  return (
    <Wrapper>
        <nav>
            <Link to='/' className='btn '>Home</Link>
        </nav>
        <form onSubmit={handleSubmit}>
          <h4>Login</h4>
          <FormRow type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
          <FormRow type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
          <button type="submit">submit</button>
          <p>
            Create an account
            <Link to='/register'>Register</Link>
            <div id="message"></div>
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
    .alert {
      color: blue;
    }
`;
export default Login;
