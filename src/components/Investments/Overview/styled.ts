import styled from "styled-components";

export const StyledInvestsOverview = styled.div`
  display: grid;
  grid-template-rows: min(30%, 150px);
  grid-template-areas:
        'stocks crypto metals other'
        'stat stat stat stat';
  gap: 20px;
  margin-top: 30px;

  .tile_stocks{
    min-height: 150px;
    grid-area: stocks;
  }
  .tile_crypto{
    min-height: 150px;
    grid-area: crypto;
  }
  .tile_metals{
    min-height: 150px;
    grid-area: metals;
  }
  .tile_other{
    min-height: 150px;
    grid-area: other;
  }
  .tile_stats{
    grid-area: stat;
  }

  @media only screen and (max-width: 1024px) {
    grid-template-rows: min(20%, 150px) min(20%, 150px);
    grid-template-columns: 1fr 1fr;
    grid-template-areas: 
          'stocks crypto' 
          'metals other' 
          'stat stat';
  }
  
  @media only screen and (max-width: 440px) {
    display: flex;
    flex-direction: column;
    grid-template-rows: none;
  }

  @media only screen and (max-width: 320px) {
    .tile_stats-header{
      flex-direction: column;
      justify-content: center;
    }
  }
`;
