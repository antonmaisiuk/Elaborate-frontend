import React, { useState } from 'react';
import styled from 'styled-components';
import {
  AuthContainer,
  AuthWrapper, StyledAuthDescription,
  StyledAuthHeader, StyledAuthLogo, StyledButton, StyledError, StyledFogotPassword,
  StyledForm,
  StyledFormControl,
  StyledFormGroup,
  StyledFormLabel, StyledGoogleButton, StyledGoogleIcon, StyledLink, StyledOption, StyledSuccess
} from "../styled";
import {CredentialResponse} from "@react-oauth/google";
import {useNavigate, useSearchParams} from "react-router-dom";

const SetNewPassword = () => {
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [searchParams, setSearchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    Email: searchParams.get('email'),
    Password: '',
    ConfirmPassword: '',
    Token: searchParams.get('token'),
  });
  console.log('👉 init Form data: ', formData);

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

    if (name === 'ConfirmPassword' && formData.Password !== formData.ConfirmPassword) setErrorMsg('Passwords aren\'t the same');
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (formData.Password !== formData.ConfirmPassword) {
      const response = await fetch(`https://localhost:7247/api/Authentication/forgot-password?email=${formData.Email}`,
        {
          method: 'Post',
          headers: {'Content-Type': 'application/json'},
        })
      const obj = JSON.parse(await response.text());


      if (response.ok) {
        setErrorMsg('');
        setSuccessMsg(obj.message);

        setTimeout(() => navigate('/login'), 5e3)
        // navigate('/login');
        // setRedirect(true);
        // window.location.reload();
      } else {
        setSuccessMsg('');
        setErrorMsg(obj.message);
      }
    } else {
      setErrorMsg('Passwords aren\'t the same');
    }
  };

  return (
    <AuthContainer>
      <AuthWrapper>
        <StyledAuthLogo>
          Elaborate
        </StyledAuthLogo>
        <StyledAuthHeader>
          New Password
        </StyledAuthHeader>
        <StyledAuthDescription>
          Enter your new password.
        </StyledAuthDescription>
        <StyledForm onSubmit={handleResetPassword}>
          <StyledFormGroup controlId="password">
            <StyledFormLabel>New password</StyledFormLabel>
            <StyledFormControl
              type="password"
              name="Password"
              placeholder='********'
              value={formData.Password}
              onChange={handleInputChange}
              required
            />
            <StyledFormLabel>Confirm Password</StyledFormLabel>
            <StyledFormControl
              type="password"
              name="ConfirmPassword"
              placeholder='********'
              value={formData.ConfirmPassword}
              onChange={handleInputChange}
              required
            />
          </StyledFormGroup>

          {errorMsg && <StyledError> {errorMsg} </StyledError>}
          {successMsg && <StyledSuccess> {successMsg} </StyledSuccess>}

          <StyledButton variant="success" type="submit">
            Set new password
          </StyledButton>
        </StyledForm>
        <StyledOption>
          <StyledLink onClick={() => navigate('/login')}>Back to login</StyledLink>
        </StyledOption>
      </AuthWrapper>
    </AuthContainer>
  );
};

export default SetNewPassword;
