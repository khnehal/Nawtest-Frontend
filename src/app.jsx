import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { PAYMENT_STATUS } from "./constants.js";

import "bootstrap/dist/css/bootstrap.min.css";
import "./app.scss";


const App = () => {
  const [data, setData] = useState({});
  const [status, setStatus] = useState("");
  const tableScrollerRef = useRef();

  useEffect(() => {
    getData(false);
  }, []);

  useEffect(() => {
    const filteredData = (data.results || []).filter(el => el.paymentStatus===status);
    setData({
      ...data,
      filteredData
    });
  }, [status]);

  const getData = (fetchNext) => {
    if (fetchNext && !data.metaDatal.hasMoreElements) return;

    const url = fetchNext ? 
                  `http://localhost:9001/api/payments/?pagelndex=${data.metaDatal.nextPageIndex}` : 
                  "http://localhost:9001/api/payments";

    axios
      .get(url)
      .then((response) => {
        if (response.data) {
          const res = response.data;
          if (fetchNext) {
            res.results.push(...data.results);
            if (status) {
              const filteredData = (res.results || []).filter(el => el.paymentStatus===status);
              res['filteredData'] = filteredData;
            }
          }
          setData(res);
        }
      });
  };

  const onScroll = () => {
    if (tableScrollerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = tableScrollerRef.current;

      if (Math.ceil(scrollTop + clientHeight) >= scrollHeight) {
        getData(true);
      } 
    }
  };

  const getHeaders = () => {
    return (
      <div className="row">
        <div className="col-sm">
          <h1 className="p-3">Payment Records</h1>
        </div>
        <div className="col-sm p-4">
          <select 
            className="custom-select" 
            onChange={e => setStatus(e.target.value)}
          >
            <option value={""}>Select Status</option>
            {
              Object.keys(PAYMENT_STATUS).map(item => {
                return (
                  <option value={`${item}`} key={item}>{PAYMENT_STATUS[item]}</option>
                )
              })
            }
          </select>
        </div>
      </div>
    )
  }

  const getTableBody = (items) => {
    return (
      <tbody>
        {(items || []).map((option, index) => {
          return (
            <tr key={index+1}>
              <th scope="row">{index+1}</th>
              <td>
                <div>{(option.fromAccount || {}).accountName}</div>
                <div>{(option.fromAccount || {}).accountNumber}</div>
              </td>
              <td>
                <div>{(option.toAccaunt || {}).accountName}</div>
                <div>{(option.toAccaunt || {}).accountNumber}</div>
              </td>
              <td>{option.paymentType}</td>
              <td>{option.paymentDate}</td>
              <td>{option.paymentCurrency}</td>
              <td>{option.paymentAmount}</td>
              <td>{PAYMENT_STATUS[option.paymentStatus]}</td>
            </tr>
          )
        })}
      </tbody>
    );
  }
  
  return (
    <div
      ref={tableScrollerRef} 
      onScroll={() => onScroll()} 
      style={{overflowY: 'scroll', maxHeight: 'calc(100vh - 1px)'}}
    >
      <div className="container">
        {getHeaders()}
        
        <table className="table table-striped table-dark table-hover">
          <thead className="thead-dark">
            <tr>
              {
                ["#", "From", "To", "Type", "Date", "Currency", "Amt", "Status"].map(el => (
                  <th key={el}> {el} </th>
                ))
              }
            </tr>
          </thead>
          
          {getTableBody(status ? data.filteredData : data.results)}  
        </table>

      </div>
    </div>
  );
};

export default App;
