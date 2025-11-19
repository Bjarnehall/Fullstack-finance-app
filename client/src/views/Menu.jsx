import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

function Menu() {
    const navigate = useNavigate();

    function handleLogout() {
        localStorage.removeItem("token");
        navigate("/login");
    };

    function showTickers() {
        navigate("/information-tickers");
    };

    return (
    <Wrapper>
        <div className="nav">
        <button onClick={handleLogout} className="btn">logout</button>
        <button onClick={showTickers} className="btn">explore tickers</button>
        </div>
    </Wrapper>
    )
}


const Wrapper = styled.section`
    .nav {
        width: 140px;
        height: 94vh;
        background-color: var(--color-main-light)
    }
    button {
        text-transform: capitalize;
        font-weight: bold;
        color: #9c9c9c;
        width: 100%;
        padding: 0.375rem 0.75rem;
        margin-top: 0.25rem;
        background-color: #141414;
        border: none;
    }
    button:hover {
        color: yellow;
        background-color: var(--color-main-light);
        cursor: pointer;
    }
`;

export default Menu