import React, { useState, useEffect, useRef } from 'react';
import {Play, RotateCcw, Shuffle, AlertCircle, CheckCircle2, Info} from 'lucide-react';
import { GRID_SIZE, createInitialGrid, getDistance, getNeighbors, Node, Point } from './lib/grid';
import Grid from './components/GameGrid';
import { Toaster, toast } from 'react-hot-toast';

function App() {
  // Khai báo các trạng thái (State) của ứng dụng
  const [grid, setGrid] = useState<Node[][]>([]);
  const [startPos, setStartPos] = useState<Point>({ x: 1, y: 1 });
  const [endPos, setEndPos] = useState<Point>({ x: 23, y: 23 });
  const [currentPos, setCurrentPos] = useState<Point | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'stuck'>('idle');
  const [steps, setSteps] = useState(0);
  const [path, setPath] = useState<Point[]>([]);
  const speedRef = useRef(200);

  // Khởi tạo Lưới (Chỉ chạy một lần khi component được tải)
  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = (generateWalls = true) => {
    // Đặt lại các trạng thái ban đầu
    setIsRunning(false);
    setStatus('idle');
    setSteps(0);
    setPath([]);
    setCurrentPos({ ...startPos });

    const newGrid = createInitialGrid();
    
    // Đánh dấu vị trí Bắt đầu và Kết thúc
    newGrid[startPos.y][startPos.x].isStart = true;
    newGrid[endPos.y][endPos.x].isEnd = true;

    // Generate Random Walls nếu cần
    if (generateWalls) {
      for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
          if ((x !== startPos.x || y !== startPos.y) && (x !== endPos.x || y !== endPos.y)) {
            if (Math.random() < 0.1) { // 10% tỉ lệ sinh ra tưởng
              newGrid[y][x].isWall = true;
            }
          }
        }
      }
    }

    setGrid(newGrid);
  };

  const runHillClimbing = async () => {
    if (isRunning || status === 'success') return;
    
    setIsRunning(true);
    setStatus('running');
    let current = currentPos || startPos;
    let pathHistory = [...path];
    
    // Vòng lặp Thuật toán Leo đồi (Hill Climbing Loop)
    const interval = setInterval(() => {
      setSteps(prev => prev + 1);
      
      // Đánh dấu ô hiện tại là đã ghé thăm và là đường đi
      setGrid(prev => {
        const newGrid = [...prev];
        newGrid[current.y][current.x].visited = true;
        newGrid[current.y][current.x].isPath = true;
        return newGrid;
      });

      // Kiểm tra xem đã đạt đến mục tiêu chưa
      if (current.x === endPos.x && current.y === endPos.y) {
        clearInterval(interval);
        setIsRunning(false);
        setStatus('success');
        toast.success('Welcome Home!', { icon: '🏠' });
        return;
      }

      // Lấy các ô lân cận hợp lệ (không phải tường)
      const neighbors = getNeighbors(grid[current.y][current.x], grid);
      
      if (neighbors.length === 0) {
        // Nếu không có nước đi nào khả dụng
        clearInterval(interval);
        setIsRunning(false);
        setStatus('stuck');
        toast.error('No moves available!');
        return;
      }

      // Tính toán Heuristic (khoảng cách đến mục tiêu) cho tất cả các hàng xóm hợp lệ
      // Hill Climbing: Di chuyển đến hàng xóm có khoảng cách đến mục tiêu THẤP NHẤT
      let bestNeighbor: Node | null = null;
      let minDistance = getDistance(current, endPos); // Khoảng cách hiện tại
      let bestCandidates: Node[] = [];
      let bestDist = Infinity;
      // Tìm kiếm "đỉnh dốc" tốt nhất (tức là giảm khoảng cách nhanh nhất)
      neighbors.forEach(n => {
        const dist = getDistance(n, endPos);
        if (dist < bestDist) { 
          // Nếu tìm thấy hàng xóm tốt hơn
          bestDist = dist;
          bestCandidates = [n];
        } else if (dist === bestDist) {
          // Nếu bằng khoảng cách tốt nhất
          bestCandidates.push(n);
        }
      });

      // Kiểm tra Điểm cực trị cục bộ (Local Optima)
      // Nếu khoảng cách của hàng xóm tốt nhất KHÔNG tốt hơn vị trí hiện tại -> Mắc kẹt
      const currentDist = getDistance(current, endPos);
      
      if (bestDist >= currentDist) {
        // Đã mắc kẹt trong một cực trị cục bộ! (Hạn chế của Hill Climbing)
        clearInterval(interval);
        setIsRunning(false);
        setStatus('stuck');
        toast.error('Đã mắc kẹt trong một cực trị cục bộ! (Hạn chế của Hill Climbing))');
        return;
      }

      // Di chuyển đến hàng xóm tốt nhất
      if (bestCandidates.length > 0) {
        // Chọn ngẫu nhiên nếu có nhiều hơn một ứng cử viên tốt nhất có khoảng cách bằng nhau
        bestNeighbor = bestCandidates[Math.floor(Math.random() * bestCandidates.length)];
        current = { x: bestNeighbor.x, y: bestNeighbor.y };
        setCurrentPos(current);
        pathHistory.push(current);
        setPath(pathHistory);
      } else {
        clearInterval(interval);
        setIsRunning(false);
        setStatus('stuck');
      }

    }, speedRef.current);

    // Dọn dẹp (Cleanup): Dừng Interval khi component bị hủy
    return () => clearInterval(interval);
  };

  return (
    <div className="min-h-screen bg-[#0B0919] text-white font-sans relative overflow-hidden flex flex-col items-center justify-center p-4">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
        <img 
          src="/image/BG.jpg" 
          alt="Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0919] via-transparent to-[#0B0919]/80"></div>
      </div>

      <div className="z-10 w-full max-w-5xl flex flex-col lg:flex-row gap-8 items-center lg:items-start justify-center">
        
        {/* Left Panel: Controls & Info */}
        <div className="w-full lg:w-80 flex flex-col gap-6 bg-slate-900/80 p-6 rounded-2xl border border-slate-700 backdrop-blur-md shadow-xl">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
              Tìm Đường Về Nhà
            </h1>
            <p className="text-slate-400 text-sm">
              Trực quan hóa thuật toán tìm đường trong TTNT <br/>
              <span className="text-yellow-400 font-semibold">Sử dụng thuật toán leo đồi (Hill Climbing Algorithm)</span>
            </p>
          </div>

          {/* Stats */}
          <div className="space-y-4 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Steps</span>
              <span className="text-2xl font-mono font-bold text-blue-400">{steps}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Distance</span>
              <span className="text-xl font-mono text-purple-400">
                {currentPos ? getDistance(currentPos, endPos).toFixed(1) : getDistance(startPos, endPos).toFixed(1)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Status</span>
              <span className={`font-bold flex items-center gap-2 ${
                status === 'success' ? 'text-green-400' : 
                status === 'stuck' ? 'text-red-400' : 
                status === 'running' ? 'text-yellow-400' : 'text-slate-200'
              }`}>
                {status === 'success' && <CheckCircle2 size={16}/>}
                {status === 'stuck' && <AlertCircle size={16}/>}
                {status.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-3">
            <button
              onClick={runHillClimbing}
              disabled={isRunning || status === 'success' || status === 'stuck'}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold shadow-lg shadow-blue-900/20 transition-all active:scale-95"
            >
              <Play size={18} fill="currentColor" />
              Start Journey
            </button>
            
            <div className="flex gap-2">
              <button
                onClick={() => resetGame(false)}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-slate-700 hover:bg-slate-600 rounded-xl font-medium transition-all active:scale-95"
              >
                <RotateCcw size={18} />
                Reset
              </button>
              <button
                onClick={() => resetGame(true)}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-slate-700 hover:bg-slate-600 rounded-xl font-medium transition-all active:scale-95"
              >
                <Shuffle size={18} />
                New Map
              </button>
            </div>
          </div>

          {/* Legend */}
          <div className="text-xs text-slate-500 space-y-2 pt-4 border-t border-slate-800">
            <p className="font-semibold text-slate-400 mb-2">Lưu ý:</p>
            <p className="flex gap-2 items-start">
              <Info size={14} className="mt-0.5 shrink-0" />
              Hill Climbing là một thuật toán tham lam (greedy algorithm). Nó luôn di chuyển đến ô lân cận gần mục tiêu nhất. Thuật toán này có thể bị mắc kẹt tại các "Cực trị cục bộ" (Local Optima) (hay còn gọi là ngõ cụt) nếu chướng ngại vật cản đường đi trực tiếp đến mục tiêu.
            </p>
          </div>
        </div>

        {/* Right Panel: Grid */}
        <div className="relative">
           <Grid grid={grid} currentPos={currentPos || startPos} />
           
           {/* Status Overlay */}
           {status === 'stuck' && (
             <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-lg pointer-events-none animate-in fade-in">
               <div className="bg-red-900/90 border border-red-500/50 p-6 rounded-2xl text-center transform scale-110">
                 <h2 className="text-2xl font-bold text-white mb-1">Stuck!</h2>
                 <p className="text-red-200">Hit a local optimum.</p>
                 <p className="text-sm text-red-300/70 mt-2">Try "New Map" to reshape terrain.</p>
               </div>
             </div>
           )}
        </div>
      </div>
      
      <Toaster position="bottom-center" toastOptions={{
        style: {
          background: '#1e293b',
          color: '#fff',
          border: '1px solid #334155',
        },
      }}/>
    </div>
  );
}

export default App;
