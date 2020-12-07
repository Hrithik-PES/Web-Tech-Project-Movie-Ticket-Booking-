import React, { useState } from 'react';
import { Seat } from './models/theatre';
import SeatMap from './Theatre';

export enum UiState {
  INPUT_DETAILS_SCREEN,
  SEAT_MAP_SCREEN,
  BOOKING_AND_PAYMENT_SCREEN,
}

const myStyles = {
  color:"blue",
  "font-size":"200%",
  "text-align":"center",
} as React.CSSProperties;

const inputStyles = {
  border: "3px solid #f1f1f1",
  padding: "16px",
  "text-align": "center",
} as React.CSSProperties;

const buttonStyle = {
  "background-color": "#4CAF50",
  color: "white",
  padding: "14px 20px",
  margin: "8px 0",
  border: "none",
  cursor: "pointer",
  width: "40%",
  align: "center",
}  as React.CSSProperties;

const styles = {
  width: "40%",
  padding: "12px 20px",
  margin: "8px 0",
  border: "1px solid #ccc",
  align: "center",
  "font-size":"large",
  "box-sizing": "border-box",
} as React.CSSProperties;

const App: React.FC = () => {
  const [uiState, setUiState] = useState(UiState.INPUT_DETAILS_SCREEN);
  const [userName, setUserName] = useState<string>(``);
  const [theatreId, setTheatreId] = useState<string>('PVR');
  const [theatre, setTheatre] = useState<Seat[][]>([]);

  if (uiState === UiState.SEAT_MAP_SCREEN)
    return (<SeatMap theater={
      {
        id: theatreId,
        name: '',
        seatArrangement: theatre,
      }
    } userId={userName} />);

  const submitData = () => {
    if(userName && userName.length > 0) {
    fetch(`http://localhost:5000/read/${theatreId}`)
    .then(res => res.json())
    .then((res: Seat[]) => {
      const seatMap: Seat[][] = [];
      let index = 0;
      res.sort((a, b) => a.rowID < b.rowID ? -1 : 1)
      res.sort((a, b) => (a.rowID == b.rowID 
        && Number.parseInt(a.columnID) < Number.parseInt(b.columnID) ? -1 : 1));

      res.forEach((seat, i) => {
        if (i == 0)
          seatMap.push([seat]);
        else if (seat.rowID === res[i-1].rowID || seat.rowID === 'NA')
          seatMap[index].push(seat);
        else {
          index++;
          seatMap[index] = [];
          seatMap[index].push(seat);
        }
      });
      console.log(seatMap)
      setTheatre(seatMap);
      setUiState(UiState.SEAT_MAP_SCREEN)
    })
    .catch(e => {
      console.log(e);
    })
  }
  else{
    alert("Please enter user name !!");
    return;
  }
  }

  return <>
    <h3 style={myStyles}>  Welcome To Movie Ticket Booking Website </h3>
    <div style={inputStyles}>
    <label> User Name </label>
    <input style={styles} type='text' onChange={(e) => setUserName(e.target.value)}/>
    <br></br>
    <label> Select Theatre </label>
    <select style={styles} name='theatreId' onChange={(e) => setTheatreId(e.target.value)}>
       <option value="PVR">PVR</option>
       <option value="INOX">INOX</option>
       <option value="Cinepolis">Cinepolis</option>
       <option value="Ariesplex">Ariesplex</option>
    </select>
    <br></br>
    <br></br>
    <button style={buttonStyle} onClick={submitData}> Select Seats </button>
    </div>
  </>;

}

export default App;
