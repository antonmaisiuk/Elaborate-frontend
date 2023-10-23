import React, {useEffect, useState} from 'react';
import Layout from "../../Layout/Layout";
import Navigation from "../../Navigation/Navigation";
import Content from "../../Content/Content";
import Header from "../../Header/Header";
import {StyledTitle} from "./style";
import Table, { TransactionInter, TransCategoryInter } from "../../Table/Table";
import moment from 'moment';
import { orderBy } from 'lodash';
import { useNavigate } from 'react-router-dom';


const getActualToken = () => {
  const token = document.cookie.match('token');

  if (token && token.input) return token.input.split('=')[1];

  return '';
}

const Stocks = () => {
  const [categories, setCategories] = useState<TransCategoryInter[]>([]);
  // @ts-ignore
  const [token, setToken] = useState(getActualToken());
  const [stocks, setStocks] = useState<TransactionInter[]>([]);

  // const [logged, setLogged] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) navigate('/login');
  })
  // console.log('👉 Token: ', logged);

  useEffect(() => {

    console.log('👉 Handling stocks');
    const handleStocks = async () => {
      const resTrans = await fetch(`https://localhost:7247/api/user/basicinvestment`,
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

        setStocks(transArray);
      } else {
        const errorMsg = JSON.parse(await resTrans.text());
        // setErrorMsg(errorMsg.message);
        console.log(errorMsg.message);
      }
    };

    const handleCategories = async () => {
      const resCat = await fetch(`https://localhost:7247/api/category-investment`,
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
        // await handleCategories();
        await handleStocks();
      } else navigate('/login');

    })();
  }, [/*stocks*/])

// function formatStocks() {
  stocks.forEach((trans: TransactionInter) => {
    trans.category = categories.filter((cat: TransCategoryInter) => {
      return cat.id === trans.categoryTransactionId
    })[0].name || 'No category'
  });
// }
//   formatStocks();

  return (
    <Layout>
      <Navigation/>
      <Content>
        <Header/>
        <StyledTitle>Recent Stocks</StyledTitle>
        { stocks.length && <Table trans={stocks} setTrans={setStocks} tableData={stocks} transCatData={categories}/>}
      </Content>
    </Layout>
  );
};

export default Stocks;
