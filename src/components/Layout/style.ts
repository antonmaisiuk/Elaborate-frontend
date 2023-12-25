import styled from 'styled-components';

export const StyledLayout = styled.div`
  position: relative;
  display: grid;
  grid-template-rows: 65px calc(100vh - 65px);
  grid-template-columns: min(30%, 300px) auto;
  grid-template-areas: 
          'header header'
          'nav content';

  width: 100%;
  height: 100vh;

  @media only screen and (max-width: 768px){
    grid-template-columns: max(6%, 60px) auto;
  }

  @media only screen and (max-width: 440px) {
    grid-template-columns: auto;
    grid-template-areas: 
          'header'
          'content';
  }
`;
