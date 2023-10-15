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

const ForgotPassword = () => {
  const [errorMsg, setErrorMsg] = useState('');
  const [formData, setFormData] = useState({
    Email: '',
  });

  const navigate = useNavigate();

  const responseMessage = (response: CredentialResponse) => {
    console.log(response);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const response = await fetch(`https://localhost:7247/api/Authentication/forgot-password?email=${formData.Email}`,
      {
        method: 'Post',
        headers: {'Content-Type': 'application/json'},
      })

    if (response.ok) {
      navigate('/login')
      // setRedirect(true);
      // window.location.reload();
    } else {
      const errorMsg = JSON.parse(await response.text());
      setErrorMsg(errorMsg.message);
      console.log(errorMsg.message);
    }
  };

  return (
    <AuthContainer>
      <AuthWrapper>
        <StyledAuthLogo>
          Elaborate
        </StyledAuthLogo>
        <StyledAuthHeader>
          Forgot Password?
        </StyledAuthHeader>
        <StyledAuthDescription>
          Enter your email address to get the password reset link.
        </StyledAuthDescription>
        <StyledForm onSubmit={handleForgotPassword}>
          <StyledFormGroup controlId="Email">
            <StyledFormLabel>Email Address</StyledFormLabel>
            <StyledFormControl
              type="email"
              name="Email"
              placeholder='antonmaisiuk@gmail.com'
              value={formData.Email}
              onChange={handleInputChange}
              required
            />
          </StyledFormGroup>

          {errorMsg && <StyledError> {errorMsg} </StyledError>}
          <StyledButton variant="success" type="submit">
            Password Reset
          </StyledButton>
        </StyledForm>
        <StyledOption>
          <StyledLink onClick={() => navigate('/login')}>Back to login</StyledLink>
        </StyledOption>
      </AuthWrapper>
    </AuthContainer>
  );
};

export default ForgotPassword;
