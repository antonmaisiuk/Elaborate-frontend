import styled from 'styled-components';
import {Container, Nav, Navbar, NavDropdown} from "react-bootstrap";
import {NavInterface} from "./Navigation";

export const StyledNavigation = styled.div<NavInterface>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px 32px 32px;
    
  z-index: 1;
  grid-area: nav;

  background-color: #191919;
  transition: 1s;



  @media only screen and (max-width: 768px) {
    padding: 20px 5px 32px;
  }
  @media only screen and (max-width: 440px) {
    position: absolute;
    
    top: 65px;
    left: 0;
    min-height: calc(100vh - 65px);
    width: max(6%, 50px);
    
    transform: translateX(-100%);

    ${props => props.visible ? `
      transform: translateX(0%);
    ` : ''}
  }
  
`;

export const StyledNavHeader = styled.div`
  display: flex;
  //flex-direction: column;
  justify-content: center;

  .mobile-nav {
    //background-color: #753ffd;
    //width: 100%;
    //height: 40px;
    /*display: none;*/

    display: flex;
    align-items: center;
  }

  .mobile-nav-btn{
    color: #fff;
    background: transparent;
    outline: none;
    border: none;
  }
`
export const StyledNavFooter = styled.div`
  display: flex;
  padding-top: 32px;
  justify-content: space-between;
  align-items: center;
  
  width: 100%;

  border-top: 1px solid rgba(255, 255, 255, 0.08);
  
  svg{
    cursor: pointer;
  }
`

export const StyledNavLogo = styled.div`
  cursor: pointer;

  h2{
    margin: 0;
    
    text-align: center;
    font-family: Poppins, sans-serif;
    font-size: 24px;
    font-style: normal;
    font-weight: 800;
    line-height: 32px; /* 133.333% */
    letter-spacing: 1.92px;
    color: #fff;
  }
`;

export const StyledNavbar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`
export const StyledDivider = styled(NavDropdown.Divider)`
  color: rgba(255, 255, 255, 0.70);
  
`

export const StyledNavContainer = styled.div`
  display: flex;
  padding: 12px 16px;
  align-items: center;
  min-width: 220px;

  background: #191919;

  :hover{
    color: #fff;
    background: #25AB52;
  }
  
  a{
    padding: 12px 16px;
  }
  
  p{
    padding: 0;
    margin: 0;    
  }
  
  
  a, div a, div, .dropdown-menu a, hr{
    color: rgba(255, 255, 255, 0.70);
    font-family: Inter, sans-serif;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px; /* 150% */
    border-radius: 6px;
    margin-bottom: 0;

    width: 100%;
    gap: 15px;
  }
  
  .dropdown-menu{
    background: #191919;
    border: 1px solid rgba(255, 255, 255, 0.08);
    
    a:hover{
      background: #25AB52;
    }
  }

  @media only screen and (max-width: 768px){
    min-width: 0;
    padding: 0;

    a{
      padding: 8px 5px;
    }

    a:after{
      display: none;
    }

    p {
      display: none;
    }
    
    .dropdown-menu a {
      padding: 8px 12px;
    }
  }
`

export const StyledLogoutWrapper = styled.button`
  display: flex;
  padding: 12px 16px;
  align-items: center;

  border: none;
  width: 100%;

  margin-bottom: 45px;

  border-radius: 4px;
  opacity: 0.75;
  background: rgba(255, 255, 255, 0.08);

  ::hover {
    background: rgba(0, 0, 0, 0.27);
  }

  color: #fff;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 24px;

  span {
    margin-left: 12px;

    @media only screen and (max-width: 768px){
      display: none;
    }
  }
`
export const StyledUserPhoto = styled.div`
  width: 32px;
  height: 32px;
  
  img{
    width: 100%;
    border-radius: 100%;
  }

  border-radius: 32px;
  background: lightgray 50% / cover no-repeat;
`
export const StyledUserInfo = styled.button`
  display: flex;
  align-items: center;

  border: none;
  background: none;
  
`
export const StyledUsername = styled.div`
  //display: flex;
  //flex-direction: column;
  align-items: center;
  margin-left: 12px;
  text-align: left;
  
  
  h4{
    margin: 0;
    color: #fff;

    font-family: Inter, sans-serif;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 24px;
  }
  p{
    margin: 0;
    color: rgba(255, 255, 255, 0.70);

    font-family: Inter, sans-serif;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px;
  }

  @media only screen and (max-width: 768px){
    display: none;
  }
`
