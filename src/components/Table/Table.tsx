import React, {FC, HTMLAttributes, useEffect, useRef, useState} from 'react';
import {StyledPagination, StyledTable, StyledTableWrapper} from "./style";
import Modal, {ModalType} from "../Modal/Modal";
import ReactPaginate from 'react-paginate';
import _ from 'lodash';
import SortAsc from '../../assets/SortAsc/SortAsc';
import SortDesc from '../../assets/SortDesc/SortDesc';
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../redux/store";
import {IBasicInvestment, IBasicInvestmentCat, IItem, IOtherInvestment} from "../Investments/Overview/InvestOverview";
import {setModalCatData, setModalData, setModalType, toggleActive} from "../../redux/modalSlice";
import {useTranslation} from "react-i18next";

export interface ITransaction {
  id: string,
  name: string,
  category: string,
  categoryId: string,
  comment: string,
  date: string,
  value: number,
}

// export interface ITransactionCat {
export interface ITransactionCat {
  id: string,
  name?: string,
  index?: string
}

export enum TableType {
  transactions,
  investments,
  other,
}

export type dataMainType = ITransaction | IBasicInvestment | IOtherInvestment;
export type catMainType = ITransactionCat | IBasicInvestmentCat;

export interface TableInterface {
  tableType: TableType,
  tableData: dataMainType[] | IOtherInvestment[],
  tableCategories: catMainType[],
  items?: IItem[]
}

const Table: FC<TableInterface & HTMLAttributes<HTMLDivElement>> = ({
  tableType,
  tableData,
  tableCategories,
  items,
  }) => {
  const dispatch = useDispatch<AppDispatch>();
  const basicInvestLoading = useSelector((state: RootState) => state.basicInvestments.loading);
  const transLoading = useSelector((state: RootState) => state.transactions.loading);

  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  // const itemsPerPage = 15;
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [sortedData, setSortedData] = useState<dataMainType[] | IOtherInvestment[]>(tableData);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortColumn, setSortColumn] = useState<string | null>(null);

  const [pageCount, setPageCount] = useState<number>(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [currentItems, setCurrentItems] = useState<dataMainType[] | IOtherInvestment[]>([{
    id: '',
    name: '',
    category: '',
    categoryId: '',
    itemId: '',
    comment: '',
    date: new Date().toISOString(),
    value: 0,
  }]);

  const { t } = useTranslation();

  const calculatePageSize = () => {
    // @ts-ignore
    const containerHeight = containerRef.current.clientHeight - 60;
    const rowHeight = 60;
    const itemsPerPage = Math.floor(containerHeight / rowHeight);
    setItemsPerPage(itemsPerPage);
  };

  useEffect(() => {
    calculatePageSize();

  }, []);

  useEffect(() => {
    setSortedData(tableData);

    // calculatePageSize();


    if (tableType === TableType.transactions && transLoading === 'succeeded') setIsLoaded(true)
    if (tableType === TableType.investments && basicInvestLoading === 'succeeded') setIsLoaded(true)
  }, [tableData, tableType]);

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(sortedData.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(sortedData.length / itemsPerPage));
  }, [itemOffset, tableData, sortedData]);


  function openDetailsModal(row: dataMainType | IOtherInvestment) {
    dispatch(setModalType(tableType === TableType.transactions
      ? ModalType.transactionDetails
      : tableType === TableType.investments
        ? ModalType.basicInvestDetails
        : ModalType.otherInvestDetails));
    dispatch(setModalData(row));
    dispatch(setModalCatData(tableCategories));
    dispatch(toggleActive(true));
  }


  const handlePageClick = (event: { selected: number; }) => {
    const newOffset = event.selected * itemsPerPage % sortedData.length;
    setItemOffset(newOffset);
  };

  const getNormalizedDate = (date: string) => {
    const [day, month, year] = date.split('.');

    return new Date(`${year}-${month}-${day}`).getTime();
  }

  const handleSort = (column: string) => {
    let newSortOrder: 'asc' | 'desc' = 'asc';
    if (sortColumn === column && sortOrder === 'asc') {
      newSortOrder = 'desc';
    }
    let sorted;
    if (column !== 'date'){
      sorted = _.orderBy(sortedData, [column], [newSortOrder])
    } else {
      sorted = [...sortedData].sort((a, b) => {
        const dateA = getNormalizedDate(a.date);
        const dateB = getNormalizedDate(b.date);
        if (newSortOrder === 'asc') {
          return dateA - dateB;
        } else {
          return dateB - dateA;
        }
      });
    }

    // @ts-ignore
    setSortedData(sorted);
    setSortOrder(newSortOrder);
    setSortColumn(column);
  };

  // const search = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const { value } = event.target;
  //   if (value){
  //     const searchResult = tableData.filter((item) => {
  //       const {id, categoryId, ...obj } = item;
  //
  //       return _.values(obj).some((val) => new RegExp(value, 'i').test(String(val)))
  //     });
  //     setSortedData(searchResult)
  //   } else {
  //     setSortedData(tableData);
  //   }
  // }

  const getHeadersByTableType = () => {
    switch (tableType) {
      case TableType.transactions:
        return (
          <>
            <th onClick={() => handleSort('name')} style={{width: '20%'}}>{t('table.title')} {sortOrder === 'asc' ? <SortAsc/> : <SortDesc/>}</th>
            <th onClick={() => handleSort('category')} style={{width: '20%'}}>{t('table.category')} {sortOrder === 'asc' ? <SortAsc/> : <SortDesc/>}</th>
            <th onClick={() => handleSort('date')} style={{width: '20%'}}>{t('table.date')} {sortOrder !== 'asc' ? <SortAsc/> : <SortDesc/>}</th>
            <th onClick={() => handleSort('value')} style={{width: '20%'}}>{t('table.total')} {sortOrder !== 'asc' ? <SortAsc/> : <SortDesc/>}</th>
          </>
        );

      case TableType.investments:
        return (
          <>
            <th onClick={() => handleSort('itemId')}>{t('table.index')} {sortOrder === 'asc' ? <SortAsc/> : <SortDesc/>}</th>
            <th onClick={() => handleSort('comment')}>{t('table.comment')} {sortOrder !== 'asc' ? <SortAsc/> : <SortDesc/>}</th>
            <th onClick={() => handleSort('amount')}>{t('table.amount')} {sortOrder !== 'asc' ? <SortAsc/> : <SortDesc/>}</th>
            <th onClick={() => handleSort('value')}>{t('table.total')} {sortOrder === 'asc' ? <SortAsc/> : <SortDesc/>}</th>
          </>
        );

      case TableType.other:
        return (
          <>
            <th onClick={() => handleSort('title')}>{t('table.title')} {sortOrder === 'asc' ? <SortAsc/> : <SortDesc/>}</th>
            <th onClick={() => handleSort('comment')}>{t('table.comment')} {sortOrder !== 'asc' ? <SortAsc/> : <SortDesc/>}</th>
            <th onClick={() => handleSort('date')}>{t('table.date')} {sortOrder !== 'asc' ? <SortAsc/> : <SortDesc/>}</th>
            <th onClick={() => handleSort('value')}>{t('table.total')} {sortOrder === 'asc' ? <SortAsc/> : <SortDesc/>}</th>
          </>
        )
      default:
        return null;
    }
  }
  const getRowByTableType = (row: dataMainType | IOtherInvestment) => {
    switch (tableType) {
      case TableType.transactions:
        return (
          <>
            <td>{(row as ITransaction).name}</td>
            <td>{(row as ITransaction).category}</td>
            <td>{row.date}</td>
            <td>{row.value} zł</td>
          </>
        )

      case TableType.investments:
        return (
          <>
            {/*<td>{row.category}</td>*/}
            <td>{(row as IBasicInvestment).item}</td>
            <td>{row.comment}</td>
            <td>{(row as IBasicInvestment).amount} {t('table.pcs')}</td>
            <td>{row.value} $</td>
          </>
        )
      case TableType.other:
        return (
          <>
            <td>{(row as IOtherInvestment).title}</td>
            <td>{row.comment}</td>
            <td>{row.date}</td>
            <td>{row.value} $</td>
          </>
        )
      default:
        return null;
    }
  }

  return (
    <>
      {/*<FilterHeader tableCategories={tableCategories} searchFunc={search} tableType={tableType}/>*/}
      <StyledTableWrapper ref={containerRef}>
        {/*{isLoaded ?*/}
        {/*  <>*/}
            <StyledTable>
              <thead>
                <tr>
                  {getHeadersByTableType()}
                </tr>
              </thead>
              <tbody>
                {currentItems && currentItems.map((row: dataMainType | IOtherInvestment) => (
                  <tr key={row.id} onClick={() => openDetailsModal(row)}>
                    { getRowByTableType(row)}
                  </tr>
                ))}
              </tbody>
            </StyledTable>
          {/*</>*/}
          {/*:*/}
          {/*<>*/}
          {/*  <StyledLoading>*/}
          {/*    <ColorRing*/}
          {/*      visible={true}*/}
          {/*      height="80"*/}
          {/*      width="80"*/}
          {/*      ariaLabel="spinner"*/}
          {/*      wrapperStyle={{}}*/}
          {/*      wrapperClass="blocks-wrapper"*/}
          {/*      colors={['#25AB52', '#25AB52', '#25AB52', '#25AB52', '#25AB52']}*/}
          {/*    />*/}
          {/*  </StyledLoading>*/}
          {/*</>*/}
        {/*}*/}


      </StyledTableWrapper>
      <StyledPagination>
        <ReactPaginate
          nextLabel={t('table.next')}
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          marginPagesDisplayed={2}
          pageCount={pageCount}
          previousLabel={t('table.prev')}
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakLabel="..."
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName="pagination"
          activeClassName="active"
          renderOnZeroPageCount={ () =>
            <p>{t('table.sorry')} {tableType === TableType.transactions ? t('table.trans') : t('table.invests')}...</p>
          }
        />
      </StyledPagination>
      <Modal/>
    </>
  );
};

export default Table;
