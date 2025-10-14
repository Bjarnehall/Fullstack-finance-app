import styled from 'styled-components';

const Wrapper = styled.section`
  min-height: 100vh;
        
    form {
        font-family:Verdana, Geneva, Tahoma, sans-serif;
        color: var(--color-font-main);
        width: 90vw;
        max-width: 400px;
        background-color: var(--color-main-light);
        border-radius: 5px;
        box-shadow: 0 4px 6px -1px var(--color-shadow);
        padding: 2rem 2.5rem;
        margin: auto;
        margin-top: 20vh;
    }
    .form-label {
        display: block;
        margin: 0.375rem;
        text-transform: capitalize;
    }
    .form-input {
        color: var(--color-font-main);
        width: 100%;
        padding: 0.375rem 0.75rem;
        border-radius: 5px;
        border: 2px solid var(--color-light-border);
        background-color: var(--color-main);
    }
    button {
        text-transform: capitalize;
        font-weight: bold;
        color: var(--color-font-highlight);
        width: 100%;
        padding: 0.375rem 0.75rem;
        margin-top: 1rem;
        margin-bottom: 0.75rem;
        background-color: var(--color-main);
        border: none;
    }
    button:hover {
        color: yellow;
    }
    h4 {
        margin-bottom: 0.75rem;
    }
    #message {
        background-color: var(--color-message-warning);
        padding: 0.375rem 0.75rem;
        border-radius: 5px;
        margin-top: 1rem;
        color: var(--color-font-highlight);
        display: none;
    }
    a {
        text-transform: capitalize;
        color: var(--color-font-highlight);
    }

`;

export default Wrapper;