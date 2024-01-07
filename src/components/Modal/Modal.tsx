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
  StyledFormSelect, StyledPassInputWrapper
} from "../Auth/styled";
import {dataMainType, ITransaction} from "../Table/Table";
import {addTransactionAsync, deleteTransactionAsync, updateTransactionAsync} from "../../redux/transactionSlice";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../redux/store";
import {setModalType, toggleActive} from "../../redux/modalSlice";
import {addBasicInvestsAsync, deleteBasicInvestAsync, updateBasicInvestAsync} from "../../redux/basicInvestSlice";
import {IBasicInvestment, IItem, IOtherInvestment} from "../Investments/Overview/InvestOverview";
import {useTranslation} from "react-i18next";
import {addOtherInvestAsync, deleteOtherInvestAsync, updateOtherInvestAsync} from "../../redux/otherInvestSlice";
import _ from "lodash";

export enum ModalType {
  addTransaction,
  addOtherInvest,
  addBasicInvest,
  editTransaction,
  editOtherInvest,
  editBasicInvest,
  transactionDetails,
  otherInvestDetails,
  basicInvestDetails
}

const Modal: FC<HTMLAttributes<HTMLDivElement>> = () => {

  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();

  const modalType = useSelector((state: RootState) => state.modal.modalType);
  const isActive = useSelector((state: RootState) => state.modal.isActive);
  const modalData = useSelector((state: RootState) => state.modal.modalData);
  const modalCatData = useSelector((state: RootState) => state.modal.modalCatData);
  const modalItems = useSelector((state: RootState) => state.modal.modalItems);

  const items = useSelector((state: RootState) => state.basicInvestments.items);
  const loading = useSelector((state: RootState) => state.basicInvestments.basicLoading);

  // const currentItems = items.filter((item) => item.categoryInvestmentId === newItem.categoryId);

  const updatedItem = {...modalData};
  const [newItem, setNewItem] = useState<dataMainType | IOtherInvestment>({
    id: '',
    name: '',
    category: '',
    categoryId: '',
    itemId: '',
    comment: '',
    date: new Date().toISOString(),
    value: 0,
    amount: 0,
    unit: 'ozt',
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [currentItems, setCurrentItems] = useState<IItem[]>(items.filter((item) => item.categoryInvestmentId === (newItem as IBasicInvestment | ITransaction).categoryId));



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

    if ((newItem as ITransaction).categoryId === '') (newItem as ITransaction).categoryId = modalCatData[0].id;
    dispatch(addTransactionAsync(newItem as ITransaction));

    dispatch(toggleActive(false));
    resetForm();
  };

  const handleNewOtherInvest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch(addOtherInvestAsync(newItem as IOtherInvestment));

    dispatch(toggleActive(false));
    resetForm();
  };
  const handleNewBasicInvest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if ((newItem as IBasicInvestment).categoryId === '') (newItem as IBasicInvestment).categoryId = modalCatData[0].id;
    if (!(newItem as IBasicInvestment).itemId) (newItem as IBasicInvestment).itemId = modalItems[0].id;
    if (modalCatData[0].id === process.env.REACT_APP_METALS_ID) {
      if (!(newItem as IBasicInvestment).unit) (newItem as IBasicInvestment).unit = 'ozt';
      if ((newItem as IBasicInvestment).unit === 'gram') (newItem as IBasicInvestment).amount = _.round((newItem as IBasicInvestment).amount / 31.104, 3)
    }
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

  const handleDeleteOtherInvest = async (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(deleteOtherInvestAsync(modalData.id))

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

  const handleEditOtherInvest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // @ts-ignore
    dispatch(updateOtherInvestAsync({
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
          <StyledFormLabel>{t('table.title')}</StyledFormLabel>
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
          <StyledFormLabel>{t('table.category')}</StyledFormLabel>
          <StyledFormSelect
            type="text"
            name="categoryId"
            placeholder={t('table.category')}
            onChange={handleSelectChange}
            required
          >
            <option disabled>{t('table.category')}</option>
            {modalCatData.map((cat) => (
              <option value={cat.id}>{cat.name}</option>
            ))}
          </StyledFormSelect>
        </StyledFormGroup>
        <StyledFormGroup controlId="date">
          <StyledFormLabel>{t('table.date')}</StyledFormLabel>
          <StyledFormControl
            type="date"
            name="date"
            defaultValue={new Date().toISOString().split('T')[0]}
            onChange={handleInputChange}
          />
        </StyledFormGroup>
        <StyledFormGroup controlId="comment">
          <StyledFormLabel>{t('table.comment')}</StyledFormLabel>
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
          <StyledFormLabel>{t('table.total')}</StyledFormLabel>
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
        <StyledButton className="success" type="submit">
          {t('modal.save')}
        </StyledButton>
      </StyledForm>
    )
  }

  function renderNewOtherInvestForm() {
    return (
      <StyledForm onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
        await handleNewOtherInvest(e)
      }}>
        <StyledFormGroup controlId='title'>
          <StyledFormLabel>{t('table.title')}</StyledFormLabel>
          <StyledFormControl
            type='text'
            name='title'
            placeholder='Phone'
            value={'title' in newItem ? (newItem as IOtherInvestment).title : ''}
            onChange={handleInputChange}
            required
          />
        </StyledFormGroup>
        <StyledFormGroup controlId="date">
          <StyledFormLabel>{t('table.date')}</StyledFormLabel>
          <StyledFormControl
            type="date"
            name="date"
            defaultValue={new Date().toISOString().split('T')[0]}
            onChange={handleInputChange}
          />
        </StyledFormGroup>
        <StyledFormGroup controlId="comment">
          <StyledFormLabel>{t('table.comment')}</StyledFormLabel>
          <StyledFormControl
            type="text"
            name="comment"
            placeholder='More info'
            value={newItem.comment}
            onChange={handleInputChange}
          />
        </StyledFormGroup>
        <StyledFormGroup controlId="value">
          <StyledFormLabel>{t('table.total')}</StyledFormLabel>
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
        <StyledButton className="success" type="submit">
          {t('modal.save')}
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
            disabled
            required
          >
            {modalCatData.map((cat) => (
              <option selected value={cat.id}>{cat.name}</option>
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
              modalItems.map((item) => (
              <option value={item.id}>{item.name}</option>
            ))
            }
          </StyledFormSelect>
        </StyledFormGroup>
        <StyledFormGroup controlId="comment">
          <StyledFormLabel>{t('table.comment')}</StyledFormLabel>
          <StyledFormControl
            type="text"
            name="comment"
            placeholder='More info'
            value={newItem.comment}
            onChange={handleInputChange}
          />
        </StyledFormGroup>
        <StyledFormGroup controlId="amount">
          <StyledFormLabel>{t('table.amount')}</StyledFormLabel>
          <StyledPassInputWrapper>
            <StyledFormControl
              type="number"
              name="amount"
              className={modalCatData[0].id === process.env.REACT_APP_METALS_ID ? 'combined_input' : ''}
              placeholder='12.2'
              value={"amount" in newItem ? newItem.amount : ''}
              onChange={handleInputChange}
              step={0.01}
              required
            />
            {modalCatData[0].id === process.env.REACT_APP_METALS_ID
              ? <StyledFormSelect
                type="text"
                className='modal_units'
                name="unit"
                placeholder='Index'
                onChange={handleSelectChange}
                required
              >
                <option value={'ozt'}>{t('table.ozt')}</option>
                <option value={'gram'}>{t('table.gram')}</option>
                {/*<option value={'pcs'}>{t('table.pcs')}</option>*/}
                {
                  // modalItems.map((item) => (
                  // <option value={item.id}>унц.</option>
                  // ))
                }
              </StyledFormSelect>
              : ''
            }
          </StyledPassInputWrapper>
        </StyledFormGroup>
        {errorMsg && <StyledError> {errorMsg} </StyledError>}
        <StyledButton className="success" type="submit">
          {t('modal.save')}
        </StyledButton>
      </StyledForm>
    )
  }

  function renderBasicInvestDetails() {
    return (
      <StyledDetailsWrapper>

        <StyledFormGroup controlId="category">
          <StyledFormLabel>{t('modal.investmentType')}</StyledFormLabel>
          <StyledItem>
            {(modalData as ITransaction | IBasicInvestment).category}
          </StyledItem>
        </StyledFormGroup>
        <StyledFormGroup controlId="item">
          <StyledFormLabel>{t('table.index')}</StyledFormLabel>
          <StyledItem>
            {(modalData as IBasicInvestment).item}
          </StyledItem>
        </StyledFormGroup>
        <StyledFormGroup controlId="date">
          <StyledFormLabel>{t('table.date')}</StyledFormLabel>
          <StyledItem>
            {modalData.date}
          </StyledItem>
        </StyledFormGroup>
        <StyledFormGroup controlId="comment">
          <StyledFormLabel>{t('table.comment')}</StyledFormLabel>
          <StyledItem>
            {modalData.comment}
          </StyledItem>
        </StyledFormGroup>
        <StyledFormGroup controlId="amount">
          <StyledFormLabel>{t('table.amount')}</StyledFormLabel>
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
          <StyledButton className="warning" onClick={() => dispatch(setModalType(ModalType.editBasicInvest))}>
            {t('modal.edit')}
          </StyledButton>
          <StyledButton className="danger" onClick={async (e) => await handleDeleteBasicInvest(e)}>
            {t('modal.delete')}
          </StyledButton>
        </StyledButtonGroup>

      </StyledDetailsWrapper>
    );
  }

  function renderOtherInvestDetails() {
    return (
      <StyledDetailsWrapper>
        <StyledFormGroup controlId="title">
          <StyledFormLabel>{t('table.title')}</StyledFormLabel>
          <StyledItem>
            {(modalData as IOtherInvestment).title}
          </StyledItem>
        </StyledFormGroup>
        <StyledFormGroup controlId="comment">
          <StyledFormLabel>{t('table.comment')}</StyledFormLabel>
          <StyledItem>
            {modalData.comment}
          </StyledItem>
        </StyledFormGroup>
        <StyledFormGroup controlId="date">
          <StyledFormLabel>{t('table.date')}</StyledFormLabel>
          <StyledItem>
            {(modalData as IOtherInvestment).date}
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
          <StyledButton className="warning" onClick={() => dispatch(setModalType(ModalType.editOtherInvest))}>
            {t('modal.edit')}
          </StyledButton>
          <StyledButton className="danger" onClick={async (e) => await handleDeleteOtherInvest(e)}>
            {t('modal.delete')}
          </StyledButton>
        </StyledButtonGroup>

      </StyledDetailsWrapper>
    );
  }
  function renderTransactionDetails() {
    return (
      <StyledDetailsWrapper>

        <StyledFormGroup controlId="name">
          <StyledFormLabel>{t('table.title')}</StyledFormLabel>
          <StyledItem>
            {
              // @ts-ignore
              modalData?.name
            }
          </StyledItem>

        </StyledFormGroup>
        <StyledFormGroup controlId="Category">
          <StyledFormLabel>{t('table.category')}</StyledFormLabel>
          <StyledItem>
            {(modalData as ITransaction | IBasicInvestment).category}
          </StyledItem>
        </StyledFormGroup>
        <StyledFormGroup controlId="date">
          <StyledFormLabel>{t('table.date')}</StyledFormLabel>
          <StyledItem>
            {modalData?.date}
          </StyledItem>
        </StyledFormGroup>
        <StyledFormGroup controlId="comment">
          <StyledFormLabel>{t('table.comment')}</StyledFormLabel>
          <StyledItem>
            {modalData?.comment}
          </StyledItem>
        </StyledFormGroup>
        <StyledFormGroup controlId="Value">
          <StyledFormLabel>{t('table.total')}</StyledFormLabel>
          <StyledItem>
            {modalData?.value}
          </StyledItem>
        </StyledFormGroup>
        <StyledButtonGroup>
          {errorMsg && <StyledError> {errorMsg} </StyledError>}
          <StyledButton className="warning" onClick={() => dispatch(setModalType(ModalType.editTransaction))}>
            {t('modal.edit')}
          </StyledButton>
          <StyledButton className="danger" onClick={async (e) => await handleDeleteTransactions(e)}>
            {t('modal.delete')}
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
          <StyledFormLabel>{t('table.title')}</StyledFormLabel>
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
          <StyledFormLabel>{t('table.category')}</StyledFormLabel>
          <StyledFormSelect
            type="text"
            name="categoryId"
            placeholder={t('table.category')}
            defaultValue={(modalData as ITransaction | IBasicInvestment)?.categoryId}
            onChange={handleSelectEditEvent}
            required
          >
            {modalCatData.map((cat) => (
              <option value={cat.id}>{cat.name}</option>
            ))}
          </StyledFormSelect>
        </StyledFormGroup>
        <StyledFormGroup controlId="date">
          <StyledFormLabel>{t('table.date')}</StyledFormLabel>
          <StyledFormControl
            type="date"
            name="date"
            defaultValue={formatDate(modalData?.date)}
            onChange={handleInputEditEvent}
          />
        </StyledFormGroup>
        <StyledFormGroup controlId="comment">
          <StyledFormLabel>{t('table.comment')}</StyledFormLabel>
          <StyledFormControl
            type="text"
            name="comment"
            placeholder='More info'
            defaultValue={modalData?.comment}
            onChange={handleInputEditEvent}

          />
        </StyledFormGroup>
        <StyledFormGroup controlId="value">
          <StyledFormLabel>{t('table.total')}</StyledFormLabel>
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
          <StyledButton className='success' type='submit'>
            {t('modal.save')}
          </StyledButton>
          <StyledButton className='danger' onClick={() => dispatch(setModalType(ModalType.transactionDetails))}>
            {t('modal.cancel')}
          </StyledButton>
        </StyledButtonGroup>
      </StyledForm>
    )
  }

  function renderOtherInvestEdit() {

    return (
      <StyledForm onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
        await handleEditOtherInvest(e)
      }}>
        <StyledFormGroup controlId="name">
          <StyledFormLabel>{t('table.title')}</StyledFormLabel>
          <StyledFormControl
            type="text"
            name="name"
            placeholder='Telefon'
            defaultValue={
              // @ts-ignore
              modalData?.title
            }
            onChange={handleInputEditEvent}
            required
          />
        </StyledFormGroup>
        <StyledFormGroup controlId="date">
          <StyledFormLabel>{t('table.date')}</StyledFormLabel>
          <StyledFormControl
            type="date"
            name="date"
            defaultValue={formatDate(modalData?.date)}
            onChange={handleInputEditEvent}
          />
        </StyledFormGroup>
        <StyledFormGroup controlId="comment">
          <StyledFormLabel>{t('table.comment')}</StyledFormLabel>
          <StyledFormControl
            type="text"
            name="comment"
            placeholder='More info'
            defaultValue={modalData?.comment}
            onChange={handleInputEditEvent}

          />
        </StyledFormGroup>
        <StyledFormGroup controlId="value">
          <StyledFormLabel>{t('table.total')}</StyledFormLabel>
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
          <StyledButton className='success' type='submit'>
            {t('modal.save')}
          </StyledButton>
          <StyledButton className='danger' onClick={() => dispatch(setModalType(ModalType.otherInvestDetails))}>
            {t('modal.cancel')}
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
          <StyledFormLabel>{t('modal.investmentType')}</StyledFormLabel>
          <StyledFormSelect
            type="text"
            name="categoryId"
            placeholder='Investment Type'
            defaultValue={(modalData as IBasicInvestment).categoryId}
            onChange={handleSelectEditEvent}
            disabled
            required
          >
            {modalCatData.map((cat) => (
              <option value={cat.id}>{cat.name}</option>
            ))}
          </StyledFormSelect>
        </StyledFormGroup>
        <StyledFormGroup controlId="itemId">
          <StyledFormLabel>{t('table.index')}</StyledFormLabel>
          <StyledFormSelect
            type="text"
            name="itemId"
            placeholder={t('table.index')}
            defaultValue={(modalData as IBasicInvestment).itemId}
            onChange={handleSelectEditEvent}
            disabled
            required
          >
            {items.filter((item) => item.categoryInvestmentId === (updatedItem as ITransaction | IBasicInvestment).categoryId).map((item) => (
              <option value={item.id}>{item.name}</option>
            ))}
          </StyledFormSelect>
        </StyledFormGroup>
        <StyledFormGroup controlId="comment">
          <StyledFormLabel>{t('table.comment')}</StyledFormLabel>
          <StyledFormControl
            type="text"
            name="comment"
            placeholder='More info'
            defaultValue={modalData.comment}
            onChange={handleInputEditEvent}

          />
        </StyledFormGroup>
        <StyledFormGroup controlId="amount">
          <StyledFormLabel>{t('table.amount')}</StyledFormLabel>
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
          <StyledButton className='success' type='submit'>
            {t('modal.save')}
          </StyledButton>
          <StyledButton className='danger' onClick={() => dispatch(setModalType(ModalType.basicInvestDetails))}>
            {t('modal.cancel')}
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

  // useEffect(() => {
  //   console.log('👉 Items: ', items);
  //   console.log('👉 Filtered items: ', items.filter((item) => item.categoryInvestmentId === (newItem as ITransaction | IBasicInvestment).categoryId));
  //   console.log('👉 NewItem: ', newItem);
  //   setCurrentItems(items.filter((item) => item.categoryInvestmentId === (newItem as ITransaction | IBasicInvestment).categoryId));
  //   console.log('👉 New items: ', currentItems);
  // }, [modalCatData]);

  const renderByType = () => {
    switch (modalType) {
      case ModalType.addTransaction:
        return renderNewTransactionForm();
      case ModalType.editTransaction:
        return renderTransactionEdit();
      case ModalType.transactionDetails:
        return renderTransactionDetails();

      case ModalType.addOtherInvest:
        return renderNewOtherInvestForm();
      case ModalType.otherInvestDetails:
        return renderOtherInvestDetails();
      case ModalType.editOtherInvest:
        return renderOtherInvestEdit();

      case ModalType.addBasicInvest:
        return renderNewBasicInvestForm();
      case ModalType.editBasicInvest:
        return renderBasicInvestEdit();
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

