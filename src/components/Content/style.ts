import styled from 'styled-components';

export const StyledContent = styled.div`
  display: flex;
  flex-direction: column;

  grid-area: content;

  padding: 20px 32px 32px 32px;
  background-color: #F4F5F7;

  @media only screen and (max-width: 440px) {
    padding: 20px 10px 32px 10px;

  }
`;
