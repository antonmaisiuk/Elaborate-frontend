import React, {Dispatch, FC, HTMLAttributes, SetStateAction} from 'react';
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

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const response = await fetch(`api/`,
      {
        method: 'Post',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
      })

    if (response.ok) {
    } else {
      const errorMsg = JSON.parse(await response.text());
      console.log(errorMsg.message);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('👉 Search value: ', event.target.value);
     // setSearchText(event.target.value);
  };


  return (
    <StyledFilterHeader>
      <StyledFilterUl>
        <li>Sort</li>
        <li>Filter</li>
      </StyledFilterUl>
      <StyledFilterButtons>
        <StyledFilterForm onSubmit={(e: { preventDefault: () => void; }) => e.preventDefault()}>
          <StyledFilterSearch
            type="text"
            name="SearchText"
            placeholder='Search here'
            onChange={searchFunc}
            // value={formData.Email}
          />
          <StyledFilterButton type="submit"><SearchIcon/></StyledFilterButton>
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
