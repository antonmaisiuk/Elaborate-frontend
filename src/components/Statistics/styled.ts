import styled from 'styled-components';

export const StyledCharts = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  
  width: 100%;
  height: 100%;

  //background: #fff;
  //box-shadow: 0 20px 25px 0 rgba(76, 103, 100, 0.10);
  //border-radius: 16px;
  
  margin-top: 15px;
  //padding: 28px;
`;

export const StyledChart = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  
  .leftPie{
    grid-area: leftPie;
  }
  .rightPie{
    grid-area: rightPie;
  }
  .area{
    grid-area: area;
  }
  
  //width: 100%;
  //height: 100%;

  background: #fff;
  box-shadow: 0 20px 25px 0 rgba(76, 103, 100, 0.10);
  border-radius: 16px;
  
  padding: 28px;
`;

export const StyledChartTitle = styled.h3`

`;
