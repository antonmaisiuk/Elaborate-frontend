import styled from 'styled-components';
import {Container, Form, Nav, Navbar, NavDropdown} from "react-bootstrap";

export const StyledTitle = styled.h2`
  color: #878787;
  font-family: Inter, sans-serif;
  font-size: 22px;
  font-style: normal;
  font-weight: 400;
  line-height: 32px;
  cursor: default;
  
  margin: 40px 0 15px 0;  
`;

export const StyledSelectorsBlock = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 24px;
`;

export const StyledSelector = styled(Form.Select)`
  display: flex;
  //width: 100%;
  height: 48px;
  padding: 12px 16px;
  align-items: flex-start;
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid #D0D5DD;
  color: #1c1f22;
  background-color: #fff;
  ::placeholder{
    color: #6c757d;
  }
`;
