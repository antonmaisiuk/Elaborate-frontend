import React, {Dispatch, FC, HTMLAttributes} from 'react';
import {StyledDate, StyledHeader, StyledNavLogo} from "./style";
import Moment from 'react-moment';
import ChevronsRight from "../../assets/ChevronsRight/ChevronsRight";
import {useNavigate} from "react-router-dom";
import {FaBars} from "react-icons/fa6";

interface HeaderInterface {
  toggle: Dispatch<boolean>,
  visible: boolean,
}

const Header: FC<HTMLAttributes<HTMLDivElement> & HeaderInterface>  = ({toggle, visible}) => {
  const navigate = useNavigate();

  return (
    <StyledHeader>
      <StyledNavLogo toggle={toggle} visible={visible}>
        <div className="mobile-nav">
          <button
            className="mobile-nav-btn"
            onClick={() => toggle(!visible)}
          >
            <FaBars color={'rgba(255, 255, 255, 0.70'} size={30}  />
          </button>
        </div>
        <h2 onClick={() => navigate('/overview')}>Elaborate</h2>
        <h2 onClick={() => navigate('/overview')} className={'nav-logo-small'}>E</h2>
      </StyledNavLogo>
      <StyledDate>
        <ChevronsRight/>
        {/*May 19, 2023*/}
        <Moment format='MMM DD, YYYY'/>
      </StyledDate>
    </StyledHeader>

  );
};

export default Header;
