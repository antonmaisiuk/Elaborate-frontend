import React, {ChangeEvent, Dispatch, FC, FormEvent, HTMLAttributes, SetStateAction, useEffect, useState} from 'react';
import {StyledTable, StyledTablePagination, StyledTableWrapper} from "./style";
import FilterHeader from "../FilterHeader/FilterHeader";
import Modal, {ModalType} from "../Modal/Modal";
import moment from 'moment';
import ReactPaginate from 'react-paginate';
import _ from 'lodash';
import SortAsc from '../../assets/SortAsc/SortAsc';
import SortDesc from '../../assets/SortDesc/SortDesc';
import {useDispatch} from "react-redux";
import {AppDispatch, store} from "../../redux/store";


export interface TransactionInter {
  id: string,
  name: string,
  category: string,
  categoryTransactionId: string,
  comment: string,
  date: string,
  value: number,
}

export interface TransCategoryInter {
  id: string,
  name?: string,
  index?: string
}

export interface TableInterface {
  tableData: TransactionInter[],
  trans: TransactionInter[],
  // setTrans: Dispatch<SetStateAction<TransactionInter[]>>
  transCatData: TransCategoryInter[] | undefined,
}

const Table: FC<TableInterface & HTMLAttributes<HTMLDivElement>> = ({
                                                                      tableData,
                                                                      transCatData,
                                                                      trans,
                                                                      // setTrans,
                                                                    }) => {
  const dispatch = useDispatch<AppDispatch>();

  const itemsPerPage = 10;
  const [modalType, setModalType] = useState<ModalType>(ModalType.addTransaction);
  const [modalData, setModalData] = useState<TransactionInter>({
    id: '',
    name: '',
    category: '',
    categoryTransactionId: '',
    comment: '',
    date: new Date().toISOString(),
    value: 0,
  });
  // const [modalData, setModalData] = useState<string>('');
  const [modalIsActive, setModalActive] = useState(false);
  const [sortedData, setSortedData] = useState<TransactionInter[]>([...tableData]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
  const [sortColumn, setSortColumn] = useState<string | null>(null);

  useEffect(() => {
    setSortedData(trans);
  }, [trans]);



  function openDetailsModal(row: TransactionInter) {
    setModalType(ModalType.transactionDetails);
    setModalData(row);
    setModalActive(true);
  }

  // @ts-ignore
  function Items({currentItems}) {
    return (
      <>
        {currentItems && currentItems.map((row: TransactionInter) => (
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
    const [currentItems, setCurrentItems] = useState<TransactionInter[]>([{
      id: '',
      name: '',
      category: '',
      categoryTransactionId: '',
      comment: '',
      date: new Date().toISOString(),
      value: 0,
    }]);

    useEffect(() => {
      // Fetch items from another resources.
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

        {currentItems ?
          <Items currentItems={currentItems} />
          : <span>'No'</span>
        }

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
            renderOnZeroPageCount={null}
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
        const {id, categoryTransactionId, ...obj } = item;

        return _.values(obj).some((val) => new RegExp(value, 'i').test(String(val)))
      });
      setSortedData(searchResult)
    } else {
      setSortedData(tableData);
    }
    // console.log('👉 searchResult:', searchResult);
  }


  return (
    <>
      <FilterHeader setActive={setModalActive} setModalType={setModalType} searchFunc={search}/>
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
        <Modal
          active={modalIsActive}
          setActive={setModalActive}
          type={modalType}
          setModalType={setModalType}
          modalTransData={modalData}
          trans={trans}
          modalTransCatData={transCatData}/>
      </StyledTableWrapper>
    </>
  );
};

export default Table;
