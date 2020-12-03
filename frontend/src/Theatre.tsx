import { Box, Grid } from '@material-ui/core';
import React from 'react';
import { Seat, SeatStatus, Theater } from './models/theatre';
import style from './style';

interface State {
    currentTheatre: Theater;
    uiState: UiState;
}

interface Prop {
    userId: string;
    theater: Theater;
}

enum UiState {
    SEAT_MAP_SCREEN,
    BOOKING_AND_PAYMENT_SCREEN,
    PAYMENT_PAGE,
  }
 
const divStyles = {
    border: "3px solid #f1f1f1",
  padding: "16px",
  "text-align": "center",
} as React.CSSProperties;
const divStylesf = {
    border: "3px solid #f1f1f1",
  padding: "16px",
  color:"blue",
  "font-size":"200%",
  "text-align": "center",
} as React.CSSProperties;
  const styles = {
      "text-align": "center",
      "font-size":"200%",
  } as React.CSSProperties;

  const myStyles = {
    color:"blue",
    "font-size":"200%",
    "text-align":"center",
  } as React.CSSProperties;
  const buttonStyle = {
    "background-color": "#4CAF50",
    color: "white",
    padding: "14px 20px",
    margin: "8px 0",
    border: "none",
    cursor: "pointer",
    width: "20%",
    align: "center",
    opacity: "0.8",
  }  as React.CSSProperties;
class SeatMap extends React.Component<Prop, State> {
    
    constructor(prop: Prop) {
        super(prop);
        this.state = {
            currentTheatre: this.props.theater,
            uiState: UiState.SEAT_MAP_SCREEN,
        }
    }

    seatClickHandler = (e: any) => {
        const rowId = e.target.id.split('-')[0];
        const colId = e.target.id.split('-')[1];
        const newData = this.state.currentTheatre;
        newData.seatArrangement.forEach(seatRow =>
            seatRow.forEach(seat => {
                if (seat.rowID === rowId && seat.columnID === colId)
                    seat.status = seat.status !== SeatStatus.Selected ? SeatStatus.Selected : SeatStatus.Available;
            }));

        console.log(newData);
        this.setState({ currentTheatre: newData });
    };
    
     selectedSeats: Seat[] = [];
     seatUnitPrice = 100;

    bookSeats = () => {
        this.state.currentTheatre.seatArrangement.forEach(seatRow =>
            seatRow.forEach(seat => {
                if(seat.status === SeatStatus.Selected) {
                    this.selectedSeats.push(seat);
                }
            }));
        fetch(`http://localhost:5000/update`,
        {
            method:'POST',
            body:JSON.stringify({
                theatreID: this.state.currentTheatre.id,
                BookedBy: this.props.userId,
                seats: this.selectedSeats
            }),
            headers:{
                "Content-type":"application/json; charset=UTF-8"
            }
        })
        .then(res => res.json())
        .then(json => this.setState({ uiState: UiState.BOOKING_AND_PAYMENT_SCREEN }))
        .catch(e => {
            console.log(e);
        })
    }
    
    confirmBooking = () => {
        var r = confirm(" Are You Sure You Want to Book Seats ");
        if(r == true){
           this.bookSeats();
        }
        else{
            return;
        }
    }

    PostBookingUi = () => {
        var paymentAmount;
        paymentAmount = (this.selectedSeats.length)*(this.seatUnitPrice);
        if(paymentAmount == 0) {
            return <div>
                <h1> You Have Not Booked Any Seats , Thank You </h1>
            </div>
        }
        else {
            return <div style={divStyles}>
            <h2 style={myStyles}> Payment Details </h2>
            <h2> Booked Seats {this.selectedSeats.map(seat => `${seat.rowID} - ${seat.columnID} | `)}</h2>
            <h2> Total Amount is {paymentAmount}</h2>
            <button style={buttonStyle} onClick={this.successMessage}> Pay {paymentAmount}</button>
            </div>
        }
    }
    
    successMessage = () => {
        this.setState({uiState: UiState.PAYMENT_PAGE})
    }
    
    Fun = () => {
        return <div style={divStylesf}>
            Seats Booked Successfully Thank You for Booking !!!!
        </div>
    }
    render() {
        const { currentTheatre } = this.state;

        if (this.state.uiState === UiState.BOOKING_AND_PAYMENT_SCREEN)
            return <this.PostBookingUi />;

        if (this.state.uiState === UiState.PAYMENT_PAGE) 
            return <this.Fun />;

        return <>
            <h3 style={styles}> Welcome {this.props.userId} ,Please Select Your Seats</h3>
            {currentTheatre.seatArrangement.map(seatRow => {
                return <>
                    <Grid container
                        direction="row"
                        justify="center"
                        alignItems="center">
                        <h3>{seatRow.find(seat => seat.rowID !== 'NA')?.rowID}</h3>
                        {seatRow.map(seat => {
                            return <>
                                <SeatUi seat={seat} clickHandler={this.seatClickHandler} />
                            </>
                        })}
                    </Grid>
                </>;
            })}
            <button style={buttonStyle}onClick={this.confirmBooking}> Book and Pay </button>
        </>
    }
}

interface SeatProp {
    seat: Seat,
    clickHandler: (e: any) => void;
}
function SeatUi({ seat, clickHandler }: SeatProp) {

    switch (seat.status) {
        case SeatStatus.Available:
            return <Box onClick={clickHandler}
                id={`${seat.rowID}-${seat.columnID}`} margin='7px' width='50px' height='30px' style={style.availableSeat}>
                {seat.columnID} <br />
            </Box>;
        case SeatStatus.Booked:
            return <Box id={`${seat.rowID}-${seat.columnID}`} margin='7px' width='50px' height='30px' style={style.bookedSeat}>
                {seat.columnID} <br />
            </Box>;

        case SeatStatus.Selected:
            return <Box id={`${seat.rowID}-${seat.columnID}`} onClick={clickHandler} margin='7px' width='50px' height='30px' style={style.selectedSeat}>
                {seat.columnID} <br />
            </Box>;

        case SeatStatus.EmptySpot:
            return <Box id={`${seat.rowID}-${seat.columnID}`} margin='7px' width='50px' height='30px'>
            </Box>;

        default:
            // TODO: throw?
            return <></>;
    }
}



export default SeatMap;