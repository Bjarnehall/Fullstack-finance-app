import styled from 'styled-components';

const Wrapper = styled.section`
  min-height: 100vh;
        
    form {
        font-family:Verdana, Geneva, Tahoma, sans-serif;
        color: #333333;
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
    #message {
        background-color:rgba(255, 154, 154, 0.48);
        padding: 0.375rem 0.75rem;
        border-radius: 5px;
        margin-top: 1rem;
        color: #333333;
        display: none;
    }
`;

export default Wrapper;