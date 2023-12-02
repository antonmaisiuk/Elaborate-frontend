import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../redux/store';
import Layout from "../Layout/Layout";
import Navigation from "../Navigation/Navigation";
import Content from "../Content/Content";
import Header from "../Header/Header";
import {StyledTitle} from "../Transactions/style";
import {
  StyledAuthContent, StyledAuthForm,
  StyledPrefContent,
  StyledPrefWrapper, StyledProfileContent,
  StyledProfileControl,
  StyledProfileForm,
  StyledSettingsFormGroup,
  StyledSettings,
  StyledSettingsMenu, StyledSettingsHeader
} from "./styled";
import _ from "lodash";
import {setType} from "../../redux/settingsSlice";
import {
  StyledButton,
  StyledError,
  StyledFormControl,
  StyledFormGroup,
  StyledFormLabel,
  StyledFormSelect, StyledInputGroup, StyledPassInputWrapper, StyledSuccess, StyledTooltip
} from "../Auth/styled";
import {
  changePasswordAsync,
  changeProfileAsync,
  CurrencyEnum,
  getUserAsync,
  IUser,
  LangEnum,
  setCurrency,
  setLang
} from "../../redux/userSlice";
import {ColorRing} from "react-loader-spinner";
import {Tooltip} from "react-tooltip";
import OpenEyeIcon from "../../assets/OpenEye/OpenEyeIcon";
import CloseEyeIcon from "../../assets/CloseEye/CloseEyeIcon";
import validator from "validator";
import {useNavigate} from "react-router-dom";

export enum SettingsType {
  profile = 'Profile',
  preferences = 'Preferences',
  auth = 'Auth',
}

const Settings: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const currentType = useSelector((state: RootState) => state.settings.type);
  const user = useSelector((state: RootState) => state.user.userInfo);
  const userError = useSelector((state: RootState) => state.user.error);
  const currentLang = useSelector((state: RootState) => state.user.lang);
  const currentCurr = useSelector((state: RootState) => state.user.currency);

  const [isPassCorrect, setIsPassCorrect] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [toggleSpinner, setToggleSpinner] = useState(false);

  const [changedUser, setChangedUser] = useState<IUser>(user);
  const [changePass, setChangePass] = useState<{ pass: string, confirmPass: string, email: string }>({
    pass: '',
    confirmPass: '',
    email: user.email,
  });

  useEffect(() => {
    setChangedUser(user);
  }, [user]);

  const navigate = useNavigate();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = event.target;

    console.log('👉 name: ', name);
    if (/pass/i.test(name)) {
      if (name === 'pass') {
        if (validator.isStrongPassword(value, {
          minLength: 8, minLowercase: 1,
          minUppercase: 1, minNumbers: 1, minSymbols: 1
        })) {
          setErrorMsg('');
          setIsPassCorrect(true);
          setSuccessMsg('Strong password')
        } else {
          setSuccessMsg('');
          setIsPassCorrect(false);
          setErrorMsg('New password is\'t strong.')
        }
      } else  {
        if (name === 'confirmPass' && changePass.pass !== value) {
          setIsPassCorrect(false);
          setSuccessMsg('');
          setErrorMsg('Passwords aren\'t the same');
        } else {
          setIsPassCorrect(true);
          setSuccessMsg('');
          setErrorMsg('');
        }
      }

      setChangePass((prevData) => ({
        ...prevData,
        [name]: value,
      }));



      console.log('👉 change pass: ', changePass);
    }


    setChangedUser((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const resetForm = () => setChangedUser(user);

  const handleProfileChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    setToggleSpinner(true);

    const { payload } = await dispatch(changeProfileAsync(changedUser as IUser));
    setToggleSpinner(false);

    if (payload){
      setErrorMsg(payload.error);
      setTimeout(() => {setErrorMsg('')}, 3e3);
    } else {
      dispatch(getUserAsync());
      setSuccessMsg('Profile was updated successfully');
      setTimeout(() => {setSuccessMsg('')}, 3e3);
    }


    resetForm();
  }
  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    setToggleSpinner(true);

    await dispatch(changePasswordAsync(changePass));
    setToggleSpinner(false);

    // if (payload){
    //   setErrorMsg(payload.error);
    //   setTimeout(() => {setErrorMsg('')}, 3e3);
    // } else {
      // dispatch(getUserAsync());
      setSuccessMsg('Password was updated successfully. Please login again.');
      setTimeout(() => {
        document.cookie = "token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
        navigate('/login');
      }, 5e3);
    // }

    resetForm();
  }

  const renderPreferencesType = () => {
    return (
        <StyledPrefContent>
          <StyledPrefWrapper>
            <StyledFormLabel>Language:</StyledFormLabel>
            <StyledFormSelect onChange={(e) => dispatch(setLang(e.target.value))}>
              {
                _.keys(LangEnum).map((type, i) =>
                  (<option selected={currentLang === _.values(LangEnum)[i]} value={type}>{_.values(LangEnum)[i]}</option>))
              }
            </StyledFormSelect>
          </StyledPrefWrapper>
          <StyledPrefWrapper>
            <StyledFormLabel>Currency:</StyledFormLabel>
            <StyledFormSelect onChange={(e) => dispatch(setCurrency(e.target.value))}>
              {
                _.keys(CurrencyEnum).map((type, i) =>
                  (<option selected={currentCurr === _.values(CurrencyEnum)[i]} value={type}>{_.values(CurrencyEnum)[i]}</option>))
              }
            </StyledFormSelect>
          </StyledPrefWrapper>
        </StyledPrefContent>
    );
  }
  const renderAuthType = () => {
    return (
      <StyledAuthContent>
        <StyledAuthForm onSubmit={handlePasswordChange}>
          <StyledSettingsFormGroup className={'pass_wrap'}>
            <StyledSettingsFormGroup className={'pass'} controlId="pass">
              <StyledFormLabel>New Password</StyledFormLabel>
              <StyledPassInputWrapper>
                <StyledProfileControl
                  type={showPass ? 'text' : 'password'}
                  name="pass"
                  placeholder='Your new password'
                  onChange={handleInputChange}
                  required
                />
                <StyledInputGroup id='password' onClick={() => setShowPass(!showPass)} >
                  {showPass ? <OpenEyeIcon/> : <CloseEyeIcon/>}
                </StyledInputGroup>
              </StyledPassInputWrapper>
            </StyledSettingsFormGroup>
            <StyledSettingsFormGroup className={'pass'} controlId="confirmPass">
              <StyledFormLabel>
                Confirm Password
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
                <StyledProfileControl
                  type={showPass ? 'text' : 'password'}
                  name="confirmPass"
                  placeholder='Confirm password'
                  // value={formData.Email}
                  onChange={handleInputChange}
                  required
                />
                <StyledInputGroup id='password' onClick={() => setShowPass(!showPass)} >
                  {showPass ? <OpenEyeIcon/> : <CloseEyeIcon/>}
                </StyledInputGroup>
              </StyledPassInputWrapper>
              <Tooltip id="password-tooltip" style={{whiteSpace: 'pre-line'}} />
            </StyledSettingsFormGroup>
          </StyledSettingsFormGroup>
          <StyledButton variant="success" type="submit">
            { !toggleSpinner
              ? 'Change password'
              : <ColorRing
                visible={true}
                height="40"
                width="40"
                ariaLabel="spinner"
                wrapperStyle={{}}
                wrapperClass="blocks-wrapper"
                colors={['#F4F5F7', '#F4F5F7', '#F4F5F7', '#F4F5F7', '#F4F5F7']}
              />
            }
          </StyledButton>
          {errorMsg && <StyledError> {errorMsg} </StyledError>}
          {successMsg && <StyledSuccess> {successMsg} </StyledSuccess>}
        </StyledAuthForm>

      </StyledAuthContent>
    );
  }
  const renderProfileType = () => {
    return (
      <StyledProfileContent>
        <StyledProfileForm className={'changeProfile'} onSubmit={handleProfileChange}>
          <StyledSettingsFormGroup className={'profile_avatar'} controlId="photo">
            <img src={user.avatar} alt="Avatar"/>
            <StyledProfileControl type='file' name='photo' accept='image/*'/>
          </StyledSettingsFormGroup>

          <StyledSettingsFormGroup className={'profile_other'}>
            <StyledSettingsFormGroup controlId="username">
              <StyledFormLabel>Nickname</StyledFormLabel>
              <StyledProfileControl
                type="text"
                name="username"
                placeholder='Anton'
                defaultValue={changedUser.username}
                // value={formData.Email}
                onChange={handleInputChange}
                required
              />
            </StyledSettingsFormGroup>
            <StyledSettingsFormGroup controlId="email">
              <StyledFormLabel>Email</StyledFormLabel>
              <StyledProfileControl
                type="email"
                name="email"
                placeholder='123@gmail.com'
                defaultValue={changedUser.email}
                onChange={handleInputChange}
                required
              />
            </StyledSettingsFormGroup>
            <StyledSettingsFormGroup controlId="phoneNumber">
              <StyledFormLabel>Email</StyledFormLabel>
              <StyledProfileControl
                type="tel"
                name="phoneNumber"
                placeholder='123321123'
                defaultValue={changedUser.phoneNumber}
                onChange={handleInputChange}
                required
              />
            </StyledSettingsFormGroup>
          </StyledSettingsFormGroup>

          <StyledButton variant="success" type="submit">
            { !toggleSpinner
              ? 'Save profile changes'
              : <ColorRing
                visible={true}
                height="40"
                width="40"
                ariaLabel="spinner"
                wrapperStyle={{}}
                wrapperClass="blocks-wrapper"
                colors={['#F4F5F7', '#F4F5F7', '#F4F5F7', '#F4F5F7', '#F4F5F7']}
              />
            }
          </StyledButton>
          {errorMsg && <StyledError> {errorMsg} </StyledError>}
          {successMsg && <StyledSuccess> {successMsg} </StyledSuccess>}
        </StyledProfileForm>
      </StyledProfileContent>
    );
  }
  const getTemplateByType = () => {
    switch (currentType) {
      case SettingsType.profile:
        return renderProfileType();
      case SettingsType.preferences:
        return renderPreferencesType();
      case SettingsType.auth:
        return renderAuthType();
      default:
        return (<h4>Incorrect type</h4>);
    }
  }

  return (
    <Layout>
      <Navigation/>
      <Content>
        <Header/>
        <StyledTitle>Settings</StyledTitle>

        <StyledSettings>
          <StyledSettingsMenu>
            {
              _.keys(SettingsType).map((type, i) =>
                (<li
                  className={currentType === _.values(SettingsType)[i] ? 'active' : ''}
                  value={type}
                  onClick={() => dispatch(setType(type))}
                >
                  {_.values(SettingsType)[i]}
                </li>))
            }
            {/*<li>Profile</li>*/}
            {/*<li>Preferences</li>*/}
            {/*<li>Auth</li>*/}
          </StyledSettingsMenu>
          {/*<StyledSettingsContent>*/}
            {getTemplateByType()}
          {/*</StyledSettingsContent>*/}
        </StyledSettings>

      </Content>
    </Layout>
  );
  };

  export default Settings;
