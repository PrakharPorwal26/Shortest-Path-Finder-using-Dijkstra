import React, {Component} from 'react';
import logo from 'D:/Projects/Shortest Path Finder/src/PathfindingVisualizer/new-logo.png';
import Node from 'D:/Projects/Shortest Path Finder/src/PathfindingVisualizer/Node/Node';
import {dijkstra, getNodesInShortestPathOrder} from '../algorithms/dijkstra';

import './PathfindingVisualizer.css';

//Position of the starting node
const START_NODE_ROW = 10;
const START_NODE_COL = 15;

//Position of the ending node
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

export default class PathfindingVisualizer extends Component {
  constructor() {
    // sets the initial state for the component with an empty grid array and a mouseIsPressed boolean value set to false
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
    };
  }

  // used to initialize the grid state in the PathfindingVisualizer component with the initial grid of nodes required for pathfinding visualization.
  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({grid});
  }

  //The purpose of this function is to handle user interactions for drawing walls on the grid. When the user clicks on a node (specified by its row and col coordinates), the function updates the grid by toggling the wall status of that node. The mouseIsPressed state is set to true, indicating that the mouse button is currently pressed and being used for drawing walls.
  handleMouseDown(row, col) {
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid, mouseIsPressed: true});
  }

  // When the user moves the cursor over a node while the mouse button is pressed, the function updates the grid by toggling the wall status of that node. If the mouse button is not pressed (i.e., the user is not actively drawing walls), the function does not perform any action.
  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid});
  }

  //Managing the 'mouseIsPresssed' state
  handleMouseUp() {
    this.setState({mouseIsPressed: false});
  }

  //This function is responsible for visually animating the process of Dijkstra's algorithm by showing the order in which nodes are visited and highlighting the shortest path once the algorithm is complete.
  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 10 * i);
    }
  }

  //This function is responsible for visually animating the shortest path found by Dijkstra's algorithm
  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 50 * i);
    }
  }

  visualizeDijkstra() {
    const {grid} = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];//extract start node
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];//extract finish node
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);//execute dijkstra's algo, returns visited nodes in order
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);//returns shortest path
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);//animate dijkstra
  }

  // Sets up the layout and appearance of the pathfinding visualizer application. It renders a logo, a button for visualizing Dijkstra's algorithm, and the grid with individual nodes using the Node component. The actual visualization and interaction logic are handled by the Node component and the functions called from the button's onClick event. 
  render() {
    const {grid, mouseIsPressed} = this.state;

    return (
      <>
      <div className="logo" style={{paddingBottom:"50px",paddingTop:"20px"}}>
          <img src={logo} width="200" height="100" />
        </div>
        <button onClick={() => this.visualizeDijkstra()}
        style={{cursor:"pointer",paddingTop:"5px",paddingBottom:"5px"}}>
          Visualize Dijkstra's Algorithm
        </button>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                
                {row.map((node, nodeIdx) => {
                  const {row, col, isFinish, isStart, isWall} = node;
                  return (

                    
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}></Node>
                      
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

//responsible for generating the initial grid of nodes
const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

//used to create node objects with specific properties
const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();//create a copy of original grid
  const node = newGrid[row][col];//access the target node
  const newNode = {
    ...node,
    isWall: !node.isWall,//if already walled, un-wall it, else creates a wall
  };
  newGrid[row][col] = newNode;//update the new grid with the new node
  return newGrid;//returns the new grid
};