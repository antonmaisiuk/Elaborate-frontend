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
  setTrans: Dispatch<SetStateAction<TransactionInter[]>>
  modalTransData?: TransactionInter,
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
  setTrans,
  modalTransData,
  modalTransCatData = [],
}) => {
  const [errorMsg, setErrorMsg] = useState('');
  // @ts-ignore
  const [token, setToken] = useState(getActualToken());
  const [transDetailData, setTransDetailData] = useState<TransactionInter>();
  // @ts-ignore
  const [formData, setFormData] = useState<TransactionInter>({
    id: '',
    name: '',
    category: '',
    categoryTransactionId: '',
    comment: '',
    date: new Date().toISOString(),
    value: 0,
  });
  const navigate = useNavigate();

  // !token && navigate('/login');


  const formatDate = (date: string | undefined) => {
    console.log('👉 Format date: ', date);
    if (date && !/T/.test(date)){
      let formattedDate;

      if (/./.test(date)) {
        const [day, month, year] = date.split('.');
        console.log(day, month, year);
        formattedDate = new Date(`${year}-${month}-${day}`).toISOString().split('T')[0];
      } else {
        const [year, month, day] = date.split('-');
        console.log(day, month, year);
        formattedDate = new Date(`${year}-${month}-${day}`).toISOString();
      }

      console.log('👉 formattedDate: ', );
      return formattedDate;
    }
    return date;
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    console.log('👉 Form data: ', formData);

  };

  const handleInputEditEvent = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = event.target;
    console.log('👉 Name: ', name, ' Value: ', value);
    if (name === 'date') {
      // @ts-ignore
      modalTransData[name] = new Date(value).toISOString();
    } else {
      // @ts-ignore
      modalTransData[name] = value;
    }

  };
  const handleSelectEditEvent = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const {name, value} = event.target;
    // @ts-ignore
    modalTransData[name] = value;
  };
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const {name, value} = event.target;
    console.log('👉 Select value: ', value);
    setFormData((prevData) => ({
      ...prevData,
      categoryTransactionId: value,
    }));

    console.log('👉 FormData: ', formData);

  };

  const resetFormData = () => Object.keys(formData).map((key) => {
    setFormData({
      id: '',
      name: '',
      comment: '',
      category: '',
      categoryTransactionId: modalTransCatData[0].id,
      date: new Date().toISOString(),
      value: 0,
    })
  });

  const printErrorMsg = (errorMsg: any) => setErrorMsg(Object.keys(errorMsg.errors).map((err) => errorMsg.errors[err]).join('\n'));

  const handleNewTransaction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (formData.categoryTransactionId === '') formData.categoryTransactionId = modalTransCatData[0].id;
    console.log('👉 New transaction data: ', formData);

    try {
      // formData.value = Number(formData.value);
      const response = await fetch('https://localhost:7247/api/user/transaction',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        })

      if (response.ok) {
        setActive(false);
        formData.date = moment(formData.date).format('DD.MM.YYYY');
        const updatedTrans = [...trans, formData];
        console.log('👉 Stocks: ', updatedTrans);
        resetFormData();
        setTrans(updatedTrans);
        setErrorMsg('');
      } else {    //
        const errorMsg = JSON.parse(await response.text());
        printErrorMsg(errorMsg);
        console.log('👉 Keys: ', errorMsg.errors[Object.keys(errorMsg.errors)[0]].join(','));

        // setErrorMsg(errorMsg.errors[Object.keys(errorMsg.errors)[0]][0]);
        setErrorMsg(Object.keys(errorMsg.errors).map((err) => errorMsg.errors[err]).join('\n'));
      }
    } catch (e) {

    }

  };
  const handleDeleteTransactions = async (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('👉 Delete',);

    const response = await fetch(`https://localhost:7247/api/user/transaction/${modalTransData?.id}`,
      {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }

      })

    if (response.ok) {
      setActive(false);
      setErrorMsg('');
      resetFormData();
      const updatedTrans = _.filter(trans, (item) => item.id !== modalTransData?.id);
      setTrans(updatedTrans);
    } else {
      const errorMsg = JSON.parse(await response.text());
      setErrorMsg(Object.keys(errorMsg.errors).map((err) => errorMsg.errors[err]).join('\n'));
    }
  }
  const handleEditTransaction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('👉 Before data: ', modalTransData);
    // @ts-ignore
    // modalTransData.date = formatDate(modalTransData.date)
    console.log('👉 Edit data: ', modalTransData);

    const response = await fetch(`https://localhost:7247/api/user/transaction/${modalTransData?.id}`,
      {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...modalTransData,
          date: formatDate(modalTransData?.date)
        }),

      })

    if (response.ok) {
      setActive(false);
      setErrorMsg('');
      resetFormData();

      // @ts-ignore

      modalTransData.date = moment(modalTransData?.date).format('DD.MM.YYYY');
      const updatedTrans = [...trans, modalTransData];
      // @ts-ignore
      setTrans(updatedTrans);
    } else {
      const errorMsg = JSON.parse(await response.text());
      setErrorMsg(Object.keys(errorMsg.errors).map((err) => errorMsg.errors[err]).join('\n'));
    }
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
            // value={formData[0].name}
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
            // value={formData[0].categoryTransactionId}
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
            // value={new Date().toISOString().split('T')[0]}
            // placeholder='Zakupy'
            onChange={handleInputChange}
          />
        </StyledFormGroup>
        <StyledFormGroup controlId="comment">
          <StyledFormLabel>Comment</StyledFormLabel>
          <StyledFormControl
            type="text"
            name="comment"
            placeholder='More info'
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
            // value={formData[0].value}
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
    return (
      <StyledDetailsWrapper>

        <StyledFormGroup controlId="name">
          <StyledFormLabel>Title</StyledFormLabel>
          <StyledItem>
            {modalTransData?.name}
          </StyledItem>

        </StyledFormGroup>
        <StyledFormGroup controlId="Category">
          <StyledFormLabel>Category</StyledFormLabel>
          <StyledItem>
            {modalTransData?.category}
          </StyledItem>
        </StyledFormGroup>
        <StyledFormGroup controlId="date">
          <StyledFormLabel>Date</StyledFormLabel>
          <StyledItem>
            {modalTransData?.date}
          </StyledItem>
        </StyledFormGroup>
        <StyledFormGroup controlId="comment">
          <StyledFormLabel>Comment</StyledFormLabel>
          <StyledItem>
            {modalTransData?.comment}
          </StyledItem>
        </StyledFormGroup>
        <StyledFormGroup controlId="Value">
          <StyledFormLabel>Amount</StyledFormLabel>
          <StyledItem>
            {modalTransData?.value}
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

  function renderTransactionEdit(data: TransactionInter | undefined) {
    console.log('DATE: ', data?.date);
    // console.log('DATE: ', new Date(data?.date || moment().format('YYYY-MM-DD')).toISOString().split('T')[0]);
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
            defaultValue={data?.name}
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
            defaultValue={data?.categoryTransactionId}
            onChange={handleSelectEditEvent}
            required
          >
            {modalTransCatData.map((cat) => (
              <option selected={cat.id === data?.categoryTransactionId} value={cat.id}>{cat.name}</option>
            ))}
          </StyledFormSelect>
        </StyledFormGroup>
        <StyledFormGroup controlId="date">
          <StyledFormLabel>Date</StyledFormLabel>
          <StyledFormControl
            type="date"
            name="date"
            // value={formatDate(data?.date)}
            defaultValue={formatDate(data?.date)}
            onChange={handleInputEditEvent}
          />
        </StyledFormGroup>
        <StyledFormGroup controlId="comment">
          <StyledFormLabel>Comment</StyledFormLabel>
          <StyledFormControl
            type="text"
            name="comment"
            placeholder='More info'
            defaultValue={data?.comment}
            onChange={handleInputEditEvent}

          />
        </StyledFormGroup>
        <StyledFormGroup controlId="value">
          <StyledFormLabel>Amount</StyledFormLabel>
          <StyledFormControl
            type="number"
            name="value"
            placeholder='12.2'
            defaultValue={data?.value}
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

  // if (modalTransData){
  //   // @ts-ignore
  //   Object.keys(formData).forEach((key) => formData[key] = modalTransData[key])
  // }

  return (
    <StyledModalContainer
      active={active}
      setActive={setActive}
      type={type}
      trans={trans}
      setTrans={setTrans}
      setModalType={setModalType}
      onClick={() => {
        setActive(false)
        setErrorMsg('');
        resetFormData();
      }}
     modalTransData={modalTransData}>
      <StyledModalContent onClick={e => e.stopPropagation()}>
        {
          type === ModalType.addTransaction && renderNewTransactionForm()
        }
        {
          type === ModalType.editTransaction && renderTransactionEdit(modalTransData)
        }
        {
          type === ModalType.transactionDetails && renderTransactionDetails()
        }

      </StyledModalContent>
    </StyledModalContainer>
  );
};

export default Modal;

