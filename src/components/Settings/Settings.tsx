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
import {StyledButton, StyledFormControl, StyledFormGroup, StyledFormLabel, StyledFormSelect} from "../Auth/styled";
import {changeProfileAsync, CurrencyEnum, IUser, LangEnum, setCurrency, setLang} from "../../redux/userSlice";
import {StatType} from "../../redux/statSlice";
import DefaultAvatar from "../../assets/DefaultAvatar/DefaultAvatar";

export enum SettingsType {
  profile = 'Profile',
  preferences = 'Preferences',
  auth = 'Auth',
}

const Settings: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const currentType = useSelector((state: RootState) => state.settings.type);
  const user = useSelector((state: RootState) => state.user.userInfo);
  const currentLang = useSelector((state: RootState) => state.user.lang);
  const currentCurr = useSelector((state: RootState) => state.user.currency);
  const [changedUser, setChangedUser] = useState<IUser>(user);

  const resetForm = () => setChangedUser(user);

  const handleProfileChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch(changeProfileAsync(changedUser as IUser));

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
        <StyledAuthForm>
          <StyledSettingsFormGroup className={'pass_wrap'}>
            <StyledSettingsFormGroup className={'pass'} controlId="oldPass">
              <StyledFormLabel>Old Password</StyledFormLabel>
              <StyledProfileControl
                type="password"
                name="oldPass"
                placeholder='*****'
                // value={formData.Email}
                // onChange={}
                required
              />
            </StyledSettingsFormGroup>
            <StyledSettingsFormGroup className={'pass'} controlId="newPass">
              <StyledFormLabel>Current Password</StyledFormLabel>
              <StyledProfileControl
                type="password"
                name="newPass"
                placeholder='*****'
                // value={formData.Email}
                // onChange={}
                required
              />
            </StyledSettingsFormGroup>
          </StyledSettingsFormGroup>
          <StyledButton className={'btn'} variant="success" type="submit">
            Change password
          </StyledButton>
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
            <StyledSettingsFormGroup controlId="name">
              <StyledFormLabel>Nickname</StyledFormLabel>
              <StyledProfileControl
                type="text"
                name="name"
                placeholder='Anton'
                defaultValue={changedUser.username}
                // value={formData.Email}
                // onChange={}
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
                // onChange={}
                required
              />
            </StyledSettingsFormGroup>
            <StyledSettingsFormGroup controlId="phone">
              <StyledFormLabel>Email</StyledFormLabel>
              <StyledProfileControl
                type="tel"
                name="phone"
                placeholder='123321123'
                defaultValue={changedUser.phoneNumber}
                // onChange={}
                required
              />
            </StyledSettingsFormGroup>
          </StyledSettingsFormGroup>

          <StyledButton variant="success" type="submit">
            Save profile changes
          </StyledButton>
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
