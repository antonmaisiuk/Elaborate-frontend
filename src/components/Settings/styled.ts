import styled from 'styled-components';
import {Form} from "react-bootstrap";

export const StyledSettings = styled.div`
  display: flex;
  padding: 0 28px 56px 28px;
  height: 100%;
  flex-direction: column;
  align-items: start;
  align-self: stretch;
  //overflow-y: scroll;

  //.

  border-radius: 16px;
  background: #fff;
  box-shadow: 0 20px 25px 0 rgba(76, 103, 100, 0.10);
  margin-top: 15px;

`;
export const StyledSettingsHeader = styled.h2`
  
`;

export const StyledProfileContent = styled.div`
  width: 100%;
  height: 100%;
  
  display: flex;
  justify-content: center;
  align-items: center;
`;
export const StyledAuthContent = styled.div`
  width: 100%;
  height: 100%;
  
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  .pass{
    grid-area: pass;
  }
  .btn{
    grid-area: btn;
  }
  .changePassword{
    display: flex;
    gap: 25px;
  }
`;
export const StyledPrefContent = styled.div`
  width: 100%;
  height: 100%;
  padding: 20px 0;
  
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  gap: 15px;
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
  //border-bottom: 1px solid #E8E8E8;

  li {
    cursor: pointer;
    padding: 10px;
  }

  .active, li:hover {
    transition: .1s;
    border-bottom: 5px solid #25AB52;
    //color: #25AB52;
  }
`
export const StyledAuthForm = styled(Form)`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  
  .pass_wrap{
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
  }
`;

export const StyledProfileForm = styled(Form)`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  margin-bottom: 15px;
  
  .changeProfile{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  
  .changePassword{
    display: flex;
    flex-direction: row;
    gap: 20px;
  }
  
  .profile_other{
    width: 100%;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 20px;
  }
  
  .profile_avatar {
    width: 150px;
    height: 150px;

    position: relative;
    
    display: flex;
    justify-content: center;
    align-items: center;

    border: 1px solid #D0D5DD;
    border-radius: 100%;
    //background-color: rgba(228, 228, 228, 0.54);

    cursor: pointer;
  }

  .profile_avatar img {
    position: absolute;
    width: 100%;
    
    border-radius: 100%;
  }

  .profile_avatar p {
    font-size: 0.87rem;
    margin-top: 10px;
    color: #bbcada;
  }

  .profile_avatar input {
    display: block;
    height: 100%;
    width: 100%;
    //position: absolute;
    top: 0;
    //bottom: 0;
    left: 0;
    //right: 0;
    opacity: 0;
    cursor: pointer;
  }
  
  button {
    max-width: 250px;
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
  margin-bottom: 2% ;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  
`
export const StyledPrefWrapper = styled.div`
  display: flex;
  gap: 15px;
`
// export const StyledSettings = styled.div``
