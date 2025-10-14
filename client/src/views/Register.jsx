import { Link, useNavigate } from 'react-router-dom';
import Wrapper from '../assets/wrappers/Form';
import FormRow from '../models/FormRow';
import { useState } from "react";
const api_url="http://localhost:3005"

function Register() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch(`${api_url}/api/users/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
      });
      const message = document.getElementById('message');
      if (response.status === 400) {
          message.innerHTML = `<h5>Register failed</h5><p><small>This email is already registered try to login instead</small></p>`
          message.style.display = 'block';
          return;
      }
      if (response.status === 500) {
          message.innerHTML = `<h5>Register failed</h5><p><small>Server error try again later</small></p>`
          message.style.display = 'block';
          return;
      }

      navigate("/login");

    } catch (error) {
        console.error(error);
    }
  }

  return (
    <Wrapper>
        <form onSubmit={handleSubmit}>
          <h4>register</h4>
          <FormRow type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
          <FormRow type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
          <button type="submit">submit</button>
          <p>
            I have an account
            <Link to='/login'><br/>Login</Link>
            <div id="message"></div>
          </p>
        </form>
    </Wrapper>
  )
}

export default Register
