import React, {FC, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../redux/store';
import Layout from "../Layout/Layout";
import Navigation, {NavInterface} from "../Navigation/Navigation";
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
  StyledSettingsMenu, StyledSettingsHeader, StyledAvatarForm
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
  changeAvatarAsync,
  changePasswordAsync,
  changeProfileAsync, deleteAvatarAsync,
  getUserAsync, ILang,
  IUser,
  setCurrency, setIsDark,
  setLang
} from "../../redux/userSlice";
import {ColorRing} from "react-loader-spinner";
import {Tooltip} from "react-tooltip";
import OpenEyeIcon from "../../assets/OpenEye/OpenEyeIcon";
import CloseEyeIcon from "../../assets/CloseEye/CloseEyeIcon";
import validator from "validator";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {StyledButtonGroup} from "../Modal/style";
import {RxDashboard} from "react-icons/rx";
import {TiDeleteOutline} from "react-icons/ti";

export enum SettingsType {
  profile = 'Profile',
  // preferences = 'Preferences',
  auth = 'Auth',
}

const Settings: FC<NavInterface> = ({
                                      visible,
                                      toggle,
                                    }) => {
  const dispatch = useDispatch<AppDispatch>();
  const {t} = useTranslation();

  const currentType = useSelector((state: RootState) => state.settings.type);
  const user = useSelector((state: RootState) => state.user.userInfo);
  const userError = useSelector((state: RootState) => state.user.error);
  const currentLang = useSelector((state: RootState) => state.user.userInfo.lang);
  const currentCurr = useSelector((state: RootState) => state.user.userInfo.currency);
  const isDark = useSelector((state: RootState) => state.user.userInfo.isDarkScreen);
  const languages = useSelector((state: RootState) => state.user.languages);
  const currencies = useSelector((state: RootState) => state.user.currencies);

  const [isPassCorrect, setIsPassCorrect] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [successAvatarMsg, setSuccessAvatarMsg] = useState('');
  const [errorAvatarMsg, setErrorAvatarMsg] = useState('');

  const [toggleSpinner, setToggleSpinner] = useState(false);
  const [toggleAvatarSpinner, setToggleAvatarSpinner] = useState(false);

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {files} = event.target;

    if (files && files.length) {
      setChangedUser((prevData) => ({
        ...prevData,
        avatar: URL.createObjectURL(files[0]),
        avatarFile: files[0],
      }));
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = event.target;

    if (/pass/i.test(name)) {
      if (name === 'pass') {
        if (validator.isStrongPassword(value, {
          minLength: 8, minLowercase: 1,
          minUppercase: 1, minNumbers: 1, minSymbols: 1
        })) {
          setErrorMsg('');
          setIsPassCorrect(true);
          setSuccessMsg(t('settings.strongPass'))
        } else {
          setSuccessMsg('');
          setIsPassCorrect(false);
          setErrorMsg(t('settings.weakPass'))
        }
      } else {
        if (name === 'confirmPass' && changePass.pass !== value) {
          setIsPassCorrect(false);
          setSuccessMsg('');
          setErrorMsg(t('settings.diffPass'));
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
    }

    setChangedUser((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const resetForm = () => setChangedUser(user);

  const handleDeleteAvatar = async () => {
    setSuccessAvatarMsg('');
    setErrorAvatarMsg('');

    setToggleAvatarSpinner(true);
    await dispatch(deleteAvatarAsync());
    setToggleAvatarSpinner(false);

  }
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSuccessAvatarMsg('');
    setErrorAvatarMsg('');

    const { files } = e.target;
    if (files && files.length) {
      const { payload } = await dispatch(changeAvatarAsync({ ...changedUser, avatarFile: files[0]} as IUser));
      setToggleAvatarSpinner(false);

      if (payload) {
        setErrorMsg(payload.error);
        setTimeout(() => {
          setErrorMsg('')
        }, 3e3);
      } else {
        setSuccessAvatarMsg(t('settings.successAvatar'));
        setTimeout(() => {
          setSuccessAvatarMsg('')
        }, 3e3);
      }
      resetForm();
    }
  }

  const handleProfileChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    setToggleSpinner(true);

    console.log('👉 changedUser: ', changedUser);

    const {payload} = await dispatch(changeProfileAsync(changedUser as IUser));
    setToggleSpinner(false);

    if (payload) {
      setErrorMsg(payload.error);
      setTimeout(() => {
        setErrorMsg('')
      }, 3e3);
    } else {
      dispatch(getUserAsync());
      setSuccessMsg(t('settings.successProfile'));
      setTimeout(() => {
        setSuccessMsg('')
      }, 3e3);
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
    setSuccessMsg(t('settings.successPass'));
    setTimeout(() => {
      document.cookie = "token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
      navigate('/login');
    }, 5e3);
    // }

    resetForm();
  }

  const renderAuthType = () => {
    return (
      <StyledAuthContent>
        <StyledAuthForm onSubmit={handlePasswordChange}>
          {/*<StyledSettingsFormGroup className={'pass_wrap'}>*/}
          <StyledSettingsFormGroup className={'pass'} controlId="pass">
            <StyledFormLabel>{t('settings.newPass')}</StyledFormLabel>
            <StyledPassInputWrapper>
              <StyledProfileControl
                type={showPass ? 'text' : 'password'}
                name="pass"
                placeholder={t('settings.newPass')}
                onChange={handleInputChange}
                required
              />
              <StyledInputGroup id='password' onClick={() => setShowPass(!showPass)}>
                {showPass ? <OpenEyeIcon/> : <CloseEyeIcon/>}
              </StyledInputGroup>
            </StyledPassInputWrapper>
          </StyledSettingsFormGroup>
          <StyledSettingsFormGroup className={'pass'} controlId="confirmPass">
            <StyledFormLabel>
              {t('settings.confirmPass')}
              <StyledTooltip
                data-tooltip-id="password-tooltip"
                data-tooltip-html={t('settings.tooltip')}
                data-tooltip-place="right">
                ?
              </StyledTooltip>
            </StyledFormLabel>
            <StyledPassInputWrapper>
              <StyledProfileControl
                type={showPass ? 'text' : 'password'}
                name="confirmPass"
                placeholder={t('settings.confirmPass')}
                // value={formData.Email}
                onChange={handleInputChange}
                required
              />
              <StyledInputGroup id='password' onClick={() => setShowPass(!showPass)}>
                {showPass ? <OpenEyeIcon/> : <CloseEyeIcon/>}
              </StyledInputGroup>
            </StyledPassInputWrapper>
            <Tooltip id="password-tooltip" style={{whiteSpace: 'pre-line'}}/>
          </StyledSettingsFormGroup>
          {/*</StyledSettingsFormGroup>*/}
          <StyledButton variant="success" type="submit">
            {!toggleSpinner
              ? t('settings.changePass')
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
        <StyledAvatarForm>
          <StyledSettingsFormGroup className={'profile_avatar'} controlId="avatar">
            <span className={'delete_avatar'} onClick={handleDeleteAvatar}><TiDeleteOutline size={30} /></span>
            <img src={user.avatar} alt="Avatar"/>
            <StyledProfileControl type='file' name='avatar' accept='image/*' onChange={handleAvatarChange}/>
          </StyledSettingsFormGroup>
          {errorAvatarMsg && <StyledError> {errorAvatarMsg} </StyledError>}
          {successAvatarMsg && <StyledSuccess> {successAvatarMsg} </StyledSuccess>}
          {/*<StyledButtonGroup>*/}

            {/*<StyledButton variant="danger" onClick={handleDeleteAvatar}>*/}
            {/*  {!toggleAvatarSpinner*/}
            {/*    ? t('settings.deleteAvatar')*/}
            {/*    : <ColorRing*/}
            {/*      visible={true}*/}
            {/*      height="40"*/}
            {/*      width="40"*/}
            {/*      ariaLabel="spinner"*/}
            {/*      wrapperStyle={{}}*/}
            {/*      wrapperClass="blocks-wrapper"*/}
            {/*      colors={['#F4F5F7', '#F4F5F7', '#F4F5F7', '#F4F5F7', '#F4F5F7']}*/}
            {/*    />*/}
            {/*  }*/}
            {/*</StyledButton>*/}
            {/*<StyledButton variant="success" type="submit">*/}
            {/*  {!toggleAvatarSpinner*/}
            {/*    ? t('settings.saveAvatar')*/}
            {/*    : <ColorRing*/}
            {/*      visible={true}*/}
            {/*      height="40"*/}
            {/*      width="40"*/}
            {/*      ariaLabel="spinner"*/}
            {/*      wrapperStyle={{}}*/}
            {/*      wrapperClass="blocks-wrapper"*/}
            {/*      colors={['#F4F5F7', '#F4F5F7', '#F4F5F7', '#F4F5F7', '#F4F5F7']}*/}
            {/*    />*/}
            {/*  }*/}
            {/*</StyledButton>*/}
          {/*</StyledButtonGroup>*/}
        </StyledAvatarForm>

        <StyledProfileForm onSubmit={handleProfileChange}>
          <StyledSettingsFormGroup controlId="username">
            <StyledFormLabel>{t('settings.nickName')}</StyledFormLabel>
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
            <StyledFormLabel>{t('settings.email')}</StyledFormLabel>
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
            <StyledFormLabel>{t('settings.phone')}</StyledFormLabel>
            <StyledProfileControl
              type="tel"
              name="phoneNumber"
              placeholder='123321123'
              defaultValue={changedUser.phoneNumber}
              onChange={handleInputChange}
              required
            />
          </StyledSettingsFormGroup>
          <StyledSettingsFormGroup controlId="lang">
            <StyledFormLabel>{t('settings.lang')}:</StyledFormLabel>
            <StyledFormSelect onChange={(e) => dispatch(setLang(e.target.value))}>
              {
                languages.map((langObj) =>
                  (<option selected={currentLang === langObj.id} value={langObj.id}>{langObj.name}</option>))
              }
            </StyledFormSelect>
          </StyledSettingsFormGroup>
          <StyledSettingsFormGroup controlId="curr">
            <StyledFormLabel>{t('settings.curr')}:</StyledFormLabel>
            <StyledFormSelect onChange={(e) => dispatch(setCurrency(e.target.value))}>
              {
                currencies.map((currObj) =>
                  (<option selected={currentCurr === currObj.id} value={currObj.id}>{currObj.name}</option>))
              }
            </StyledFormSelect>
          </StyledSettingsFormGroup>
          <StyledSettingsFormGroup controlId="theme">
            <StyledFormLabel>{t('settings.theme')}:</StyledFormLabel>
            <StyledFormSelect onChange={(e) => dispatch(setIsDark(Boolean(e.target.value)))}>
              {
                <>
                  <option selected={isDark} value={1}>Dark</option>
                  <option selected={!isDark} value={0}>Light</option>
                </>
              }
            </StyledFormSelect>
          </StyledSettingsFormGroup>
          <StyledButton variant="success" type="submit">
            {!toggleSpinner
              ? t('settings.save')
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
        </StyledProfileForm>

        {/*</StyledSettingsFormGroup>*/}

        {errorMsg && <StyledError> {errorMsg} </StyledError>}
        {successMsg && <StyledSuccess> {successMsg} </StyledSuccess>}
        {/*</StyledProfileForm>*/}
      </StyledProfileContent>
    );
  }
  const getTemplateByType = () => {
    switch (currentType) {
      case SettingsType.profile:
        return renderProfileType();
      case SettingsType.auth:
        return renderAuthType();
      default:
        return (<h4>Incorrect type</h4>);
    }
  }

  return (
    <Layout>
      <Header toggle={toggle} visible={visible}/>
      <Navigation toggle={toggle} visible={visible}/>
      <Content onClick={() => toggle(false)}>
        <StyledTitle>{t('settings.settings')}</StyledTitle>

        <StyledSettings>
          <StyledSettingsMenu>
            {
              _.keys(SettingsType).map((type, i) =>
                (<li
                  className={currentType === _.values(SettingsType)[i] ? 'active' : ''}
                  value={type}
                  onClick={() => dispatch(setType(type))}
                >
                  {t(`settings.${_.values(SettingsType)[i]}`)}
                </li>))
            }
          </StyledSettingsMenu>
          {getTemplateByType()}
        </StyledSettings>

      </Content>
    </Layout>
  );
};

export default Settings;
