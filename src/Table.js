import React from 'react';
import './Table.css';
import numeral from "numeral";

function Table({countries}) {
    return <div className="table">
           {countries.map(({country , cases}) => {
               return<tr>
                 <td>{country}</td>
                 {/* <td><strong>{cases}</strong></td> */}
                 <strong>{numeral(cases).format("0,0")}</strong>
             </tr>
           })} 
        </div>;
}

export default Table;
