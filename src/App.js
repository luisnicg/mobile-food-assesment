import "./App.css";
import { useState } from "react";
import { usePapaParse } from 'react-papaparse';

function App() {
  const { readRemoteFile } = usePapaParse();

  const [tableRows, setTableRows] = useState([]);

  const [rows, setRows] = useState([]);

  readRemoteFile('https://data.sfgov.org/api/views/rqzj-sfat/rows.csv', {
    complete: (results) => {
      const rowsArray = [];
      var header = true;
      results.data.map((target) => {
        const rowItems = [target[0], target[1], target[2], target[10]];
        if (header) {
          setTableRows(rowItems);
          header = false;
        }
        rowsArray.push(rowItems);
      });
      setRows(rowsArray);
    },
  });

  return (
    <div>
      <div className="table">
        <div className="table-header">
          {tableRows.map((rows, index) => {
            return <div className="header__item" key={index}>{rows}</div>;
          })}
        </div>
        <div className="table-content">
        {rows.map((value, index) => {
            return (
              <div className="table-row" key={index}>
                {value.map((val, i) => {
                  return <div className="table-data" key={i}>{val}</div>;
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;