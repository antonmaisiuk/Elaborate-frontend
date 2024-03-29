import styled from 'styled-components';
import {Form} from "react-bootstrap";

export const StyledSettings = styled.div`
  display: flex;
  padding: 0 28px 28px 28px;
  flex-direction: column;
  align-items: start;
  align-self: stretch;

  border-radius: 16px;
  background: #fff;
  box-shadow: 0 20px 25px 0 rgba(76, 103, 100, 0.10);
  margin-top: 15px;

`;

export const StyledProfileContent = styled.div`
  width: 100%;
  height: 100%;
  
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  .settings_save{
    width: 40%;
    min-width: 200px;
    max-width: 350px;
  }
`;
export const StyledAuthContent = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  align-content: center;
  justify-content: center;
  gap: 30px;

  button{
    grid-column: 1 / 3;
  }
  .changePassword{
    display: flex;
    gap: 25px;
  }
`;

export const StyledSettingsMenu = styled.ul`
  width: 100%;
  display: flex;
  gap: 25px;

  font-family: Inter, sans-serif;
  font-size: 16px;
  font-style: normal;
  line-height: 24px;
  font-weight: bold;
  color: #444;

  padding: 12px 0;
  margin: 0;
  list-style: none;

  li {
    cursor: pointer;
    padding: 10px;
  }

  .active, li:hover {
    transition: .1s;
    border-bottom: 5px solid #25AB52;
  }
`
export const StyledAuthForm = styled(Form)`
  display: grid;
  grid-template-columns: auto auto;
  align-content: center;
  justify-content: center;
  gap: 30px;
  margin-top: 30px;
  
  .pass_wrap{
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
  }

  @media only screen and (max-width: 440px) {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
`;

export const StyledAvatarForm = styled(Form)`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: 150px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  
  gap: 30px;
  margin-bottom: 50px;
  
  .profile_avatar {
    height: 100%;
    width: 100%;

    position: relative;

    display: flex;
    justify-content: center;
    align-items: center;

    border-radius: 100%;
  }

  .profile_avatar img {
    position: absolute;
    height: 100%;
    width: 150px;
    border: 1px solid #D0D5DD;

    border-radius: 100%;
  }
  .profile_avatar .delete_avatar {
    width: 30px;
    height: 30px;
    border-radius: 100%;
    cursor: pointer;
    
    z-index: 5;
    position: absolute;
    top: 0;
    right: 0;
    background-color: #fff;
  }

  .profile_avatar p {
    font-size: 0.87rem;
    margin-top: 10px;
    color: #bbcada;
  }

  .profile_avatar input {
    display: block;
    height: 100%;
    width: 150px;
    top: 0;
    left: 0;
    opacity: 0;
    cursor: pointer;
  }
`

export const StyledProfileForm = styled(Form)`
  display: flex;
  justify-content: center;
  align-items: center;

  flex-wrap: wrap;
  gap: 30px;
  
  margin-bottom: 30px;
  
  
  .changePassword{
    display: flex;
    flex-direction: row;
    gap: 20px;
  }  
  
  button {
    grid-column: 2 / 3;
    max-width: 250px;
  }

  @media only screen and (max-width: 440px) {
    display: flex;
  }
`
export const StyledProfileControl = styled(Form.Control)`
  display: flex;
  width: 100%;
  height: 48px;
  padding: 12px 16px;
  align-items: flex-start;
  gap: 24px;
  border-radius: 8px;
  border: 1px solid #D0D5DD;
  color: #1c1f22;
`
export const StyledSettingsFormGroup = styled(Form.Group)`  
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;

  @media only screen and (max-width: 440px) {
    width: 100%;
  }
`
