import React, { useState } from 'react';
import {
  AuthContainer,
  AuthWrapper,
  StyledAuthHeader, StyledAuthLogo, StyledButton, StyledError, StyledSuccess,
  StyledForm,
  StyledFormControl,
  StyledFormGroup,
  StyledFormLabel, StyledGoogleButton, StyledLink, StyledOption
} from "../styled";
import {CredentialResponse, GoogleLogin} from "@react-oauth/google";
import {useNavigate} from "react-router-dom";
import {ColorRing} from "react-loader-spinner";

const Registration = () => {
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [spinnerActive, setSpinnerActive] = useState(false);
  const [formData, setFormData] = useState({
    Username: '',
    Email: '',
    Password: '',
    PhoneNumber: null,
    Role: 'user'
  });

  const navigate = useNavigate();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const responseMessage = (response: CredentialResponse) => {
    console.log(response);
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrorMsg('');
    setSuccessMsg('');
    setSpinnerActive(true);

    const response = await fetch(`https://localhost:7247/api/Authentication`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

    if (response.ok) {
      setSpinnerActive(false);
      setSuccessMsg('Registration completed successfully');
      setTimeout(() => {
        navigate('/login')
        window.location.reload();
      }, 15e2)

    } else {
      const errorMsg = JSON.parse(await response.text());
      setSpinnerActive(false);
      setErrorMsg(errorMsg.title || errorMsg.message);
    }
  };

  return (
    <AuthContainer>
      <AuthWrapper>
        <StyledAuthLogo>
          Elaborate
        </StyledAuthLogo>
        <StyledAuthHeader>
          Create an account
        </StyledAuthHeader>
        <StyledForm onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleRegister(e)}>
          <StyledFormGroup controlId="Username">
            <StyledFormLabel>Name</StyledFormLabel>
            <StyledFormControl
              type="text"
              name="Username"
              placeholder='Anton Maisiuk'
              onChange={handleInputChange}
              required
            />
          </StyledFormGroup>

          <StyledFormGroup controlId="Email">
            <StyledFormLabel>Email</StyledFormLabel>
            <StyledFormControl
              type="Email"
              name="Email"
              placeholder='antonmaisiuk@gmail.com'
              onChange={handleInputChange}
              required
            />
          </StyledFormGroup>

          <StyledFormGroup controlId="PhoneNumber">
            <StyledFormLabel>Phone number</StyledFormLabel>
            <StyledFormControl
              type="tel"
              name="PhoneNumber"
              placeholder='48793735286'
              onChange={handleInputChange}
            />
          </StyledFormGroup>

          <StyledFormGroup controlId="Password">
            <StyledFormLabel>Password</StyledFormLabel>
            <StyledFormControl
              type="Password"
              name="Password"
              placeholder='********'
              onChange={handleInputChange}
              required
            />
          </StyledFormGroup>

          {errorMsg && <StyledError> {errorMsg} </StyledError>}
          {successMsg && <StyledSuccess> {successMsg} </StyledSuccess>}
          <StyledButton variant="success" type="submit">
            {spinnerActive ?
                <ColorRing
                    visible={spinnerActive}
                    height="40"
                    width="40"
                    ariaLabel="spinner"
                    wrapperStyle={{}}
                    wrapperClass="blocks-wrapper"
                    colors={['#F4F5F7', '#F4F5F7', '#F4F5F7', '#F4F5F7', '#F4F5F7']}
                />
              : 'Sign up'
            }
          </StyledButton>
        </StyledForm>
        <StyledOption>
          or sign up with
        </StyledOption>
        <StyledGoogleButton onSuccess={responseMessage}/>
        <StyledOption>
          Already have an account? <StyledLink onClick={() => navigate('/login')}>Sign in here</StyledLink>
        </StyledOption>
      </AuthWrapper>
    </AuthContainer>
  );
};

export default Registration;
