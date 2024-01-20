import styled from 'styled-components';
import {Form} from "react-bootstrap";

export const StyledFilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media only screen and (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`

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

  font-family: Inter, sans-serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px; /* 150% */
  text-transform: capitalize;
`

