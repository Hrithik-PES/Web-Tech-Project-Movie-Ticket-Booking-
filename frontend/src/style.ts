import React from 'react';

const availableSeat: React.CSSProperties = {
    backgroundColor: 'white',
    border: '1px solid'
}

const bookedSeat: React.CSSProperties = {
    backgroundColor: 'grey',
    border: '1px solid'
}

const selectedSeat: React.CSSProperties = {
    backgroundColor: 'orange',
    border: '1px solid'
}

const style = {
    availableSeat,
    bookedSeat,
    selectedSeat,
}

export default style;