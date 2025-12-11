import React from 'react';
import { Node } from '../lib/grid';
import {Home, User, TreeDeciduous} from 'lucide-react';

interface GridProps {
  grid: Node[][];
  currentPos: { x: number; y: number } | null;
  onCellClick?: (x: number, y: number) => void;
  editMode?: 'wall' | 'start' | 'end' | null;
}

const Grid: React.FC<GridProps> = ({ grid, currentPos, onCellClick, editMode }) => {
  return (
    <div className="grid gap-[1px] bg-slate-800/50 p-1 rounded-lg shadow-2xl border border-slate-700 backdrop-blur-sm">
      {grid.map((row, y) => (
        <div key={y} className="flex gap-[1px]">
          {row.map((node, x) => {
            const isCurrent = currentPos?.x === x && currentPos?.y === y;
            
            let bgColor = 'bg-slate-900/70';
            if (node.isWall) bgColor = 'bg-emerald-900/80';
            else if (node.isPath) bgColor = 'bg-blue-500/40';
            else if (node.visited) bgColor = 'bg-indigo-900/50';

            return (
              <div
                key={`${x}-${y}`}
                onClick={() => onCellClick?.(x, y)}
                className={`
                  w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center
                  transition-all duration-200 rounded-sm
                  ${bgColor}
                  ${isCurrent ? 'ring-2 ring-yellow-400 z-10' : ''}
                  ${onCellClick ? 'cursor-pointer hover:brightness-125' : ''}
                  ${editMode === 'wall' && !node.isStart && !node.isEnd ? 'hover:ring-2 hover:ring-emerald-400' : ''}
                  ${editMode === 'start' && !node.isWall && !node.isEnd ? 'hover:ring-2 hover:ring-green-400' : ''}
                  ${editMode === 'end' && !node.isWall && !node.isStart ? 'hover:ring-2 hover:ring-orange-400' : ''}
                `}
              >
                {node.isStart && !isCurrent && <User className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />}
                {node.isEnd && <Home className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />}
                {node.isWall && <TreeDeciduous className="w-3 h-3 sm:w-4 sm:h-4 text-slate-500 opacity-50" />}
                {isCurrent && <User className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-yellow-400/20" />}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Grid;
