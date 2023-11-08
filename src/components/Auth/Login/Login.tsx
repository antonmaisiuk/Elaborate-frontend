import React, { useState } from 'react';
import styled from 'styled-components';
import {
  AuthContainer,
  AuthWrapper,
  StyledAuthHeader, StyledAuthLogo, StyledButton, StyledError, StyledFogotPassword,
  StyledForm,
  StyledFormControl,
  StyledFormGroup,
  StyledFormLabel, StyledGoogleButton, StyledGoogleIcon, StyledLink, StyledOption, StyledSuccess
} from "../styled";
import {CredentialResponse} from "@react-oauth/google";
import {useNavigate} from "react-router-dom";

const Login = () => {
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [is2FA, setIs2FA] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    code: null,
  });

  const navigate = useNavigate();

  const responseMessage = (response: CredentialResponse) => {
    console.log(response);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const response = await fetch(`https://localhost:7247/api/Authentication/login`,
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},

          body: JSON.stringify(formData)
        }
        );

      if (response.ok) {
        const resData = await response.text();
        const isTwoFactorEnabled = /sent/.test(JSON.parse(resData).message);
        if (isTwoFactorEnabled) {
          setIs2FA(true)
        } else {
          const { token, expiration } = JSON.parse(resData);
          setSuccessMsg('Successfully logged')
          document.cookie = `token=${token}; expires=${new Date(expiration).toUTCString()};`;

          navigate('/overview');
          window.location.reload();
        }
      } else {
        setErrorMsg(await response.text());
      }
    } catch (e) {
      setErrorMsg(`Unexpected error. Please try again with correct credentials.`);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  const handle2FA = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('👉 2FA: ', formData);
    // console.log('👉 Email: ', formData);
    const response = await fetch(`https://localhost:7247/api/Authentication/login-2FA?code=${formData.code}&email=${formData.email}`,
      {
        method: 'Post',
        headers: {'Content-Type': 'application/json'},
      })

    if (response.ok) {
      const { token, expiration } = JSON.parse(await response.text());
      setSuccessMsg('Successfully logged')
      document.cookie = `token:${token}, expires=${expiration}`

      navigate('/overview');
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
          {/*<StyledForm onSubmit={ (e: React.FormEvent<HTMLFormElement>) => {is2FA ? handle2FA : handleLogin(e, formData, setErrorMsg, setIs2FA )}}>*/}
          <StyledForm onSubmit={ is2FA ? handle2FA : handleLogin}>
            {is2FA ?
              <StyledFormGroup controlId="code">
                <StyledFormLabel>Your 2FA-code</StyledFormLabel>
                <StyledFormControl
                  type="number"
                  name="code"
                  placeholder='123456'
                  // value={formData.Email}
                  onChange={handleInputChange}
                  required
                />
              </StyledFormGroup> :
              <>
                <StyledFormGroup controlId="email">
                <StyledFormLabel>Email</StyledFormLabel>
                <StyledFormControl
                  type="email"
                  name="email"
                  placeholder='antonmaisiuk@gmail.com'
                  // value={formData.Email}
                  onChange={handleInputChange}
                  required/>
                </StyledFormGroup><StyledFormGroup controlId="password">
                  <StyledFormLabel>
                    Password
                    <StyledFogotPassword onClick={() => navigate('/forgot')}>Forgot Password?</StyledFogotPassword>
                  </StyledFormLabel>

                  <StyledFormControl
                    type="password"
                    name="password"
                    placeholder='********'
                    // value={formData.Password}
                    onChange={handleInputChange}
                    required/>
                </StyledFormGroup>
              </>
            }
            {errorMsg && <StyledError> {errorMsg} </StyledError>}
            {successMsg && <StyledSuccess> {successMsg} </StyledSuccess>}

            <StyledButton variant="success" type="submit">
              {is2FA ? 'Confirm' : 'Login'}
            </StyledButton>
          </StyledForm>
          <StyledOption>
            or sign up with
          </StyledOption>
          <StyledGoogleButton onSuccess={responseMessage}/>
          <StyledOption>
            {
              is2FA
                ? <StyledLink onClick={() => setIs2FA(false)}>Back to login</StyledLink>
                : <StyledLink onClick={() => navigate('/register')}>Create an account</StyledLink>
            }

          </StyledOption>
        </AuthWrapper>
      </AuthContainer>



  );
};

export default Login;