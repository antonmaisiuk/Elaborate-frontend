import React, {
  FC,
  HTMLAttributes,
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
import {dataMainType, ITransaction} from "../Table/Table";
import {addTransactionAsync, deleteTransactionAsync, updateTransactionAsync} from "../../redux/transactionSlice";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../redux/store";
import {setModalType, toggleActive} from "../../redux/modalSlice";
import {addBasicInvestsAsync, deleteBasicInvestAsync, updateBasicInvestAsync} from "../../redux/basicInvestSlice";
import {IBasicInvestment, IItem} from "../Investments/Overview/InvestOverview";

export enum ModalType {
  addTransaction,
  addBasicInvest,
  editTransaction,
  editBasicInvest,
  transactionDetails,
  basicInvestDetails
}

const Modal: FC<HTMLAttributes<HTMLDivElement>> = () => {

  const dispatch = useDispatch<AppDispatch>();
  const modalType = useSelector((state: RootState) => state.modal.modalType);
  const isActive = useSelector((state: RootState) => state.modal.isActive);
  const modalData = useSelector((state: RootState) => state.modal.modalData);
  const modalCatData = useSelector((state: RootState) => state.modal.modalCatData);

  const items = useSelector((state: RootState) => state.basicInvestments.items);
  const loading = useSelector((state: RootState) => state.basicInvestments.loading);

  const [currentItems, setCurrentItems] = useState<IItem[]>(items);
  // const currentItems = items.filter((item) => item.categoryInvestmentId === newItem.categoryId);

  const updatedItem = {...modalData};
  const [newItem, setNewItem] = useState<dataMainType>({
    id: '',
    name: '',
    category: '',
    categoryId: '',
    itemId: '',
    comment: '',
    date: new Date().toISOString(),
    value: 0,
    amount: 0,
  });
  const [errorMsg, setErrorMsg] = useState('');



  const formatDate = (date: string) => {
    if (date && !/T/.test(date)) {
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
    setNewItem((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const {value, name} = event.target;
    console.log('👉 name: ', name, ' value: ', value);
    setNewItem((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === 'categoryId') {

    }
  };

  const handleInputEditEvent = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = event.target;

    if (name === 'date' && updatedItem) {
      updatedItem[name] = new Date(value).toISOString();
    } else {
      // @ts-ignore
      updatedItem[name] = value;
    }
  };

  const handleSelectEditEvent = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const {name, value} = event.target;
    // @ts-ignore
    updatedItem[name] = value;
  };

  const resetForm = () => setNewItem({
    id: '',
    name: '',
    category: '',
    categoryId: '',
    comment: '',
    date: new Date().toISOString(),
    value: 0,
  });


  const handleNewTransaction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newItem.categoryId === '') newItem.categoryId = modalCatData[0].id;
    dispatch(addTransactionAsync(newItem as ITransaction));

    dispatch(toggleActive(false));
    resetForm();
  };
  const handleNewBasicInvest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('👉 newItem: ', newItem);

    if (newItem.categoryId === '') newItem.categoryId = modalCatData[0].id;
    if (!(newItem as IBasicInvestment).itemId) (newItem as IBasicInvestment).itemId = currentItems[0].id;
    console.log('👉 [modal] New item: ', newItem);
    dispatch(addBasicInvestsAsync(newItem as IBasicInvestment));

    dispatch(toggleActive(false));
    resetForm();
  };

  const handleDeleteTransactions = async (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(deleteTransactionAsync(modalData.id))

    dispatch(toggleActive(false));
    setErrorMsg('');
  }

  const handleDeleteBasicInvest = async (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(deleteBasicInvestAsync(modalData.id))

    dispatch(toggleActive(false));
    setErrorMsg('');
  }

  const handleEditTransaction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // @ts-ignore
    dispatch(updateTransactionAsync({
      ...updatedItem,
      date: formatDate(updatedItem.date),
    }))

    dispatch(toggleActive(false));
    setErrorMsg('');
  };

  const handleEditBasicInvest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // @ts-ignore
    dispatch(updateBasicInvestAsync({
      ...updatedItem,
      date: formatDate(updatedItem.date),
    }))

    dispatch(toggleActive(false));
    setErrorMsg('');
  };

  function renderNewTransactionForm() {
    return (
      <StyledForm onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
        await handleNewTransaction(e)
      }}>
        <StyledFormGroup controlId='name'>
          <StyledFormLabel>Title</StyledFormLabel>
          <StyledFormControl
            type='text'
            name='name'
            placeholder='Telefon'
            value={'name' in newItem ? newItem.name : ''}
            onChange={handleInputChange}
            required
          />
        </StyledFormGroup>
        <StyledFormGroup controlId="categoryId">
          <StyledFormLabel>Category</StyledFormLabel>
          <StyledFormSelect
            type="text"
            name="categoryId"
            placeholder='Category'
            onChange={handleSelectChange}
            required
          >
            <option disabled>Category</option>
            {modalCatData.map((cat) => (
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
            value={newItem.comment}
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
            value={newItem.value}
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

  function renderNewBasicInvestForm() {
    return (
      <StyledForm onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
        await handleNewBasicInvest(e)
      }}>
        <StyledFormGroup controlId="categoryId">
          <StyledFormLabel>Investment type</StyledFormLabel>
          <StyledFormSelect
            type="text"
            name="categoryId"
            placeholder='Investment type'
            onChange={handleSelectChange}
            required
          >
            <option disabled>Select investment type</option>
            {modalCatData.map((cat) => (
              <option value={cat.id}>{cat.name}</option>
            ))}
          </StyledFormSelect>
        </StyledFormGroup>
        <StyledFormGroup controlId="itemId">
          <StyledFormLabel>Index</StyledFormLabel>
          <StyledFormSelect
            type="text"
            name="itemId"
            placeholder='Index'
            onChange={handleSelectChange}
            required
          >
            <option disabled>Select investment type if empty</option>
            {
              currentItems.map((item) => (
              <option value={item.id}>{item.name}</option>
            ))
            }
          </StyledFormSelect>
        </StyledFormGroup>
        <StyledFormGroup controlId="comment">
          <StyledFormLabel>Comment</StyledFormLabel>
          <StyledFormControl
            type="text"
            name="comment"
            placeholder='More info'
            value={newItem.comment}
            onChange={handleInputChange}
          />
        </StyledFormGroup>
        <StyledFormGroup controlId="amount">
          <StyledFormLabel>Amount</StyledFormLabel>
          <StyledFormControl
            type="number"
            name="amount"
            placeholder='12.2'
            value={"amount" in newItem ? newItem.amount : ''}
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

  function renderBasicInvestDetails() {
    return (
      <StyledDetailsWrapper>

        <StyledFormGroup controlId="category">
          <StyledFormLabel>Investment Type</StyledFormLabel>
          <StyledItem>
            {modalData.category}
          </StyledItem>
        </StyledFormGroup>
        <StyledFormGroup controlId="item">
          <StyledFormLabel>Index</StyledFormLabel>
          <StyledItem>
            {(modalData as IBasicInvestment).item}
          </StyledItem>
        </StyledFormGroup>
        <StyledFormGroup controlId="date">
          <StyledFormLabel>Date</StyledFormLabel>
          <StyledItem>
            {modalData.date}
          </StyledItem>
        </StyledFormGroup>
        <StyledFormGroup controlId="comment">
          <StyledFormLabel>Comment</StyledFormLabel>
          <StyledItem>
            {modalData.comment}
          </StyledItem>
        </StyledFormGroup>
        <StyledFormGroup controlId="amount">
          <StyledFormLabel>Amount</StyledFormLabel>
          <StyledItem>
            {(modalData as IBasicInvestment).amount}
          </StyledItem>
        </StyledFormGroup>
        <StyledFormGroup controlId="value">
          <StyledFormLabel>Total</StyledFormLabel>
          <StyledItem>
            {modalData.value}
          </StyledItem>
        </StyledFormGroup>
        <StyledButtonGroup>
          {errorMsg && <StyledError> {errorMsg} </StyledError>}
          <StyledButton variant="warning" onClick={() => dispatch(setModalType(ModalType.editBasicInvest))}>
            Edit
          </StyledButton>
          <StyledButton variant="danger" onClick={async (e) => await handleDeleteBasicInvest(e)}>
            Delete
          </StyledButton>
        </StyledButtonGroup>

      </StyledDetailsWrapper>
    );
  }
  function renderTransactionDetails() {
    return (
      <StyledDetailsWrapper>

        <StyledFormGroup controlId="name">
          <StyledFormLabel>Title</StyledFormLabel>
          <StyledItem>
            {
              // @ts-ignore
              modalData?.name
            }
          </StyledItem>

        </StyledFormGroup>
        <StyledFormGroup controlId="Category">
          <StyledFormLabel>Category</StyledFormLabel>
          <StyledItem>
            {modalData?.category}
          </StyledItem>
        </StyledFormGroup>
        <StyledFormGroup controlId="date">
          <StyledFormLabel>Date</StyledFormLabel>
          <StyledItem>
            {modalData?.date}
          </StyledItem>
        </StyledFormGroup>
        <StyledFormGroup controlId="comment">
          <StyledFormLabel>Comment</StyledFormLabel>
          <StyledItem>
            {modalData?.comment}
          </StyledItem>
        </StyledFormGroup>
        <StyledFormGroup controlId="Value">
          <StyledFormLabel>Amount</StyledFormLabel>
          <StyledItem>
            {modalData?.value}
          </StyledItem>
        </StyledFormGroup>
        <StyledButtonGroup>
          {errorMsg && <StyledError> {errorMsg} </StyledError>}
          <StyledButton variant="warning" onClick={() => dispatch(setModalType(ModalType.editTransaction))}>
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
            defaultValue={
              // @ts-ignore
              modalData?.name
            }
            onChange={handleInputEditEvent}
            required
          />
        </StyledFormGroup>
        <StyledFormGroup controlId="categoryId">
          <StyledFormLabel>Category</StyledFormLabel>
          <StyledFormSelect
            type="text"
            name="categoryId"
            placeholder='Category'
            defaultValue={modalData?.categoryId}
            onChange={handleSelectEditEvent}
            required
          >
            {modalCatData.map((cat) => (
              <option value={cat.id}>{cat.name}</option>
            ))}
          </StyledFormSelect>
        </StyledFormGroup>
        <StyledFormGroup controlId="date">
          <StyledFormLabel>Date</StyledFormLabel>
          <StyledFormControl
            type="date"
            name="date"
            defaultValue={formatDate(modalData?.date)}
            onChange={handleInputEditEvent}
          />
        </StyledFormGroup>
        <StyledFormGroup controlId="comment">
          <StyledFormLabel>Comment</StyledFormLabel>
          <StyledFormControl
            type="text"
            name="comment"
            placeholder='More info'
            defaultValue={modalData?.comment}
            onChange={handleInputEditEvent}

          />
        </StyledFormGroup>
        <StyledFormGroup controlId="value">
          <StyledFormLabel>Amount</StyledFormLabel>
          <StyledFormControl
            type="number"
            name="value"
            placeholder='12.2'
            defaultValue={modalData?.value}
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
          <StyledButton variant='danger' onClick={() => dispatch(setModalType(ModalType.transactionDetails))}>
            Cancel
          </StyledButton>
        </StyledButtonGroup>
      </StyledForm>
    )
  }
  function renderBasicInvestEdit() {

    return (
      <StyledForm onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
        await handleEditBasicInvest(e)
      }}>
        <StyledFormGroup controlId="categoryId">
          <StyledFormLabel>Investment Type</StyledFormLabel>
          <StyledFormSelect
            type="text"
            name="categoryId"
            placeholder='Investment Type'
            defaultValue={(modalData as IBasicInvestment).categoryId}
            onChange={handleSelectEditEvent}
            required
          >
            {modalCatData.map((cat) => (
              <option value={cat.id}>{cat.name}</option>
            ))}
          </StyledFormSelect>
        </StyledFormGroup>
        <StyledFormGroup controlId="itemId">
          <StyledFormLabel>Index</StyledFormLabel>
          <StyledFormSelect
            type="text"
            name="itemId"
            placeholder='Index'
            defaultValue={(modalData as IBasicInvestment).itemId}
            onChange={handleSelectEditEvent}
            required
          >
            {items.filter((item) => item.categoryInvestmentId === updatedItem.categoryId).map((item) => (
              <option value={item.id}>{item.name}</option>
            ))}
          </StyledFormSelect>
        </StyledFormGroup>
        <StyledFormGroup controlId="comment">
          <StyledFormLabel>Comment</StyledFormLabel>
          <StyledFormControl
            type="text"
            name="comment"
            placeholder='More info'
            defaultValue={modalData.comment}
            onChange={handleInputEditEvent}

          />
        </StyledFormGroup>
        <StyledFormGroup controlId="amount">
          <StyledFormLabel>Amount</StyledFormLabel>
          <StyledFormControl
            type="number"
            name="amount"
            placeholder='12.2'
            defaultValue={(modalData as IBasicInvestment).amount}
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
          <StyledButton variant='danger' onClick={() => dispatch(setModalType(ModalType.basicInvestDetails))}>
            Cancel
          </StyledButton>
        </StyledButtonGroup>
      </StyledForm>
    )
  }

  useEffect(() => {
    // @ts-ignore
    const close = (e) => {
      if (isActive && e.key === 'Escape') {
        dispatch(toggleActive(false));

      }
      setErrorMsg('');
    }

    window.addEventListener('keydown', close);

    return () => window.removeEventListener('keydown', close)
  });

  useEffect(() => {
    setCurrentItems(items.filter((item) => item.categoryInvestmentId === newItem.categoryId));
    // (newItem as IBasicInvestment).itemId = currentItems[0].id;
  }, [modalCatData]);

  const renderByType = () => {
    switch (modalType) {
      case ModalType.addTransaction:
        return renderNewTransactionForm();

      case ModalType.addBasicInvest:
        return renderNewBasicInvestForm();

      case ModalType.editTransaction:
        return renderTransactionEdit();

      case ModalType.editBasicInvest:
        return renderBasicInvestEdit();

      case ModalType.transactionDetails:
        return renderTransactionDetails();

      case ModalType.basicInvestDetails:
        return renderBasicInvestDetails();
      default:
        return null;
    }
  }

  return (
    <StyledModalContainer
      isActive={isActive}
      onClick={() => {
        dispatch(toggleActive(false))
        setErrorMsg('');
        resetForm();
      }}
    >
      <StyledModalContent onClick={e => e.stopPropagation()}>
        {renderByType()}
      </StyledModalContent>
    </StyledModalContainer>
  );
};

export default Modal;

