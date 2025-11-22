export type Point = {
  x: number;
  y: number;
};

export type Node = Point & {
  isWall: boolean;
  isStart: boolean;
  isEnd: boolean;
  visited: boolean;
  isPath: boolean;
  distanceToGoal: number;
};

// Calculate Euclidean distance
export const getDistance = (a: Point, b: Point): number => {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
};

export const GRID_SIZE = 25;

export const createInitialGrid = (): Node[][] => {
  const grid: Node[][] = [];
  for (let y = 0; y < GRID_SIZE; y++) {
    const row: Node[] = [];
    for (let x = 0; x < GRID_SIZE; x++) {
      row.push({
        x,
        y,
        isWall: false,
        isStart: false,
        isEnd: false,
        visited: false,
        isPath: false,
        distanceToGoal: 0,
      });
    }
    grid.push(row);
  }
  return grid;
};

export const getNeighbors = (node: Node, grid: Node[][]): Node[] => {
  const neighbors: Node[] = [];
  const directions = [
    { x: 0, y: -1 }, // Up
    { x: 1, y: 0 },  // Right
    { x: 0, y: 1 },  // Down
    { x: -1, y: 0 }, // Left
  ];

  for (const dir of directions) {
    const newX = node.x + dir.x;
    const newY = node.y + dir.y;

    if (newX >= 0 && newX < GRID_SIZE && newY >= 0 && newY < GRID_SIZE) {
      const neighbor = grid[newY][newX];
      if (!neighbor.isWall) {
        neighbors.push(neighbor);
      }
    }
  }
  return neighbors;
};
