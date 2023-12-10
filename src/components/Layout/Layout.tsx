import React, {FC, HTMLAttributes} from 'react';
import {StyledLayout} from "./style";
import {Row} from "react-bootstrap";

const Layout : FC<HTMLAttributes<HTMLDivElement>> = ({children}) => {
  return (
    <StyledLayout>
      {/*<Row>*/}
        {children}
      {/*</Row>*/}
    </StyledLayout>
  );
};

export default Layout;
