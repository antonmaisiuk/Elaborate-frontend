import React, {FC, HTMLAttributes} from 'react';
import {StyledDate} from "./style";
import Moment from 'react-moment';
import ChevronsRight from "../../assets/ChevronsRight/ChevronsRight";

interface HeaderInterface {
  userName: string,
}

const Header: FC<HTMLAttributes<HTMLDivElement>> = () => {
  return (
    <>
      <StyledDate>
        <ChevronsRight/>
        {/*May 19, 2023*/}
        <Moment format='MMM DD, YYYY'/>
      </StyledDate></>
  );
};

export default Header;
