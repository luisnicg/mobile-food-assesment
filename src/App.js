import "./App.css";
import 'react-tooltip/dist/react-tooltip.css'
import React from 'react';
import { useState } from "react";
import { usePapaParse } from 'react-papaparse';
import { Tooltip as ReactTooltip } from 'react-tooltip'

const useSortableData = (items, config = null) => {
  const [sortConfig, setSortConfig] = React.useState(config);

  const sortedItems = React.useMemo(() => {
    let sortableItems = [...items];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [items, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return { items: sortedItems, requestSort, sortConfig };
};

const ProductTable = (props) => {
  const { items, requestSort, sortConfig } = useSortableData(props.products);
  const getClassNamesFor = (name) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };
  return (
    <table id="food-facility">
      <caption>Mobile Food Facility Permit</caption>
      <thead>
        <tr>
          <th>
            <button
              type="button"
              onClick={() => requestSort(1)}
              className={getClassNamesFor(1)}
            >
              Applicant
            </button>
          </th>
          <th>
            <button
              type="button"
              onClick={() => requestSort(2)}
              className={getClassNamesFor(2)}
            >
              Facility Type
            </button>
          </th>
          <th>
            <button
              type="button"
              onClick={() => requestSort(3)}
              className={getClassNamesFor(3)}
            >
              Status
            </button>
          </th>
          <th>
            <button
              type="button"
              onClick={() => requestSort(4)}
              className={getClassNamesFor(4)}
            >
              Address
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, index) => (
          <tr key={item[0]}>
            <td>
              <span
                id={"index"+index}
                data-tooltip-content={item[5]}
                >
                {item[1]}
              </span>
              <ReactTooltip anchorId={"index"+index} />
            </td>
            <td>{item[2]}</td>
            <td>{item[3]}</td>
            <td>{item[4]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default function App() {
  const { readRemoteFile } = usePapaParse();

  const [rows, setRows] = useState([]);

  readRemoteFile('https://data.sfgov.org/api/views/rqzj-sfat/rows.csv', {
    complete: (results) => {
      const rowsArray = [];
      var header = true;

      results.data.map((target) => {
        var tooltip = 'Food Items: ' + target[11];
        const rowItems = [target[0], target[1], target[2], target[10], target[5], tooltip];
        if (header) {
          header = false;
        }
        else {
          rowsArray.push(rowItems);
        }
      });
      setRows(rowsArray);
    },
  });

  return (
    <div className="App">
      <ProductTable
        products={rows}
      />
    </div>
  );
}
