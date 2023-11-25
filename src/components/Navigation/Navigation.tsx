import React, {FC, HTMLAttributes} from 'react';
import {
  StyledDivider,
  StyledLogoutWrapper,
  StyledNavbar,
  StyledNavContainer,
  StyledNavFooter,
  StyledNavHeader,
  StyledNavigation,
  StyledNavLogo,
  StyledUserInfo,
  StyledUsername,
  StyledUserPhoto
} from "./style";
import {Nav, Navbar, NavDropdown} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import LogoutIcon from '../../assets/LogoutIcon/LogoutIcon';
import VerticalMoreIcon from '../../assets/VerticalMoreIcon/VerticalMoreIcon';
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../redux/store";

const Navigation : FC<HTMLAttributes<HTMLDivElement>> = ({children}) => {
  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();
  const userInfo = useSelector((state: RootState) => state.user.userInfo);


  const logout = () => {
    document.cookie = "token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    navigate('/login');
  }

  return (
    <StyledNavigation>
      <StyledNavHeader>
        <StyledNavLogo onClick={() => navigate('/')}>
          <h2>Elaborate</h2>
        </StyledNavLogo>

        <StyledNavbar>
          <StyledNavContainer>
            <Nav.Link onClick={() => navigate('/overview')}>Overview</Nav.Link>
          </StyledNavContainer>
          <StyledNavContainer>
            <Nav.Link onClick={() => navigate('/transactions')}>Transactions</Nav.Link>
          </StyledNavContainer>
          <StyledNavContainer>
            <NavDropdown title="Investments" id="basic-nav-dropdown">
              <NavDropdown.Item onClick={() => navigate('/invest')}>Overview</NavDropdown.Item>
              <StyledDivider theme='dark' />
              <NavDropdown.Item onClick={() => navigate('/invest/stocks')}>Stocks</NavDropdown.Item>
              <NavDropdown.Item onClick={() => navigate('/invest/crypto')}>Crypto</NavDropdown.Item>
              <NavDropdown.Item onClick={() => navigate('/invest/metals')}>Metals</NavDropdown.Item>
              <NavDropdown.Item onClick={() => navigate('/invest/other')}>Other</NavDropdown.Item>
            </NavDropdown>
          </StyledNavContainer>
          <StyledNavContainer>
            <Nav.Link onClick={() => navigate('/stats')}>Statistics</Nav.Link>
          </StyledNavContainer>
          <StyledNavContainer>
            <Nav.Link onClick={() => navigate('/settings')}>Settings</Nav.Link>
          </StyledNavContainer>
        </StyledNavbar>
        <StyledLogoutWrapper onClick={logout}>
          <LogoutIcon/>
          <span>Logout</span>
        </StyledLogoutWrapper>
      </StyledNavHeader>
      <StyledNavFooter>
        <StyledUserInfo>
          <StyledUserPhoto>
            <img src={userInfo.avatar} alt="avatar"/>
          </StyledUserPhoto>
          <StyledUsername>
            <h4>{userInfo.username}</h4>
            <p>View profile</p>

          </StyledUsername>
        </StyledUserInfo>

        <VerticalMoreIcon/>
      </StyledNavFooter>


    </StyledNavigation>
  );
};

export default Navigation;
