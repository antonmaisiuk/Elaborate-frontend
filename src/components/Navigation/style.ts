import styled from 'styled-components';
import {NavDropdown} from "react-bootstrap";
import {NavInterface} from "./Navigation";

export const StyledNavigation = styled.div<NavInterface>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px 32px 32px;
    
  z-index: 100;
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
    width: max(6%, 60px);
    
    transform: translateX(-100%);

    ${props => props.visible ? `
      transform: translateX(0%);
    ` : ''}
  }
  
`;

export const StyledNavHeader = styled.div`
  display: flex;
  justify-content: center;

  .mobile-nav {
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

  svg {
    cursor: pointer;
  }

  @media only screen and (max-width: 768px) {
    flex-direction: column;
    justify-content: center;
    gap: 15px;
    align-items: center;
  }
`

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

  .nav-active, :hover {
    color: #fff;
    background: #25AB52;
  }

  a {
    padding: 12px 16px;
  }

  p {
    padding: 0;
    margin: 0;
  }

  .nav-link {
    display: flex;
    align-items: center;
    text-decoration: none;
  }

  a, div a, div, .dropdown-menu a, hr {

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

  .dropdown-menu {
    background: #191919;
    border: 1px solid rgba(255, 255, 255, 0.08);

    .nav-active, a:hover {
      background: #25AB52;
    }
  }

  @media only screen and (max-width: 768px) {
    min-width: 0;
    padding: 0;

    a {
      padding: 8px 5px;
    }

    a:after {
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

export const StyledUserPhoto = styled.div<{ avatar: string }>`
    width: 48px;
    height: 48px;
    border-radius: 32px;
    
  background-image: url("${ props => props.avatar}");
  background-color: lightgray;
  background-repeat: no-repeat;
  background-size: cover;

    @media only screen and (max-width: 768px){
        width: 38px;
        height: 38px;
    }
`
export const StyledUserInfo = styled.button`
  display: flex;
  align-items: center;

  border: none;
  background: none;
  
`
export const StyledUsername = styled.div`
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
