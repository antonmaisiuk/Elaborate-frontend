import styled from 'styled-components';
import {Container, Nav, Navbar, NavDropdown, Table} from "react-bootstrap";
import ReactPaginate from 'react-paginate';

export const StyledTableWrapper = styled.div`
  display: flex;
  padding: 0 28px 56px 28px;
  height: 100%;
  flex-direction: column;
  align-items: center;
  align-self: stretch;
  overflow-y: scroll;
  

  border-radius: 16px;
  background: #fff;
  box-shadow: 0 20px 25px 0 rgba(76, 103, 100, 0.10);
  margin-top: 15px;
  
  .pagination{
    .page-link{
      color: black;
    }
    .page-item.active .page-link{
      position: relative;
      background-color: #25AB52;
      border-color: #25AB52;
      color: white;
    }
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
  
  
`;
export const StyledTablePagination = styled.div`
  color: red;
  display: flex;
  justify-content: center;
  
  

  
  
`;
