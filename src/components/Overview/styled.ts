import styled from 'styled-components';
import {Form} from "react-bootstrap";

export const StyledOverview = styled.div`
  display: grid;
  grid-template-rows: min(25%, 200px) min(60%, 500px);
  grid-template-columns: 1fr 1fr;
  grid-template-areas: 
          'trans invest' 
          'stat stat';
  gap: 20px;
  height: 100%;
  //overflow-y: scroll;  
  margin-top: 30px;

  .tile_trans{
    min-height: 150px;
    grid-area: trans;
  }
  .tile_invest{
    min-height: 150px;
    grid-area: invest;
  }
  .tile_stats{
    grid-area: stat;
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

export const StyledTile = styled.div`
  padding: 20px 30px;
  position: relative;

  border-radius: 16px;
  background: #fff;
  box-shadow: 0 20px 25px 0 rgba(76, 103, 100, 0.10);
    
  .tile_chart{
    position: absolute;
    bottom: 20%;
    right: 0;
  }
  
  .recharts-wrapper{
    display: flex;
    align-items: center;
  }
  .tile_stats{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .tile_stats svg{
    height: 80%;
    width: 100%;
  }
`;
export const StyledTileContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const StyledTileHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 15px;
  
  h2{
    margin: 0;
  }
`;
export const StyledTileTitle = styled.h3`
  font-size: 1.3em;
`;
export const StyledTileValue = styled.div`
  font-size: 2em;
  font-weight: bold;

  z-index: 1;
  position: relative;
`;

export const StyledTileSelector = styled(Form.Select)`
  display: flex;
  flex-wrap: wrap;
  height: 48px;
  padding: 0 25px;
  border-radius: 16px;
  cursor: pointer;
  border: 1px solid rgba(124, 127, 131, 0.99);
  color: #1c1f22;

  background-color: #fff;

  ::placeholder {
    color: #6c757d;
  }

  @media only screen and (max-width: 440px) {
    flex-direction: column;
    height: 32px;
    padding: 0 15px;
  }

  @media only screen and (max-width: 320px) {
    flex-direction: column;
    height: 32px;
    padding: 0 15px;
  }
`;
export const StyledTileSelectorsWrapper = styled.div`
  display: flex;
  gap: 15px;

  @media only screen and (max-width: 440px) {
    flex-direction: column;
    gap: 5px;
  }

  @media only screen and (max-width: 440px) {
    flex-direction: column;
    gap: 5px;
  }
`
// export const StyledSettings = styled.div``
