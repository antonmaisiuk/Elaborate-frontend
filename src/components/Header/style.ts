import styled from 'styled-components';
import {NavInterface} from "../Navigation/Navigation";

export const StyledHeader = styled.div`
  display: grid;
  grid-area: header;

  grid-template-columns: min(30%, 300px) auto;
  background-color: #F4F5F7;

  @media only screen and (max-width: 768px){
    grid-template-columns: max(6%, 60px) auto;
  }
`;

export const StyledNavLogo = styled.div<NavInterface>`
  display: flex;
  justify-content: space-around;
  align-items: center;  
  
  background: #191919;
  flex-grow: 1;
  padding: 12px 24px;

  .mobile-nav, .nav-logo-small {
    display: none;
    align-items: center;
  }
  
  .mobile-nav-btn{
    color: #fff;
    background: transparent;
    outline: none;
    border: none;
  }
  
  h2{
    margin: 0;
    padding: 0;
    
    cursor: pointer;
    text-align: center;
    font-family: Poppins, sans-serif;
    font-size: 24px;
    font-style: normal;
    font-weight: 800;
    line-height: 32px; /* 133.333% */
    letter-spacing: 1.92px;
    color: #fff;
  }

  @media only screen and (max-width: 768px){
    h2{
      display: none;
    }
    .nav-logo-small{
      display: flex;
    }
    align-items: center;
  }

  @media only screen and (max-width: 440px) {
    .nav-logo-small{
      display: none;
    }
    .mobile-nav{
      transition: 1s;
      ${props => props.visible ? 'transform:rotate(-90deg);' : ''}
      display: flex;
    }
  }
`;

export const StyledDate = styled.div`
  flex-grow: 6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: default;
  padding: 12px 24px;
  border-bottom: 1px solid #E8E8E8;
  
  svg{
    margin-right: 5px;
  }

  color: #9F9F9F;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 20px;
`;
