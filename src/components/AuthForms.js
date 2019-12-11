import styled from 'styled-components';

const Form = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Error = styled.div`
  color: red;
`;

const Success = styled.div`
  color: green;
`;

const Logo = styled.img`
  width: 50%;
  margin-bottom: 1rem;
`;

export { Form, Error, Logo, Success };
