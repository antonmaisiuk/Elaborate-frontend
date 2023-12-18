import styled from "styled-components";

export const StyledInvestsOverview = styled.div`
  display: grid;
  grid-template-rows: max(20%, 150px) max(20%, 150px);
  grid-template-areas: 
          'stocks crypto' 
          'metals other' 
          'stat stat';
  gap: 20px;
  height: 100%;
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

  @media only screen and (max-width: 440px) {
    display: flex;
    flex-direction: column;
    grid-template-rows: none;
    //grid-template-areas: 
    //      'trans'
    //      'invest'
    //      'stat';
  }

  @media only screen and (max-width: 320px) {
    .tile_stats-header{
      flex-direction: column;
      justify-content: center;
    }
  }
`;
