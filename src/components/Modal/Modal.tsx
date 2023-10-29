import React, {
  Dispatch,
  FC,
  HTMLAttributes,
  KeyboardEvent,
  KeyboardEventHandler, MouseEvent,
  SetStateAction,
  useEffect,
  useState
} from 'react';
import {StyledButtonGroup, StyledDetailsWrapper, StyledItem, StyledModalContainer, StyledModalContent} from "./style";
import {
  StyledButton,
  StyledError,
  StyledForm,
  StyledFormControl,
  StyledFormGroup,
  StyledFormLabel,
  StyledFormSelect
} from "../Auth/styled";
import {useNavigate} from "react-router-dom";
// import _ from 'lodash';
import {TransactionInter, TransCategoryInter} from "../Table/Table";
import moment from 'moment';
import _ from "lodash";
import {addTransactionAsync, deleteTransactionAsync, updateTransactionAsync} from "../../redux/transactionSlice";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../redux/store";

export enum ModalType {
  addTransaction,
  editTransaction,
  transactionDetails,
  addCategory,
  addInvestment
}

export interface ModalBaseInterface {
  active: boolean,
  setActive: Dispatch<SetStateAction<boolean>>,
  type: ModalType,
  setModalType: Dispatch<SetStateAction<ModalType>>,
  trans: TransactionInter[],
  // setTrans: Dispatch<SetStateAction<TransactionInter[]>>
  modalTransData: TransactionInter,
  modalTransCatData?: TransCategoryInter[]
}
// export interface ModalTransInterface extends ModalBaseInterface{
//   active: boolean,
//   setActive: Dispatch<SetStateAction<boolean>>,
//   type: ModalType,
//   setModalType: Dispatch<SetStateAction<ModalType>>,
//   modalTransData: TransactionInter,
//   modalTransCatData: TransCategoryInter[]
// }
// export interface ModalInvestInterface extends ModalBaseInterface {
//   active: boolean,
//   setActive: Dispatch<SetStateAction<boolean>>,
//   type: ModalType,
//   setModalType: Dispatch<SetStateAction<ModalType>>,
//   modalInvestData: TransactionInter,
//   modalInvestCatData: TransCategoryInter[]
// }

// type ModalInterface = ModalTransInterface | ModalInvestInterface;

const getActualToken = () => {
  const token = document.cookie.match('token');

  if (token && token.input) return token.input.split('=')[1];

  return '';
}

const Modal: FC<ModalBaseInterface & HTMLAttributes<HTMLDivElement>> = ({
  type,
  setModalType,
  active,
  setActive,
  trans,
  // setTrans,
  modalTransData,
  modalTransCatData = [],
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const selectedTransaction = {...modalTransData,};
  const updatedTrans = {...modalTransData};
  const [newTrans, setNewTrans] = useState<TransactionInter>({
    id: '',
    name: '',
    category: '',
    categoryTransactionId: '',
    comment: '',
    date: new Date().toISOString(),
    value: 0,
  });
  const [errorMsg, setErrorMsg] = useState('');
  // @ts-ignore
  const [token, setToken] = useState(getActualToken());
  const navigate = useNavigate();

  const formatDate = (date: string) => {
    if (date && !/T/.test(date)){
      let formattedDate;

      if (/./.test(date)) {
        const [day, month, year] = date.split('.');
        formattedDate = new Date(`${year}-${month}-${day}`).toISOString().split('T')[0];
      } else {
        const [year, month, day] = date.split('-');
        formattedDate = new Date(`${year}-${month}-${day}`).toISOString();
      }

      return formattedDate;
    }
    return date;
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = event.target;
    setNewTrans((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleInputEditEvent = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = event.target;

    if (name === 'date' && updatedTrans) {
      updatedTrans[name] = new Date(value).toISOString();
    } else {
      // @ts-ignore
      updatedTrans[name] = value;
    }
  };

  const handleSelectEditEvent = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const {name, value} = event.target;
    console.log('👉 Select: ', name, value);
    // @ts-ignore
    updatedTrans.categoryTransactionId = value;
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const {value} = event.target;
    setNewTrans((prevData) => ({
      ...prevData,
      categoryTransactionId: value,
    }));
  };

  const resetForm = () => setNewTrans({
    id: '',
    name: '',
    category: '',
    categoryTransactionId: '',
    comment: '',
    date: new Date().toISOString(),
    value: 0,
  });

  const handleNewTransaction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newTrans.categoryTransactionId === '') newTrans.categoryTransactionId = modalTransCatData[0].id;
    dispatch(addTransactionAsync(newTrans));

    setActive(false);
    resetForm();
  };

  const handleDeleteTransactions = async (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(deleteTransactionAsync(selectedTransaction.id))

    setActive(false);
    setErrorMsg('');
  }

  const handleEditTransaction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch(updateTransactionAsync({
      ...updatedTrans,
      date: formatDate(updatedTrans.date),
    }))

    setActive(false);
    setErrorMsg('');
  };


  function renderNewTransactionForm() {
    return (
      <StyledForm onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
        await handleNewTransaction(e)
      }}>
        <StyledFormGroup controlId="name">
          <StyledFormLabel>Title</StyledFormLabel>
          <StyledFormControl
            type="text"
            name="name"
            placeholder='Telefon'
            value={newTrans.name}
            onChange={handleInputChange}
            required
          />
        </StyledFormGroup>
        <StyledFormGroup controlId="categoryTransactionId">
          <StyledFormLabel>Category</StyledFormLabel>
          <StyledFormSelect
            type="text"
            name="categoryTransactionId"
            placeholder='Category'
            onChange={handleSelectChange}
            required
          >
            <option disabled>Category</option>
            {modalTransCatData.map((cat) => (
              <option value={cat.id}>{cat.name}</option>
            ))}
          </StyledFormSelect>
        </StyledFormGroup>
        <StyledFormGroup controlId="date">
          <StyledFormLabel>Date</StyledFormLabel>
          <StyledFormControl
            type="date"
            name="date"
            defaultValue={new Date().toISOString().split('T')[0]}
            onChange={handleInputChange}
          />
        </StyledFormGroup>
        <StyledFormGroup controlId="comment">
          <StyledFormLabel>Comment</StyledFormLabel>
          <StyledFormControl
            type="text"
            name="comment"
            placeholder='More info'
            value={newTrans.comment}
            onChange={handleInputChange}
            // value={formData[0].comment}

          />
        </StyledFormGroup>
        <StyledFormGroup controlId="value">
          <StyledFormLabel>Amount</StyledFormLabel>
          <StyledFormControl
            type="number"
            name="value"
            placeholder='12.2'
            value={newTrans.value}
            onChange={handleInputChange}
            step={0.01}
            required
          />
        </StyledFormGroup>
        {errorMsg && <StyledError> {errorMsg} </StyledError>}
        <StyledButton variant="success" type="submit">
          Save
        </StyledButton>
      </StyledForm>
    )
  }
  function renderTransactionDetails() {
    console.log('👉 ID: ', selectedTransaction.id);
    return (
      <StyledDetailsWrapper>

        <StyledFormGroup controlId="name">
          <StyledFormLabel>Title</StyledFormLabel>
          <StyledItem>
            {selectedTransaction?.name}
          </StyledItem>

        </StyledFormGroup>
        <StyledFormGroup controlId="Category">
          <StyledFormLabel>Category</StyledFormLabel>
          <StyledItem>
            {selectedTransaction?.category}
          </StyledItem>
        </StyledFormGroup>
        <StyledFormGroup controlId="date">
          <StyledFormLabel>Date</StyledFormLabel>
          <StyledItem>
            {selectedTransaction?.date}
          </StyledItem>
        </StyledFormGroup>
        <StyledFormGroup controlId="comment">
          <StyledFormLabel>Comment</StyledFormLabel>
          <StyledItem>
            {selectedTransaction?.comment}
          </StyledItem>
        </StyledFormGroup>
        <StyledFormGroup controlId="Value">
          <StyledFormLabel>Amount</StyledFormLabel>
          <StyledItem>
            {selectedTransaction?.value}
          </StyledItem>
        </StyledFormGroup>
        <StyledButtonGroup>
          {errorMsg && <StyledError> {errorMsg} </StyledError>}
          <StyledButton variant="warning" onClick={() => setModalType(ModalType.editTransaction)}>
            Edit
          </StyledButton>
          <StyledButton variant="danger" onClick={async (e) => await handleDeleteTransactions(e)}>
            Delete
          </StyledButton>
        </StyledButtonGroup>

      </StyledDetailsWrapper>
    );
  }

  function renderTransactionEdit() {
    console.log('👉 Edit ID: ', updatedTrans.id);

    return (
      <StyledForm onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
        await handleEditTransaction(e)
      }}>
        <StyledFormGroup controlId="name">
          <StyledFormLabel>Title</StyledFormLabel>
          <StyledFormControl
            type="text"
            name="name"
            placeholder='Telefon'
            defaultValue={selectedTransaction?.name}
            onChange={handleInputEditEvent}
            required
          />
        </StyledFormGroup>
        <StyledFormGroup controlId="categoryTransactionId">
          <StyledFormLabel>Category</StyledFormLabel>
          <StyledFormSelect
            type="text"
            name="CategoryTransactionId"
            placeholder='Category'
            defaultValue={selectedTransaction?.categoryTransactionId}
            onChange={handleSelectEditEvent}
            required
          >
            {modalTransCatData.map((cat) => (
              <option value={cat.id}>{cat.name}</option>
            ))}
          </StyledFormSelect>
        </StyledFormGroup>
        <StyledFormGroup controlId="date">
          <StyledFormLabel>Date</StyledFormLabel>
          <StyledFormControl
            type="date"
            name="date"
            defaultValue={formatDate(selectedTransaction?.date)}
            onChange={handleInputEditEvent}
          />
        </StyledFormGroup>
        <StyledFormGroup controlId="comment">
          <StyledFormLabel>Comment</StyledFormLabel>
          <StyledFormControl
            type="text"
            name="comment"
            placeholder='More info'
            defaultValue={selectedTransaction?.comment}
            onChange={handleInputEditEvent}

          />
        </StyledFormGroup>
        <StyledFormGroup controlId="value">
          <StyledFormLabel>Amount</StyledFormLabel>
          <StyledFormControl
            type="number"
            name="value"
            placeholder='12.2'
            defaultValue={selectedTransaction?.value}
            onChange={handleInputEditEvent}
            step={0.01}
            required
          />
        </StyledFormGroup>
        {errorMsg && <StyledError> {errorMsg} </StyledError>}
        <StyledButtonGroup>
          <StyledButton variant='success' type='submit'>
            Save
          </StyledButton>
          <StyledButton variant='danger' onClick={() => setModalType(ModalType.transactionDetails)}>
            Cancel
          </StyledButton>
        </StyledButtonGroup>
      </StyledForm>
    )
  }

  useEffect(() => {
    if (!token){
      console.log('👉 Token expired');
      navigate('/login')
    }
    // @ts-ignore
    const close = (e) => {
      if (active && e.key === 'Escape'){
        setActive(false);

      }
      setErrorMsg('');
    }

    window.addEventListener('keydown', close);

    return () => window.removeEventListener('keydown', close)
  })

  return (
    <StyledModalContainer
      active={active}
      setActive={setActive}
      type={type}
      trans={trans}
      // setTrans={setTrans}
      setModalType={setModalType}
      onClick={() => {
        setActive(false)
        setErrorMsg('');
        resetForm();
      }}
     modalTransData={selectedTransaction}>
      <StyledModalContent onClick={e => e.stopPropagation()}>
        {
          type === ModalType.addTransaction && renderNewTransactionForm()
        }
        {
          type === ModalType.editTransaction && renderTransactionEdit()
        }
        {
          type === ModalType.transactionDetails && renderTransactionDetails()
        }

      </StyledModalContent>
    </StyledModalContainer>
  );
};

export default Modal;

