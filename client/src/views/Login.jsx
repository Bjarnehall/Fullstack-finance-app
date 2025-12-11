import { Link, useNavigate } from 'react-router-dom';
import Wrapper from '../assets/wrappers/Form';
import FormRow from '../models/FormRow';
import { useState } from "react";
const api_url="http://localhost:3006"

function Login() {
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

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
                message.style.display = 'block';
                return;
            }
            if (response.status === 401) {
                message.innerHTML = `<h5>Login failed</h5><p><small>Password is incorrect</small></p>`
                message.style.display = 'block';
                return;
            }
            if (response.status === 200) {
                const token = await response.json();
                localStorage.setItem("token", token.accesstoken);
                if (token !== null) {
                  message.innerHTML = `<h5>Login Sucsess</h5><p><small>Welcome</small></p>`
                  message.style.display = 'block';
                  message.style.backgroundColor = '#315c0b';
                  setTimeout(() => {
                    navigate("/");
                  }, 1200);
                  return;
              }
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
        <form onSubmit={handleSubmit}>
          <h4>Login</h4>
          <FormRow type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
          <FormRow type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
          <button type="submit">login</button>
          <p>
            <small>create an account</small>
          </p>
            <Link to='/register'><br/>register</Link>
            <div id="message"></div>
          
        </form>
    </Wrapper>
  )
}

export default Login;
