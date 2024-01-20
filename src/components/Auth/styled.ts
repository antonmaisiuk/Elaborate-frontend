import styled from 'styled-components';
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import GoogleIcon from "../../assets/GoogleIcon/GoogleIcon";
import {GoogleLogin} from "@react-oauth/google";
import {device} from "../../devices/devices";

export const AuthContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100vh;
  background-color: #F4F5F7;
`;
export const AuthWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 25%;
  
  @media ${device.tablet} {
    width: 40%;
  }  
  @media ${device.mobileL} {
    width: 60%;
  }
  @media ${device.mobileM} {
    width: 70%;
  }
  @media ${device.mobileS} {
    width: 75%;
  }
`;

export const StyledAuthLogo = styled.h1`
  text-align: center;
  font-family: Poppins,sans-serif;
  font-size: 40px;
  font-style: normal;
  font-weight: 800;
  line-height: 32px; /* 80% */
  letter-spacing: 3.2px;
  color: #25AB52;

  margin-bottom: 40px;
  
`

export const StyledAuthHeader = styled.h2`
  font-family: Inter, sans-serif;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 28px;
  
  margin-bottom: 20px;
`;

export const StyledAuthDescription = styled.div`
  color: #666;
  text-align: center;
  font-family: Inter, sans-serif;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 26px;
  
  margin-bottom: 20px;
`;

export const StyledForm = styled(Form)`
  width: 100%;
`

export const StyledFormLabel = styled(Form.Label)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  font-family: Inter,sans-serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;

  margin-bottom: 8px;
`;

export const StyledFogotPassword = styled.a`
  color: #25AB52;
  text-align: right;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px; 
  cursor: pointer;
`

export const StyledFormControl = styled(Form.Control)`
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
export const StyledPassInputWrapper = styled.div`
  display: flex;
  height: 48px;
  
  .combined_input{
    border-radius: 8px 0 0 8px;
    border-right: none;
  }
  
  .modal_units{
    width: 50%;
    border-radius:  0 8px 8px 0;
  }
  
`
export const StyledInputGroup = styled(InputGroup.Text)`
  border-radius: 0 8px 8px 0;
  border-left: none;
  background-color: #fff;
  
  cursor: pointer;
  
  width: 40px;
  padding: 7px;
  svg{
    width: 100%;
  }
`

export const StyledFormSelect = styled(Form.Select)`
  display: flex;
  width: 100%;
  height: 48px;
  padding: 12px 16px;
  align-items: flex-start;
  gap: 24px;
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid #D0D5DD;
  color: #1c1f22;
  background-color: #fff;
  ::placeholder{
    color: #6c757d;    
  }
`

export const StyledButton = styled.button`
  display: flex;
  width: 100%;
  height: 48px;
  padding: 16px 12px;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  color: #fff;
  box-shadow: none;
  
  &.success{
    background-color: #218838;
    border: 1px solid #1e7e34;
  }
  &.warning{
    background-color: rgb(223 166 0);
    border: 1px solid rgb(223 166 0);
  }
  &.danger{
    background-color: rgb(165, 29, 42);
    border: 1px solid rgb(165, 29, 42);
  }
`
export const StyledGoogleButton = styled(GoogleLogin)`
`

export const StyledFormGroup = styled(Form.Group)`
  margin-bottom: 5%;
`;

export const StyledOption = styled.div`
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;

  color: #999DA3;
  margin: 5% 0;
`;

export const StyledLink = styled.a`
  color: #25AB52;
  cursor: pointer;
  font-weight: 600;
`;

export const StyledError = styled.div`
  color: #e40303;
  margin: 10px 0;
  font-weight: 600;
`;

export const StyledSuccess = styled.div`
  color: #25AB52;
  margin: 10px 0;
  font-weight: 600;
`;

export const StyledTooltip = styled.span`
  display: inline-block;
  width: 18px;
  height: 18px;
  text-align: center;
  line-height: 18px;
  background-color: #ccc;
  color: #fff;
  border-radius: 50%;
  cursor: pointer;
  
  :hover{
    background-color: #444;
  }

  white-space: pre-line;
`;



