import React, {FC, HTMLAttributes, useState} from 'react';
import {
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
import {useTranslation} from "react-i18next";


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
  const [searchActive, setSearchActive] = useState(false);
  const { t } = useTranslation();

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
            className='search-header'
            placeholder={t('filterHeader.searchHere')}
            onChange={searchFunc}
          />
          <SearchIcon onClick={() => setSearchActive(!searchActive)} />
        </StyledFilterForm>
        <StyledNewButton onClick={() => {
          dispatch(setModalType(tableType === TableType.transactions
            ? ModalType.addTransaction
            : tableType === TableType.investments
              ? ModalType.addBasicInvest
              : ModalType.addOtherInvest));
          dispatch(toggleActive(true));
          dispatch(setModalCatData(tableCategories));
        }}>{t('filterHeader.new')}</StyledNewButton>

      </StyledFilterButtons>
    </StyledFilterHeader>

  );
};

export default FilterHeader;
