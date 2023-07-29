// Performs Dijkstra's algorithm; returns *all* nodes in the order
// in which they were visited. Also makes nodes point back to their
// previous node, effectively allowing us to compute the shortest path
// by backtracking from the finish node.
export function dijkstra(grid, startNode, finishNode) {
    const visitedNodesInOrder = [];
    startNode.distance = 0;
    const unvisitedNodes = getAllNodes(grid); //obtains all the nodes from the grid

    //this loop is to find shortrst path from start node to all other nodes
    while (!!unvisitedNodes.length) {
      sortNodesByDistance(unvisitedNodes);
      const closestNode = unvisitedNodes.shift();//extracts the closest node 
      // If we encounter a wall, we skip it.
      if (closestNode.isWall) continue;
      // If the closest node is at a distance of infinity,
      // we must be trapped and should therefore stop.
      if (closestNode.distance === Infinity) return visitedNodesInOrder;
      closestNode.isVisited = true; //mark closest node as visited
      visitedNodesInOrder.push(closestNode); // add closest node to visitedNodesInOrder
      if (closestNode === finishNode) return visitedNodesInOrder; //algorithm has reached its destination
      updateUnvisitedNeighbors(closestNode, grid);
    }
  }
  
  //sort the unvisitedNodes array based on their distances
  function sortNodesByDistance(unvisitedNodes) {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
  }
  
  // ensures that the distances and paths of unvisited neighbors are updated as the algorithm explores the graph, allowing it to find the shortest path efficiently. 
  function updateUnvisitedNeighbors(node, grid) {
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of unvisitedNeighbors) {
      neighbor.distance = node.distance + 1; //updates distance of the neighbour
      neighbor.previousNode = node;//updates previousNode to current node
    }
  }
  
  //It checks the top, bottom, left, and right neighbors of the node and returns an array containing only the unvisited neighboring nodes.
  function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];//store neighbouring nodes of the given node
    const {col, row} = node;///extracts row and col of the given node
    if (row > 0) neighbors.push(grid[row - 1][col]);//check and add top neighbour
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);//check and add bottom neighbour
    if (col > 0) neighbors.push(grid[row][col - 1]);//check and add left neighbour
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);//check and add right neighbour
    return neighbors.filter(neighbor => !neighbor.isVisited);//filter out neighbors which are unvisited
  }
  
  // function is used to convert 2D grid representation of nodes into a flat array containing all the nodes.
  function getAllNodes(grid) {
    const nodes = [];
    for (const row of grid) {
      for (const node of row) {
        nodes.push(node);
      }
    }
  
  
    
    return nodes;
  }
  
  // Backtracks from the finishNode to find the shortest path.
  // Only works when called *after* the dijkstra method above.
  //Retrieve the nodes in the shortest path from the finishNode to the startNode after the Dijkstra's algorithm has completed its search
  export function getNodesInShortestPathOrder(finishNode) {
    const nodesInShortestPathOrder = [];//store the nodes in the shortest path order from the finish node to the start node.
    let currentNode = finishNode;
    while (currentNode !== null) {
      //During each iteration, the current currentNode is unshifted (added to the front) into the nodesInShortestPathOrder array. Unshifting the nodes ensures that they are added in reverse order, starting from the finishNode and ending with the startNode.
      nodesInShortestPathOrder.unshift(currentNode);
      //update current node for the next iteration
      currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
  }