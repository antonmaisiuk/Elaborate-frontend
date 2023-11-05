import React, {FC, HTMLAttributes, useEffect, useState} from 'react';
import {StyledTable, StyledTableWrapper} from "./style";
import FilterHeader from "../FilterHeader/FilterHeader";
import Modal, {ModalType} from "../Modal/Modal";
import ReactPaginate from 'react-paginate';
import _ from 'lodash';
import SortAsc from '../../assets/SortAsc/SortAsc';
import SortDesc from '../../assets/SortDesc/SortDesc';
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../redux/store";
import {IBasicInvestment, IBasicInvestmentCat} from "../Investments/Overview/InvestOverview";
import {setModalCatData, setModalData, setModalType, toggleActive} from "../../redux/modalSlice";
import {IItem} from "../../redux/itemSlice";

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

export type dataMainType = ITransaction | IBasicInvestment;
export type catMainType = ITransactionCat | IBasicInvestmentCat;

export interface TableInterface {
  tableData: dataMainType[],
  tableCategories: catMainType[],
  items?: IItem[]
}

const Table: FC<TableInterface & HTMLAttributes<HTMLDivElement>> = ({
  tableData,
  tableCategories,
  items,
  }) => {
  const dispatch = useDispatch<AppDispatch>();
  const itemsPerPage = 10;
  // const [modalType, setModalType] = useState<ModalType>(ModalType.addTransaction);
  // const [modalData, setModalData] = useState<dataMainType>({});
  // const [modalIsActive, setModalActive] = useState(false);

  const [sortedData, setSortedData] = useState<dataMainType[]>([...tableData]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortColumn, setSortColumn] = useState<string | null>(null);

  useEffect(() => {
    setSortedData(tableData);
  }, [tableData]);



  function openDetailsModal(row: dataMainType) {
    dispatch(toggleActive(true));
    dispatch(setModalType(ModalType.transactionDetails));
    dispatch(setModalData(row));
    dispatch(setModalCatData(tableCategories));
  }

  // @ts-ignore
  function Items({currentItems}) {
    return (
      <>
        {currentItems && currentItems.map((row: ITransaction) => (
          <tr key={row.id} onClick={() => openDetailsModal(row)}>
            <td>{row.name}</td>
            <td>{row.category}</td>
            <td>{row.date}</td>
            <td>{row.value} zł</td>
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
            <p>No transactions...</p>
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


  return (
    <>
      <FilterHeader tableCategories={tableCategories} searchFunc={search}/>
      <StyledTableWrapper>
        <StyledTable>
          <thead>
          <tr>
            <th onClick={() => handleSort('name')} style={{width: '30%'}}>Title {sortOrder === 'asc' ? <SortAsc/> : <SortDesc/>}</th>
            <th onClick={() => handleSort('category')}>Category {sortOrder === 'asc' ? <SortAsc/> : <SortDesc/>}</th>
            <th onClick={() => handleSort('date')}>Date {sortOrder !== 'asc' ? <SortAsc/> : <SortDesc/>}</th>
            <th onClick={() => handleSort('value')}>Amount {sortOrder !== 'asc' ? <SortAsc/> : <SortDesc/>}</th>
          </tr>
          </thead>
          <PaginatedItems itemsPerPage={itemsPerPage} />
        </StyledTable>

        <Modal/>
      </StyledTableWrapper>
    </>
  );
};

export default Table;
