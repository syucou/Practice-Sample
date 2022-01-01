import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// class Square extends React.Component {
//     render() {
//       return (
//         <button className="square" 
//                 onClick={() => this.props.onClick()}>
//           {this.props.value}
//         </button>
//       );
//     }
//   }

    // Square
    function Square(props){
        return (
            <button className="square" 
            onClick = {() => props.onClick()}>
                {props.value}
            </button>
        );
    }
  
    //Board
  class Board extends React.Component {

    renderSquare(i) {
      return (
            <Square 
                value={this.props.squares[i]}
                onClick = {() => this.props.onClick(i)}/>);
    }
  
    render() {

      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  //Game
  class Game extends React.Component {
      constructor(props) {
          super(props);
          this.state = {
              history: [{
                  squares: Array(9).fill(null),
              }],
              xIsNext: true,
              stepNumber: 0,
              //初期位置はなし
              positions: Array(1).fill(null),
          };
      }

      jumpTo(step){
          this.setState({
              stepNumber: step,
              xIsNext: (step % 2) === 0,
          });
      }

      //iによって場所を計算する　三つの場合に分ける
      getPosition(i){
          if (i <= 2){
              return ([(i % 3 + 1), 1]);
          }
          else if (i > 5){
              return ([(i % 3 + 1), 3]);
          }
          else{
              return ([(i % 3 + 1), 2]);
          }
      }

      handleClick(i){
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        //stepまで位置を全部保存する
        const collect_pos = this.state.positions.slice(0, this.state.stepNumber + 1);
        //現在の座標位置
        const current_pos = this.getPosition(i);
        if (calculateWinner(squares) || squares[i]){
            return;
        }
        squares[i] = this.state.xIsNext ? "X" : "O" ;
        this.setState({
            history: history.concat([
                {
                    squares: squares
                }
            ]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
            //新座標を追加
            positions: collect_pos.concat([current_pos]),
        });
        
    }

    render() {

        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winnner = calculateWinner(current.squares);
        const className = "button";
        const moves = history.map((step, move) => {
            const desc = move ?
                "Go to move #" + move + " (" + this.state.positions[move] + ")"://座標位置をボタンに表示
                "Go to game start!";
                console.log(this.state.positions);
            return (
                <li key={move}> 
                    {/*現在のボタンを太字にする*/}
                    <button className = {this.state.stepNumber === move ? "button-change" : className} onClick={(e) => {
                        this.jumpTo(move);
                    }}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winnner){
            status = "Winner: " + winnner;
        }
        else{
            status = "Next player: " + (this.state.xIsNext ? "X" : "O");
        }

      return (
        <div className="game">
          <div className="game-board">
            <Board 
                squares={current.squares}
                onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }

  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  