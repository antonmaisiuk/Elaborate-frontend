import styled from 'styled-components';
import {Button, Container, Form, Nav, Navbar, NavDropdown} from "react-bootstrap";
import React from "react";

export const StyledFilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media only screen and (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`

export const StyledFilterUl = styled.ul`
  display: flex;
  flex-direction: row;
  list-style: none;
  padding: 0;
  margin: 0;
  
  li{
    color: #525256;
    font-family: Inter, sans-serif;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 24px;
    text-transform: capitalize;
    
    cursor: pointer;
    margin-right: 20px;
    padding: 8px;
  }
  li:hover{
    color: #25AB52;
    border-bottom: 2px solid #25AB52;  
  }
`;

export const StyledFilterButtons = styled.div`
  display: flex;
`

export const StyledFilterForm = styled(Form)`
  display: flex;
  padding: 12px;
  align-items: center;
  margin-right: 15px;
  position: relative;

  border-radius: 12px;
  background: #FFF;
  box-shadow: 0 26px 26px 0 rgba(106, 22, 58, 0.04);
`
export const StyledFilterSearch = styled(Form.Control)`
  max-width: 200px;
  border: none;
  height: 24px;
  margin-right: 5px;

  color: #9F9F9F;
  font-family: Inter, sans-serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;

  //@media only screen and (max-width: 440px) {
  //  display: none;
  //  
  //  :active{
  //    position: absolute;
  //    display: block;
  //  }
  //}
`
export const StyledNewButton = styled.button`
  display: flex;
  padding: 12px 24px;
  justify-content: center;
  align-items: center;

  border-radius: 12px;
  border: none;
  background: #25AB52;

  color: #fff;
  text-align: center;

  font-family: Inter,sans-serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px; /* 150% */
  text-transform: capitalize;
`

export const StyledFilterButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: none;
  height: 24px;
`

