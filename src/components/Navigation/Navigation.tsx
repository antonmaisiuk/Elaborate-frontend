import React, {Dispatch, FC, HTMLAttributes, useState} from 'react';
import {
  StyledDivider,
  StyledNavbar,
  StyledNavContainer,
  StyledNavFooter,
  StyledNavHeader,
  StyledNavigation,
  StyledUserInfo,
  StyledUsername,
  StyledUserPhoto
} from "./style";
import {Nav, NavDropdown} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../redux/store";
import {useTranslation} from 'react-i18next';

import {RxDashboard} from "react-icons/rx";
import {GrTransaction} from "react-icons/gr";
import {LuLineChart} from "react-icons/lu";
import {FiPieChart} from "react-icons/fi";
import {HiOutlineLogout} from "react-icons/hi";
import {setRoute} from "../../redux/userSlice";

export interface NavInterface {
  toggle: Dispatch<boolean>,
  visible: boolean,
}

const Navigation: FC<HTMLAttributes<HTMLDivElement> & NavInterface> = ({toggle, visible}) => {
  const navigate = useNavigate();
  const {t} = useTranslation();

  const dispatch = useDispatch<AppDispatch>();
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const route = useSelector((state: RootState) => state.user.route);

  const logout = () => {
    document.cookie = "token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    navigate('/login');
  }


  const ICON_SIZE = 30;


  return (
    <StyledNavigation visible={visible} toggle={toggle}>
      <StyledNavHeader>
        <StyledNavbar>
          <StyledNavContainer>
            <Nav.Link className={route === 'overview' ? 'nav-active' : ''} onClick={() => {
              toggle(false);
              dispatch(setRoute('overview'));
              navigate('/overview');
            }}><RxDashboard size={ICON_SIZE}/><p>{t('overview')}</p></Nav.Link>
          </StyledNavContainer>
          <StyledNavContainer>
            <Nav.Link className={route === 'transactions' ? 'nav-active' : ''} onClick={() => {
              toggle(false);
              dispatch(setRoute('transactions'));
              navigate('/transactions')
            }}><GrTransaction size={ICON_SIZE}/> <p>{t('transactions')}</p></Nav.Link>
          </StyledNavContainer>
          <StyledNavContainer>
            <NavDropdown
              className={/invest/.test(route) ? 'nav-active' : ''}
              title={<><LuLineChart size={ICON_SIZE}/> <p>{t('investments')}</p></>}
              id="basic-nav-dropdown"
            >
              <NavDropdown.Item
                className={route === 'investOverview' ? 'nav-active' : ''}
                onClick={() => {
                  toggle(false);
                  dispatch(setRoute('investOverview'));
                  navigate('/invest')
                }}
              >{t('overview')}</NavDropdown.Item>

              <StyledDivider theme='dark'/>
              <NavDropdown.Item className={route === 'invest/stocks' ? 'nav-active' : ''} onClick={() => {
                toggle(false);
                dispatch(setRoute('invest/stocks'));
                navigate('/invest/stocks');
              }}>{t('stocks')}</NavDropdown.Item>

              <NavDropdown.Item className={route === 'invest/crypto' ? 'nav-active' : ''} onClick={() => {
                toggle(false);
                dispatch(setRoute('invest/crypto'));
                navigate('/invest/crypto');
              }}>{t('crypto')}</NavDropdown.Item>

              <NavDropdown.Item className={route === 'invest/metals' ? 'nav-active' : ''} onClick={() => {
                toggle(false);
                dispatch(setRoute('invest/metals'));
                navigate('/invest/metals');
              }}>{t('metals')}</NavDropdown.Item>

              <NavDropdown.Item className={route === 'invest/other' ? 'nav-active' : ''} onClick={() => {
                toggle(false);
                dispatch(setRoute('invest/other'));
                navigate('/invest/other');
              }}>{t('other')}</NavDropdown.Item>
            </NavDropdown>
          </StyledNavContainer>
          <StyledNavContainer>
            <Nav.Link className={route === 'stats' ? 'nav-active' : ''} onClick={() => {
              toggle(false);
              dispatch(setRoute('stats'));
              navigate('/stats')
            }}><FiPieChart size={ICON_SIZE}/> <p>{t('statistics')}</p></Nav.Link>
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

        <HiOutlineLogout color={'rgba(255, 255, 255, 0.70'} onClick={logout} size={ICON_SIZE}/>
        {/*<VerticalMoreIcon/>*/}
      </StyledNavFooter>


    </StyledNavigation>
  );
};

export default Navigation;
