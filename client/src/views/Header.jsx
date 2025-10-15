import {useState, useEffect } from "react";
import styled from 'styled-components';

const colorCat = "#333333";
const colorEye = "yellow";

function Cat ({ viewBox }) {
    const [eyeColor, setColor] = useState(colorEye);
    useEffect(() => {
        const interval = setInterval(() => {
            setColor(colorCat);
            setTimeout(() => setColor(colorEye), 300);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="header">
        <svg data-testid="header-svg" width="100%" height="100%" viewBox="0 0 1000 240">
        {/* Cat body and head */}
        <circle r="48" cx="160" cy="160" fill={colorCat} />      {/* r * 4, cx * 4, cy * 4 */}
        <circle r="32" cx="160" cy="88" fill={colorCat} />       {/* r * 4, cx * 4, cy * 4 */}
        
        {/* Eyes */}
        <circle r="10" cx="174" cy="84" fill={eyeColor} />       {/* r * 4, cx * 4, cy * 4 */}
        <circle r="10" cx="146" cy="84" fill={eyeColor} />       {/* r * 4, cx * 4, cy * 4 */}
        
        {/* Ears */}
        <polygon points="136,40 132,80 152,60" fill={colorCat} />
        <polygon points="184,40 192,80 168,60" fill={colorCat} />
        
        {/* Text */}
        <text x="240" y="140" fill="#707070" fontSize="120" fontFamily="sans-serif">
            Mr Signal
        </text>
        <text x="240" y="205" fill="#505050" fontSize="40" fontFamily="sans-serif">
            The only market tool you need
        </text>
        </svg>
        </div>

    );
}

function Header() {
    const [viewBox] = useState("0 0 1000 10");
    return (
    <Wrapper>
        <div className="header">
            <Cat viewBox={viewBox}/>
        </div>
    </Wrapper>
    )
}

const Wrapper = styled.section`
    .header {
        background-color: var(--color-main-dark)
    }
    .header svg {
    width: 25vw; /* Base size for desktop */
    height: auto;
    }

    @media (max-width: 800px) {
    .header svg {
        width: 80vw; /* Make it take up more space on mobile */
    }
    }
`;

export default Header
