import React, {FC, HTMLAttributes} from 'react';
import {StyledContent} from "./style";

const Content : FC<HTMLAttributes<HTMLDivElement>> = ({children}) => {
  return (
    <StyledContent>
      {children}
    </StyledContent>
  );
};

export default Content;
