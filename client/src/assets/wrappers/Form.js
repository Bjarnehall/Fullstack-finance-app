import styled from 'styled-components';

const Wrapper = styled.section`
  min-height: 100vh;
        
    form {
        font-family:Verdana, Geneva, Tahoma, sans-serif;
        color: rgb(155, 189, 223);
        width: 90vw;
        max-width: 400px;
        background-color: #333333;
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
        color: rgb(155, 189, 223);
        width: 100%;
        padding: 0.375rem 0.75rem;
        border-radius: 5px;
        border: 1px solid rgb(155, 189, 223);
        background-color:rgb(36, 36, 36);
    }
    button {
        color:rgb(155, 189, 223);
        width: 100%;
        padding: 0.375rem 0.75rem;
        margin-top: 1rem;
        margin-bottom: 0.75rem;
        background-color:rgb(36, 36, 36);
        border: none;
    }
    h4 {
        margin-bottom: 0.75rem;
    }
    #message {
        background-color:rgba(117, 64, 64, 0.73);
        padding: 0.375rem 0.75rem;
        border-radius: 5px;
        margin-top: 1rem;
        color: rgb(155, 189, 223);
        display: none;
    }
    a {
        color: #fff;
    }
`;

export default Wrapper;