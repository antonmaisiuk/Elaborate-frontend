import React, {Dispatch, FC, HTMLAttributes, useState} from 'react';
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
import {NavLink, useNavigate} from "react-router-dom";
import LogoutIcon from '../../assets/LogoutIcon/LogoutIcon';
import VerticalMoreIcon from '../../assets/VerticalMoreIcon/VerticalMoreIcon';
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../redux/store";
import { useTranslation } from 'react-i18next';

import {
  FaAngleRight,
  FaAngleLeft,
  FaChartBar,
  FaThLarge,
  FaShoppingCart,
  FaCog,
  FaSignOutAlt,
  FaBars
} from 'react-icons/fa';
import { RxDashboard } from "react-icons/rx";
import './navbar.css';
import {GrTransaction} from "react-icons/gr";
import {AiOutlineStock} from "react-icons/ai";
import {LuLineChart} from "react-icons/lu";
import {FiPieChart} from "react-icons/fi";
import {HiOutlineLogout} from "react-icons/hi";

export interface NavInterface {
  toggle: Dispatch<boolean>,
  visible: boolean,
}

const Navigation : FC<HTMLAttributes<HTMLDivElement> & NavInterface> = ({toggle, visible}) => {
// @ts-ignore
// const Navigation : FC<HTMLAttributes> = ({visible, show}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const dispatch = useDispatch<AppDispatch>();
  const userInfo = useSelector((state: RootState) => state.user.userInfo);


  const logout = () => {
    document.cookie = "token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    navigate('/login');
  }


  const ICON_SIZE = 30;


  return (
    <StyledNavigation visible={visible} toggle={toggle} >
      <StyledNavHeader>
        <StyledNavbar>
          <StyledNavContainer>
            <Nav.Link onClick={() => {
              toggle(false)
              navigate('/overview')
            }}><RxDashboard size={ICON_SIZE} /><p>{t('overview')}</p></Nav.Link>
          </StyledNavContainer>
          <StyledNavContainer>
            <Nav.Link onClick={() => {
              toggle(false)
              navigate('/transactions')
            }}><GrTransaction size={ICON_SIZE} /> <p>{t('transactions')}</p></Nav.Link>
          </StyledNavContainer>
          <StyledNavContainer>
            <NavDropdown title={<><LuLineChart size={ICON_SIZE} /> <p>{t('investments')}</p></>} id="basic-nav-dropdown">
              <NavDropdown.Item onClick={() => {
                toggle(false)
                navigate('/invest')
              }}>{t('overview')}</NavDropdown.Item>
              <StyledDivider theme='dark' />
              <NavDropdown.Item onClick={() => {
                toggle(false)
                navigate('/invest/stocks')
              }}>{t('stocks')}</NavDropdown.Item>
              <NavDropdown.Item onClick={() => {
                toggle(false)
                navigate('/invest/crypto')
              }}>{t('crypto')}</NavDropdown.Item>
              <NavDropdown.Item onClick={() => {
                toggle(false)
                navigate('/invest/metals')
              }}>{t('metals')}</NavDropdown.Item>
              {/*<NavDropdown.Item onClick={() => navigate('/invest/other')}>Other</NavDropdown.Item>*/}
            </NavDropdown>
          </StyledNavContainer>
          <StyledNavContainer>
              <Nav.Link onClick={() => {
                toggle(false)
                navigate('/stats')
              }}><FiPieChart size={ICON_SIZE} /> <p>{t('statistics')}</p></Nav.Link>
          </StyledNavContainer>
        </StyledNavbar>
      </StyledNavHeader>
      <StyledNavFooter>
        <StyledUserInfo onClick={() => {
          toggle(false);
          navigate('/settings')
        }}>
          <StyledUserPhoto>
            <img src={userInfo.avatar} alt="avatar"/>
          </StyledUserPhoto>
          <StyledUsername>
            <h4>{userInfo.username}</h4>
            <p>{t('viewProfile')}</p>
          </StyledUsername>
        </StyledUserInfo>

        <HiOutlineLogout color={'rgba(255, 255, 255, 0.70'} onClick={logout} size={ICON_SIZE} />
        {/*<VerticalMoreIcon/>*/}
      </StyledNavFooter>


    </StyledNavigation>
  );
};

export default Navigation;
