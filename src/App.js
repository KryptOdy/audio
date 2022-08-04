
import React from "react";
import * as Tone from 'tone'
import "./App.css"

function App() {

  const CHORD_LENGTH = 8;

  const NOTE_LIST = [
    "C4",
    "D4",
    "E4",
    "F4",
    "G4",
    "A4",
    "B4",
    "C5"
  ] 

  let boardState = [];
  let timer;
  let loop;
  let playing = false;

  const clearBoard = () => {
    boardState = [];

    onStopPlayback();

    let cellList = document.getElementsByClassName("Cell");

    if(cellList.length > 0) {
      for(let i = 0; i < cellList.length; i++) {
        cellList[i].toggleAttribute("clicked", false);
        cellList[i].toggleAttribute("played", false);
      }
    }
  }

  const initBoardState = () => {
    clearBoard();
    
    for (let i = 0; i < CHORD_LENGTH; i++) {
      let newRow = [];

      for (let j = 0; j < CHORD_LENGTH; j++) {
        newRow[j] = false;
      }
      boardState.push(newRow);
    }
  }

  const fillCells = (row) => {
    let notesList = [];

    for(let i = 0; i < CHORD_LENGTH; i++) {
      notesList.push(<Cell note={NOTE_LIST[i]} row={row} column={i}/>)
    }

    return notesList;
  }

  function Cell({note, row, column}) {
    return (
      <div tabIndex={-1} disabled={true} className={"Cell"} row={row} column={column} clicked={false} onMouseDown={(e) => {

        if (boardState[row][column]) {
          boardState[row][column] = false;
        } else {
          boardState[row][column] = note;
        }

        e.currentTarget.toggleAttribute("clicked")

        console.log(boardState)
        let synth = new Tone.Synth().toDestination();
        // synth.triggerAttackRelease(note, "8n", Tone.now());
        Tone.Transport.start();
      }}>{note}</div>
    )
  }
 
  function Column({note, row}){
    console.log(note)
    return (
      <div className="Column">
         {
          fillCells(row)
         }
      </div>
    )
  }

  function Board(){
    return(
      <div className={`Board`} playing={playing}>
         {
        NOTE_LIST.map((note, row) => {
          return (<Column note={note} row={row}/>)
        })
      }
      </div>
    )
  }

  let tickKeeper = {
     ticks: 0,
     resetTicks: function() {
      this.ticks = 0;
     },
     updateTick: function() {
      ++this.ticks;
    }
  }

  function onPlayBack() {

    const synth = new Tone.PolySynth().toDestination();

    if (!playing) {
      playing = true;

      document.querySelectorAll(`.Board`).forEach(e => e.toggleAttribute('playing', true));


      timer = setInterval(() => {
      

        let columnIndex = Math.floor(tickKeeper.ticks % 8);
        console.log(columnIndex);
  
      
        //Clear all cells 
        document.querySelectorAll(`.Cell`).forEach(e => e.toggleAttribute('played', false));
  
        //Highlight cells
        let cellsToHighlight = document.querySelectorAll(`.Cell[row='${columnIndex}'`);
  
        cellsToHighlight.forEach(e => e.toggleAttribute('played'));
  
         let columnCells = []
  
          for(let j = 0; j < CHORD_LENGTH; j++) {
            columnCells.push(boardState[columnIndex][j])
          }
  
          columnCells = columnCells.filter(e => e !== false)
  
          console.log(columnCells);
  
          synth.triggerAttackRelease(columnCells, "8n", Tone.now() + 0.05);
  
        tickKeeper.updateTick();
        // console.log(tickKeeper.ticks);
      }, 500);
    }

    Tone.Transport.start(0 + 0.05);
  }

  function onStopPlayback() {
    if(timer) {
      clearInterval(timer);
      tickKeeper.resetTicks();
      playing = false;
      document.querySelectorAll(`.Board`).forEach(e => e.toggleAttribute('playing', false));
    }
    if(loop) {
      loop.stop();
    }
  }

  function Controls() {
    return (
      <div className="Controls">
          <button onClick={() => onPlayBack()}>Play</button>
          <button onClick={() => onStopPlayback()}>Stop</button>
          <button onClick={() => {initBoardState()}}>Clear</button>
      </div>
    )
  }

  initBoardState();

  return (
    <div className="App">
      <div></div>
      <Board>
      </Board>
      <Controls></Controls>
    </div>
  );
}

export default App;
