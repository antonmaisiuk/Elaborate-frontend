import styled from 'styled-components';
import {Form} from "react-bootstrap";

export const StyledCharts = styled.div`
  //display: flex;
  //flex-direction: column;
  //justify-content: space-between;

  display: grid;
  //grid-template-rows: min(55%, 325px) min(40%, 240px);
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-areas: 
          'trans basic other' 
          'history history history'
          'power power power';
  gap: 20px;
  //overflow-y: scroll;
  //height: 100%;
  //margin-top: 30px;

  .tile_trans{
    //min-height: 150px;
    grid-area: trans;
  }
  .tile_basic{
    //min-height: 150px;
    grid-area: basic;
  }
  .tile_other{
    //min-height: 150px;
    grid-area: other;
  }
  .tile_history{
    grid-area: history;
  }
  .tile_power{
    grid-area: power;
  }

  @media only screen and (max-width: 1024px) {
    grid-template-rows: none;
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
        'trans basic'
        'other other'
        'stat stat';
  }

  @media only screen and (max-width: 440px) {
    display: flex;
    flex-direction: column;
    grid-template-rows: none;
  }
`;

export const StyledChart = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  
  //.leftPie{
  //  grid-area: leftPie;
  //}
  //.rightPie{
  //  grid-area: rightPie;
  //}
  //.area{
  //  grid-area: area;
  //}
  
  //width: 100%;
  //height: 100%;

  background: #fff;
  border-radius: 16px;
  
  padding: 28px;
`;

export const StyledSelector = styled(Form.Select)`
  display: flex;
  height: 48px;
  padding: 12px 16px;
  align-items: flex-start;
  border-radius: 16px;
  cursor: pointer;
  border: 1px solid rgba(208, 213, 221, 0.81);
  color: #1c1f22;

  box-shadow: 0 20px 25px 0 rgba(76, 103, 100, 0.10);

  background-color: #fff;

  ::placeholder {
    color: #6c757d;
  }
`;

export const StyledChartTitle = styled.h3`

`;

export const StyledNoData = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  height: 250px;
  width: 100%;
  margin: 0;

  color: #545d60;
`;
