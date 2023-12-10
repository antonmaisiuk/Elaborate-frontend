import styled from 'styled-components';
import {Container, Nav, Navbar, NavDropdown, Table} from "react-bootstrap";
import ReactPaginate from 'react-paginate';
import {ColorRing} from "react-loader-spinner";

export const StyledTableWrapper = styled.div`
  display: flex;
  padding: 0 28px 28px 28px;
  max-height: 80%;
  //max-width: 100%;
  flex-direction: column;
  flex: 1;
  overflow-y: scroll;
  

  border-radius: 16px;
  background: #fff;
  box-shadow: 0 20px 25px 0 rgba(76, 103, 100, 0.10);
  margin-top: 15px;

  @media only screen and (max-width: 440px) {
    padding: 0 15px 15px 15px;
  } 
  
  @media only screen and (max-width: 320px) {
    padding: 0 5px 5px 5px;
  }
`

export const StyledTable = styled(Table)`
  font-family: Inter, sans-serif;
  font-size: 16px;
  font-style: normal;
  line-height: 24px; /* 150% */
  margin: 0;

  //overflow-y: scroll;
  
  thead th{
    border-top: none;
    text-align: left;
    font-weight: 700;
    text-transform: capitalize;

    position: sticky;
    top: 0;
    background-color: #fff;

  }
  th, td{
    padding: 16px 10px;
    
    svg{
      width: 18px;
      height: 18px;
    }
  }
  tr{
    cursor: pointer;
  }
  tr td:first-child, tr td:last-child{
    color: #191919;
    font-weight: 600;
  }
  
  div{
    width: 100%;
    margin-bottom: auto;
    ul{
      margin: 0;
    }
  }

  @media only screen and (max-width: 440px) {
    font-size: 3vw;
  }
`;
export const StyledPagination = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 15px;
  
  ul{
    margin: 0;
    padding: 0;
  }

  .pagination{
    .page-link{
      color: black;
    }
    .page-item.active .page-link{
      z-index: 0;
      background-color: #25AB52;
      border-color: #25AB52;
      color: white;
    }
  }

  @media only screen and (max-width: 440px) {
    font-size: 3vw;
  }
`;

export const StyledLoading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  
  width: 100%;
  height: 100%;
`;
