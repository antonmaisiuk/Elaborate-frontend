import React, { useState } from 'react';
import styled from 'styled-components';
import {
  AuthContainer,
  AuthWrapper,
  StyledAuthHeader,
  StyledAuthLogo,
  StyledButton,
  StyledError,
  StyledFogotPassword,
  StyledForm,
  StyledFormControl,
  StyledFormGroup,
  StyledFormLabel,
  StyledGoogleButton,
  StyledGoogleIcon,
  StyledInputGroup,
  StyledLink,
  StyledOption,
  StyledPassInputWrapper,
  StyledSuccess
} from "../styled";
import {CredentialResponse} from "@react-oauth/google";
import {NavigateFunction, useNavigate} from "react-router-dom";
import {ColorRing} from "react-loader-spinner";
import {fetchTransactionsAsync, fetchTransCatsAsync} from "../../../redux/transactionSlice";
import {fetchBasicInvestsAsync, fetchInvestCatsAsync, fetchItemsAsync} from "../../../redux/basicInvestSlice";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../../redux/store";
import {setUser} from "../../../redux/userSlice";
import OpenEyeIcon from "../../../assets/OpenEye/OpenEyeIcon";
import CloseEyeIcon from "../../../assets/CloseEye/CloseEyeIcon";
import {jwtDecode} from "jwt-decode";
import {fetchRegister} from "../Registration/Registration";


export interface ILoginUser {
  email: string,
  password: string,
  code: number,
}

export const fetchLogin = async (data: any) => {
  return fetch(`${process.env.REACT_APP_API_URL}/api/Authentication/login`,
    {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},

      body: JSON.stringify(data)
    });
}

const successLoginRes = async (
  response: Response,
  responseText: string,
  dispatch: any,
  setIs2FA: React.Dispatch<React.SetStateAction<boolean>>,
  setSpinnerActive: React.Dispatch<React.SetStateAction<boolean>>,
  setSuccessMsg: React.Dispatch<React.SetStateAction<string>>,
  navigate: NavigateFunction) => {

  const isTwoFactorEnabled = /sent/.test(JSON.parse(responseText).message);
  if (isTwoFactorEnabled) {
    setIs2FA(true)
  } else {
    const { token, expiration, userDetails:user } = JSON.parse(responseText);
    document.cookie = `token=${token}; expires=${new Date(expiration).toUTCString()};`;

    dispatch(setUser({
      ...user,
      avatar: user.photoFileName || 'https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg',
      role: 'user',
    }))

    // await dispatch(fetchTransactionsAsync()).then(() =>
    //   dispatch(fetchTransCatsAsync())
    // );
    //
    // await dispatch(fetchItemsAsync()).then(() => {
    //   dispatch(fetchBasicInvestsAsync()).then(() => {
    //     dispatch(fetchInvestCatsAsync())
    //   })
    // });

    setSpinnerActive(false);
    setSuccessMsg('Successfully logged')


    setTimeout(() => {
      navigate('/overview');
      // window.location.reload();
    }, 2e2);
  }
}

const Login = () => {
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [is2FA, setIs2FA] = useState(false);
  const [spinnerActive, setSpinnerActive] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    code: null,
  });

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleGoogle = async ({ credential }: CredentialResponse) => {
    setErrorMsg('');
    setSuccessMsg('');
    setSpinnerActive(true);

    if (credential){
      // @ts-ignore
      const { email, name, sub } = jwtDecode(credential);
      console.log('👉 decode: ', email, name, sub);
      const googleUser = {
        email,
        password: `${email}/${sub}/aA1.`,
        code: null,
      };

      console.log('👉 New user data: ', formData);

      const loginResponse = await fetchLogin(googleUser);
      const loginResponseText = await loginResponse.text();

      if (loginResponse.ok) {
        console.log('👉 Old google user!');
        await successLoginRes(loginResponse, loginResponseText, dispatch, setIs2FA, setSpinnerActive, setSuccessMsg, navigate);

      } else if(loginResponseText === 'This account does not exist!') {
        console.log('👉 New google user!');
        const registerResponse = await fetchRegister({
          username: name.replaceAll(' ', '-'),
          email: email,
          phoneNumber: null,
          password: `${email}/${sub}/aA1.`,
          // role: 'user'
        });

        if (registerResponse.ok) {
          const newUserLoginResp = await fetchLogin(googleUser);

          if (newUserLoginResp.ok){
            await successLoginRes(loginResponse, loginResponseText, dispatch, setIs2FA, setSpinnerActive, setSuccessMsg, navigate);
          } else {
            const errorMsg = JSON.parse(await newUserLoginResp.text());
            setSpinnerActive(false);
            setErrorMsg(errorMsg.title || errorMsg.message);
          }
        } else {
          const errorMsg = JSON.parse(await registerResponse.text());
          setSpinnerActive(false);
          setErrorMsg(errorMsg.title || errorMsg.message);
        }
      } else if(JSON.parse(loginResponseText).message === 'Invalid password') {
        setSpinnerActive(false);
        setErrorMsg('Please, login using email & password');
      } else {
        const errorMsg = JSON.parse(loginResponseText);
        setSpinnerActive(false);
        setErrorMsg(errorMsg.title || errorMsg.message);
      }
    }
  };

  const handleLogin = async (e?: React.FormEvent<HTMLFormElement>) => {
    e && e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setSpinnerActive(true);

    try {
      const response = await fetchLogin(formData);

      if (response.ok) {
        await successLoginRes(response, await response.text(), dispatch, setIs2FA, setSpinnerActive, setSuccessMsg, navigate);
      } else {
        setErrorMsg(await response.text());
        setSpinnerActive(false);
      }
    } catch (e) {
      setErrorMsg(`Unexpected error. Please try again with correct credentials.`);
      setSpinnerActive(false);
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
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/Authentication/login-2FA?code=${formData.code}&email=${formData.email}`,
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

  const getButtonContent = () =>{
    if (is2FA && !spinnerActive) return 'Confirm';
    if (!is2FA && !spinnerActive) return 'Login';

    return (
      <ColorRing
        visible={spinnerActive}
        height="40"
        width="40"
        ariaLabel="spinner"
        wrapperStyle={{}}
        wrapperClass="blocks-wrapper"
        colors={['#F4F5F7', '#F4F5F7', '#F4F5F7', '#F4F5F7', '#F4F5F7']}
      />
    )
  }

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
                <StyledPassInputWrapper>
                  <StyledFormControl
                    type={showPass ? 'text' : 'password'}
                    name="password"
                    className='combined_input'
                    placeholder='********'
                    onChange={handleInputChange}
                    required
                  />
                  <StyledInputGroup id='password' onClick={() => setShowPass(!showPass)} >
                    {showPass ? <OpenEyeIcon/> : <CloseEyeIcon/>}
                  </StyledInputGroup>
                </StyledPassInputWrapper>
                </StyledFormGroup>
              </>
            }

            {errorMsg && <StyledError> {errorMsg} </StyledError>}
            {successMsg && <StyledSuccess> {successMsg} </StyledSuccess>}

            <StyledButton className="success" type="submit">
              {getButtonContent()}
            </StyledButton>
          </StyledForm>
          <StyledOption>
            or sign up with
          </StyledOption>
          <StyledGoogleButton onError={() => setErrorMsg('Login Failed')} onSuccess={handleGoogle}/>
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
