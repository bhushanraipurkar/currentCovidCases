// https://github.com/mathdroid/covid19
//https://disease.sh/c3/covid-19/countries


import { Card, CardContent, MenuItem, Select } from '@material-ui/core'
import FormControl from '@material-ui/core/FormControl';
import React, { useEffect, useState } from 'react'
import "./App.css"
import InfoBox from './infoBox';
import Map from './map';
import Table from './Table';
import { sortData ,prettyPrintStat } from './util';
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";

function App() {
  const [countries , setCountries]=useState([]);
  const [country , setCountry]=useState("worldwide");
  const [countryInfo , setCountryInfo] =useState({});
  const [tableData , setTableData] = useState([]);
  const [mapCenter,setMapCenter] = useState({ lat:34.80746 , lng:-40.4796});
  const [mapZoom , setMapZoom] = useState(3);
  const [mapCountries , setMapCountries] =useState([]);
  const [casesType , setCasesType] = useState("cases");

  useEffect(()=>{
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data);
    })
  },[])


  useEffect(()=>{
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data)=>{
          const countries = data.map((country)=>({
              name:country.country,
              value:country.countryInfo.iso2
            }));

            const sortedData = sortData(data);
            setTableData(sortedData);
            setMapCountries(data);
            setCountries(countries);
      });
    };
    getCountriesData();
  },[]); //whenever it see any change in variable countries (State) it will automatically fetch it

  const onCountryChange =async (event) =>{
    const countryCode = event.target.value;
    
    const url = countryCode === "worldwide" ? "https://disease.sh/v3/covid-19/all":`https://disease.sh/v3/covid-19/countries/${countryCode}`

    await fetch(url)
    .then(response => response.json())
    .then(data => {
      setCountry(countryCode);
      setCountryInfo(data);
 
      
      setMapZoom(4);
    })
  };
  console.log(countryInfo);

  return (
    <div className="app">
      <div className="app__left">
    <div className="app__header">
     <h1>COVID-19 Tracker</h1>
     <FormControl>
       <Select variant="outlined"  value={country} onChange={onCountryChange}>
       <MenuItem value="worldwide">WorldWide</MenuItem>
         {countries.map((country)=>{
           return(
           <MenuItem value={country.value}>{country.name}</MenuItem>
           )
         })}
          
       </Select>
       </FormControl>
       </div>

       <div className="app__stats">
         <InfoBox isRed active={casesType === "cases"} onClick={e => setCasesType('cases')} total={countryInfo.cases} cases={prettyPrintStat(countryInfo.todayCases)} title="Coronavirus cases"/>
         <InfoBox active={casesType === "recovered"} onClick={e => setCasesType('recovered')} total={countryInfo.recovered} cases={prettyPrintStat(countryInfo.todayRecovered)} title="Recoverd"/>
         <InfoBox isRed active={casesType === "deaths"} onClick={e => setCasesType('deaths')} total={countryInfo.deaths} cases={prettyPrintStat(countryInfo.todayDeaths)} title="Deaths"/>
       </div>
       <Map 
       casesType={casesType}
       countries={mapCountries}
       center={mapCenter}
       zoom={mapZoom}/>
       </div>
      <Card className="app__right">
         <CardContent>
           <h3>Live cases by country</h3>
            <Table countries={tableData} />
           
            {/* <LineGraph ountries={tableData} />  */}
         </CardContent>
      </Card>
    </div>
  )
}

export default App;