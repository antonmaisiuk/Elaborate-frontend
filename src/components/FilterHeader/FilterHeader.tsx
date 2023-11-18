import React, {Dispatch, FC, HTMLAttributes, SetStateAction, useState} from 'react';
import {
  StyledFilterButton,
  StyledFilterButtons,
  StyledFilterForm,
  StyledFilterHeader,
  StyledFilterSearch,
  StyledFilterUl,
  StyledNewButton
} from "./style";
import SearchIcon from "../../assets/SearchIcon/SearchIcon";
import {ModalType} from "../Modal/Modal";
import {setModalCatData, setModalType, toggleActive} from "../../redux/modalSlice";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../redux/store";
import {catMainType, TableType} from "../Table/Table";


interface FilterHeaderInterface {
  tableCategories: catMainType[],
  tableType: TableType,
  searchFunc: (event: React.ChangeEvent<HTMLInputElement>) => void,
}
const FilterHeader: FC<FilterHeaderInterface & HTMLAttributes<HTMLDivElement>> = ({
  tableCategories,
  searchFunc,
  tableType,
   }) => {

  const dispatch = useDispatch<AppDispatch>();

  return (
    <StyledFilterHeader>
      <StyledFilterUl>
        {/*<li>Sort</li>*/}
        {/*<li>Filter</li>*/}
      </StyledFilterUl>
      <StyledFilterButtons>
        <StyledFilterForm onSubmit={(e: { preventDefault: () => void; }) => e.preventDefault()}>
          <StyledFilterSearch
            type="text"
            name="SearchText"
            placeholder='Search here'
            onChange={searchFunc}
          />
          <SearchIcon/>
        </StyledFilterForm>
        <StyledNewButton onClick={() => {
          dispatch(setModalType(tableType === TableType.transactions ? ModalType.addTransaction : ModalType.addBasicInvest));
          dispatch(toggleActive(true));
          dispatch(setModalCatData(tableCategories));
        }}>New</StyledNewButton>

      </StyledFilterButtons>
    </StyledFilterHeader>

  );
};

export default FilterHeader;
