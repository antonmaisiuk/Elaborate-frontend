import React, {FC, HTMLAttributes} from 'react';
import {StyledLayout} from "./style";

const Layout : FC<HTMLAttributes<HTMLDivElement>> = ({children}) => {
  return (
    <StyledLayout>
      {children}
    </StyledLayout>
  );
};

export default Layout;
