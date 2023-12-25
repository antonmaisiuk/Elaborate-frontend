import React, { useState } from 'react';
import {
  AuthContainer,
  AuthWrapper,
  StyledAuthHeader,
  StyledAuthLogo,
  StyledButton,
  StyledError,
  StyledSuccess,
  StyledForm,
  StyledFormControl,
  StyledFormGroup,
  StyledFormLabel,
  StyledGoogleButton,
  StyledLink,
  StyledOption,
  StyledTooltip,
  StyledFogotPassword,
  StyledPassInputWrapper, StyledInputGroup
} from "../styled";
import {CredentialResponse, GoogleLogin} from "@react-oauth/google";
import {useNavigate} from "react-router-dom";
import {ColorRing} from "react-loader-spinner";
import validator from 'validator';
import { Tooltip } from 'react-tooltip'
import {Button, Form, InputGroup} from "react-bootstrap";
import OpenEyeIcon from '../../../assets/OpenEye/OpenEyeIcon';
import CloseEyeIcon from "../../../assets/CloseEye/CloseEyeIcon";


export const fetchRegister = async (data: any) => {
  return await fetch(`${process.env.REACT_APP_API_URL}/api/Authentication`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
}

const Registration = () => {
  const [isPassCorrect, setIsPassCorrect] = useState(false);
  const [showPass, setShowPass] = useState(false);
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

    if (name === 'Password') {
      if (validator.isStrongPassword(value, {
        minLength: 8, minLowercase: 1,
        minUppercase: 1, minNumbers: 1, minSymbols: 1
      })) {
        setErrorMsg('');
        setIsPassCorrect(true);
        setSuccessMsg('Strong Password')
      } else {
        setSuccessMsg('');
        setIsPassCorrect(false);
        setErrorMsg('Is\'t Strong Password')
      }
    }

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

    if (!isPassCorrect) {
      setErrorMsg('Please, check you password');

      return false;
    }

    setSpinnerActive(true);

    const response = await fetchRegister(formData);

    if (response.ok) {
      setSpinnerActive(false);
      setSuccessMsg('Registration completed successfully. Please, confirm you email.');
      setTimeout(() => {
        navigate('/login')
        window.location.reload();
      }, 3e3)

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
            <StyledFormLabel>Nickname</StyledFormLabel>
            <StyledFormControl
              type="text"
              name="Username"
              placeholder='Anton'
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
            <StyledFormLabel>
              Password
              <StyledTooltip
                data-tooltip-id="password-tooltip"
                data-tooltip-html='The password must have at least:
                <ul>
                  <li>8 characters</li>
                  <li>1 lowercase and uppercase letter</li>
                  <li>1 number</li>
                  <li>1 symbol</li>
                </ul>'
                data-tooltip-place="right">
                ?
              </StyledTooltip>
            </StyledFormLabel>
            <StyledPassInputWrapper>
              <StyledFormControl
                type={showPass ? 'text' : 'password'}
                name="Password"
                placeholder='********'
                onChange={handleInputChange}
                aria-describedby="password"
                required
              />
              <StyledInputGroup id='password' onClick={() => setShowPass(!showPass)} >
                {showPass ? <OpenEyeIcon/> : <CloseEyeIcon/>}
              </StyledInputGroup>
            </StyledPassInputWrapper>
            <Tooltip id="password-tooltip" style={{whiteSpace: 'pre-line'}} />
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
