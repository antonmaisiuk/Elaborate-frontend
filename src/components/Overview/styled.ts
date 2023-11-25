import styled from 'styled-components';
import {Form} from "react-bootstrap";

export const StyledOverview = styled.div`
  display: grid;
  grid-template-areas: 
          'trans invest' 
          'stat stat' 
          'stat stat';
  gap: 20px;
  height: 100%;
  margin-top: 30px;

  .tile_trans{
    grid-area: trans;
  }
  .tile_invest{
    grid-area: invest;
  }
  //.tile_basic{
  //  grid-area: basic;
  //}
  //.tile_other{
  //  grid-area: other;
  //}
  .tile_stats{
    grid-area: stat;
  }
`;

export const StyledTile = styled.div`
  padding: 20px 30px;

  border-radius: 16px;
  background: #fff;
  box-shadow: 0 20px 25px 0 rgba(76, 103, 100, 0.10);
  
  .tile_stats{

    display: flex;
    align-items: start;
    justify-content: space-between;
  }
`;
export const StyledTileHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;
export const StyledTileTitle = styled.h3`
  font-size: 1.3em;
`;
export const StyledTileValue = styled.div`
  font-size: 2em;
  font-weight: bold;
`;

export const StyledTileSelector = styled(Form.Select)`
  display: flex;
  height: 48px;
  padding: 0 25px;
  align-items: flex-start;
  border-radius: 16px;
  cursor: pointer;
  border: 1px solid rgba(124, 127, 131, 0.99);
  color: #1c1f22;

  //box-shadow: 0 20px 25px 0 rgba(76, 103, 100, 0.10);

  background-color: #fff;

  ::placeholder {
    color: #6c757d;
  }
`;
// export const StyledSettings = styled.div``
