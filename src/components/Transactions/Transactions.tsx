import React, {useEffect, useState} from 'react';
import Layout from "../Layout/Layout";
import Navigation from "../Navigation/Navigation";
import Content from "../Content/Content";
import Header from "../Header/Header";
import {StyledTitle} from "./style";
import Table, { TransactionInter, TransCategoryInter } from "../Table/Table";
import moment from 'moment';
import { orderBy } from 'lodash';
import { useNavigate } from 'react-router-dom';


const getActualToken = () => {
  const token = document.cookie.match('token');

  if (token && token.input) return token.input.split('=')[1];

  return '';
}

const Transactions = () => {
  const [categories, setCategories] = useState<TransCategoryInter[]>([]);
  // @ts-ignore
  const [token, setToken] = useState(getActualToken());
  const [transactions, setTransactions] = useState<TransactionInter[]>([]);

  // const [logged, setLogged] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) navigate('/login');
  })
  // console.log('👉 Token: ', logged);

  useEffect(() => {

    console.log('👉 Handling transactions');
    const handleTransactions = async () => {
      const resTrans = await fetch(`https://localhost:7247/api/user/transaction`,
        {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${token}`
          },
        })

      if (resTrans.ok) {
        const transArray = orderBy(await resTrans.json(), ['date'], ['desc']);

        transArray.forEach((trans: TransactionInter) => trans.date = moment(trans.date).format('DD.MM.YYYY'))

        setTransactions(transArray);
      } else {
        const errorMsg = JSON.parse(await resTrans.text());
        // setErrorMsg(errorMsg.message);
        console.log(errorMsg.message);
      }
    };

    const handleCategories = async () => {
      const resCat = await fetch(`https://localhost:7247/api/transaction-category`,
        {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${token}`
          },
        })

      if (resCat.ok) {
        const cat = await resCat.json();

        setCategories(cat);
      } else {
        const errorMsg = JSON.parse(await resCat.text());
        console.log(errorMsg.message);
      }
    };

    (async () => {
      if (token){
        await handleCategories();
        await handleTransactions();
      } else navigate('/login');

    })();
  }, [/*transactions*/])

// function formatTransactions() {
  transactions.forEach((trans: TransactionInter) => {
    trans.category = categories.filter((cat: TransCategoryInter) => {
      return cat.id === trans.categoryTransactionId
    })[0].name || 'No category'
  });
// }
//   formatTransactions();

  return (
    <Layout>
      <Navigation/>
      <Content>
        <Header/>
        <StyledTitle>Recent Transaction</StyledTitle>
        { transactions.length && <Table trans={transactions} setTrans={setTransactions} tableData={transactions} transCatData={categories}/>}
      </Content>
    </Layout>
  );
};

export default Transactions;
