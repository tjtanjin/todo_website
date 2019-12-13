import styled from 'styled-components';

const Form = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Error = styled.div`
  text-align: center;
  color: red;
`;

const Success = styled.div`
  text-align: center;
  color: green;
`;

const Logo = styled.img`
  width: 50%;
  margin-bottom: 1rem;
`;

export { Form, Error, Logo, Success };
