// import axios from 'axios';
// import React, { useEffect, useState } from 'react';

// const Api = () => {
//   const apiKey = "0175ab7062a2153121ff5a15c36b6df0";
//   const [day, setDay] = useState(null);
//   const [month, setMonth] = useState(null);
//   const [year, setYear] = useState(null);
//   const start='1'
//   const end='24'
//   const lat='126'
//   const lon='123'

//   const fetchData = async () => {
//     try {
//       const res = await axios.get(
//         `https://history.openweathermap.org/data/2.5/history/city?lat={lat}&lon={lon}&type=hour&start={start}&end={end}&appid={apikey}`
//       );
//       setYear(res.data);
//       console.log(res.data); 
//     } catch (err) {
//       console.error("Error fetching historical data:", err);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []); // runs only once

//   return <div>Api</div>;
// };

// export default Api;
