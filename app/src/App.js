import "./App.css";
import 'react-tooltip/dist/react-tooltip.css'
import React from 'react';
import { useState } from "react";
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
  //const { readRemoteFile } = usePapaParse();

  const [rows, setRows] = useState([]);

  fetch('http://localhost:49335/')
  .then(response => response.json())
  .then((jsonData) => {
    const rowsArray = [];
    jsonData.map((target) => {
      console.log(target);
      var tooltip = 'Food Items: ' + target['FoodItems'];
      const rowItems = [target['locationid'], target['Applicant'], target['FacilityType'], target['Status'], target['Address'], tooltip];
      rowsArray.push(rowItems);
    });
    setRows(rowsArray);
  })
  .catch((error) => {
    // handle your errors here
    console.error(error)
  })

  return (
    <div className="App">
      <ProductTable
        products={rows}
      />
    </div>
  );
}
