import React, {FC, HTMLAttributes, useEffect, useState} from 'react';
import {StyledTable, StyledTableWrapper} from "./style";
import FilterHeader from "../FilterHeader/FilterHeader";
import Modal, {ModalType} from "../Modal/Modal";
import ReactPaginate from 'react-paginate';
import _ from 'lodash';
import SortAsc from '../../assets/SortAsc/SortAsc';
import SortDesc from '../../assets/SortDesc/SortDesc';
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../redux/store";
import {IBasicInvestment, IBasicInvestmentCat, IItem} from "../Investments/Overview/InvestOverview";
import {setModalCatData, setModalData, setModalType, toggleActive} from "../../redux/modalSlice";

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
}

export type dataMainType = ITransaction | IBasicInvestment;
export type catMainType = ITransactionCat | IBasicInvestmentCat;

export interface TableInterface {
  tableType: TableType,
  tableData: dataMainType[],
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
  const itemsPerPage = 10;

  const [sortedData, setSortedData] = useState<dataMainType[]>([...tableData]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortColumn, setSortColumn] = useState<string | null>(null);

  useEffect(() => {
    setSortedData(tableData);
    // console.log('👉 Keys: ', _.keys(tableData[0]));
    // getHeadersByTableType()
  }, [tableData]);



  function openDetailsModal(row: dataMainType) {
    dispatch(toggleActive(true));
    dispatch(setModalType(tableType === TableType.transactions ? ModalType.transactionDetails : ModalType.basicInvestDetails));
    dispatch(setModalData(row));
    dispatch(setModalCatData(tableCategories));
  }

  // @ts-ignore
  function Items({currentItems}) {
    return (
      <>
        {currentItems && currentItems.map((row: ITransaction) => (
          <tr key={row.id} onClick={() => openDetailsModal(row)}>
            { getRowByTableType(row)}
          </tr>
        ))}
      </>
    );
  }

  // @ts-ignore
  function PaginatedItems({itemsPerPage}) {
    const [pageCount, setPageCount] = useState<number>(0);
    const [itemOffset, setItemOffset] = useState(0);
    const [currentItems, setCurrentItems] = useState<dataMainType[]>([{
      id: '',
      name: '',
      category: '',
      categoryId: '',
      itemId: '',
      comment: '',
      date: new Date().toISOString(),
      value: 0,
    }]);

    useEffect(() => {
      const endOffset = itemOffset + itemsPerPage;
      setCurrentItems(sortedData.slice(itemOffset, endOffset));
      setPageCount(Math.ceil(sortedData.length / itemsPerPage));
    }, [itemOffset, itemsPerPage]);

    const handlePageClick = (event: { selected: number; }) => {
      const newOffset = event.selected * itemsPerPage % sortedData.length;
      setItemOffset(newOffset);
    };

    return (
      <>
        <tbody>
          <Items currentItems={currentItems} />
        </tbody>
        <div>
          <ReactPaginate
            nextLabel="Next"
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            marginPagesDisplayed={2}
            pageCount={pageCount}
            previousLabel="Previous"
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
            <p>No {tableType === TableType.transactions ? 'transactions' : 'investments'}...</p>
            }
          />
        </div>
      </>
    );
  }

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

    setSortedData(sorted);
    setSortOrder(newSortOrder);
    setSortColumn(column);
  };

  const search = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (value){
      const searchResult = tableData.filter((item) => {
        const {id, categoryId, ...obj } = item;

        return _.values(obj).some((val) => new RegExp(value, 'i').test(String(val)))
      });
      setSortedData(searchResult)
    } else {
      setSortedData(tableData);
    }
  }

  const getHeadersByTableType = () => {
    switch (tableType) {
      case TableType.transactions:
        return (
          <>
            <th onClick={() => handleSort('name')} style={{width: '20%'}}>Title {sortOrder === 'asc' ? <SortAsc/> : <SortDesc/>}</th>
            <th onClick={() => handleSort('category')}>Category {sortOrder === 'asc' ? <SortAsc/> : <SortDesc/>}</th>
            <th onClick={() => handleSort('date')}>Date {sortOrder !== 'asc' ? <SortAsc/> : <SortDesc/>}</th>
            <th onClick={() => handleSort('value')}>Amount {sortOrder !== 'asc' ? <SortAsc/> : <SortDesc/>}</th>
          </>
        )

      case TableType.investments:
        return (
          <>
            <th onClick={() => handleSort('itemId')}>Index {sortOrder === 'asc' ? <SortAsc/> : <SortDesc/>}</th>
            <th onClick={() => handleSort('comment')}>Comment {sortOrder !== 'asc' ? <SortAsc/> : <SortDesc/>}</th>
            <th onClick={() => handleSort('amount')}>Amount {sortOrder !== 'asc' ? <SortAsc/> : <SortDesc/>}</th>
            <th onClick={() => handleSort('value')}>Total {sortOrder === 'asc' ? <SortAsc/> : <SortDesc/>}</th>
          </>
        )
      default:
        return null;
    }
  }
  const getRowByTableType = (row: dataMainType) => {
    switch (tableType) {
      case TableType.transactions:
        return (
          <>
            <td>{(row as ITransaction).name}</td>
            <td>{row.category}</td>
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
            <td>{(row as IBasicInvestment).amount} psc</td>
            <td>{row.value} $</td>
          </>
        )
      default:
        return null;
    }
  }

  return (
    <>
      <FilterHeader tableCategories={tableCategories} searchFunc={search}/>
      <StyledTableWrapper>
        <StyledTable>
          <thead>
          <tr>{getHeadersByTableType()}</tr>
          </thead>
          <PaginatedItems itemsPerPage={itemsPerPage} />
        </StyledTable>

        <Modal/>
      </StyledTableWrapper>
    </>
  );
};

export default Table;
