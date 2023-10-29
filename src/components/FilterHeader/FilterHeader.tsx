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


interface FilterHeaderInterface {
  setActive: Dispatch<SetStateAction<boolean>>,
  setModalType: Dispatch<SetStateAction<ModalType>>,
  searchFunc: (event: React.ChangeEvent<HTMLInputElement>) => void,
}
const FilterHeader: FC<FilterHeaderInterface & HTMLAttributes<HTMLDivElement>> = ({
  setActive,
  setModalType,
  searchFunc,
   }) => {

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
          setModalType(ModalType.addTransaction)
          setActive(true)
        }}>New</StyledNewButton>

      </StyledFilterButtons>
    </StyledFilterHeader>

  );
};

export default FilterHeader;
