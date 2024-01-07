import React, { useState } from 'react';
import styled from 'styled-components';
import {
  AuthContainer,
  AuthWrapper, StyledAuthDescription,
  StyledAuthHeader, StyledAuthLogo, StyledButton, StyledError, StyledFogotPassword,
  StyledForm,
  StyledFormControl,
  StyledFormGroup,
  StyledFormLabel, StyledGoogleButton, StyledGoogleIcon, StyledLink, StyledOption
} from "../styled";
import {CredentialResponse} from "@react-oauth/google";
import {useNavigate} from "react-router-dom";

const EmailConfirm = () => {
  const navigate = useNavigate();


  return (
    <AuthContainer>
      <AuthWrapper>
        <StyledAuthLogo>
          Elaborate
        </StyledAuthLogo>
        <StyledAuthHeader>
          Email confirmed
        </StyledAuthHeader>
        <StyledAuthDescription>
          Your email address has been confirmed
        </StyledAuthDescription>
        <StyledButton className="success" onClick={() => navigate('/login')}>
          Go to login
        </StyledButton>
      </AuthWrapper>
    </AuthContainer>
  );
};

export default EmailConfirm;
