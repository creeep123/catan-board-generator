'use client';

import { useState, useEffect } from 'react';

// Types
type BoardMode = 'normal' | 'expanded';
type ResourceType = 'ore' | 'brick' | 'sheep' | 'wood' | 'wheat' | 'desert';

interface Tile {
  chit: string;
  resource: ResourceType;
  probability: string;
}

interface BoardConfig {
  tiles_per_row: number[];
  center_row: number;
  mode: BoardMode;
}

interface RulesConfig {
  adjacent_6_8: boolean;
  adjacent_2_12: boolean;
  same_numbers_touch: boolean;
  same_resource_touch: boolean;
}

// Constants
const NORMAL_NUM_ARRAY = [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12];
const EXPANDED_NUM_ARRAY = [2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 8, 8, 8, 9, 9, 9, 10, 10, 10, 11, 11, 11, 12, 12];
const NORMAL_RESOURCE_ARRAY: ResourceType[] = ['ore', 'ore', 'ore', 'brick', 'brick', 'brick', 'sheep', 'sheep', 'sheep', 'sheep', 'wood', 'wood', 'wood', 'wood', 'wheat', 'wheat', 'wheat', 'wheat'];
const EXPANDED_RESOURCE_ARRAY: ResourceType[] = ['ore', 'ore', 'ore', 'ore', 'ore', 'brick', 'brick', 'brick', 'brick', 'brick', 'sheep', 'sheep', 'sheep', 'sheep', 'sheep', 'sheep', 'wood', 'wood', 'wood', 'wood', 'wood', 'wood', 'wheat', 'wheat', 'wheat', 'wheat', 'wheat', 'wheat'];

const PROB_DOTS: Record<number, string> = {
  2: '.', 3: '..', 4: '...', 5: '....', 6: '.....',
  8: '.....', 9: '....', 10: '...', 11: '..', 12: '.'
};

const RESOURCE_COLORS: Record<ResourceType, string> = {
  ore: '#8B7355',
  brick: '#CD853F',
  sheep: '#90EE90',
  wood: '#228B22',
  wheat: '#F0E68C',
  desert: '#F4A460'
};

const RESOURCE_NAMES: Record<ResourceType, string> = {
  ore: '矿石',
  brick: '砖块',
  sheep: '羊毛',
  wood: '木材',
  wheat: '小麦',
  desert: '沙漠'
};

// Helper functions
function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function getAdjacencyList(mode: BoardMode): number[][] {
  if (mode === 'normal') {
    return [
      [1, 3, 4], [0, 2, 4, 5], [1, 5, 6],
      [0, 4, 7, 8], [0, 1, 3, 5, 8, 9], [1, 2, 4, 6, 9, 10], [2, 5, 10, 11],
      [3, 8, 12], [3, 4, 7, 9, 12, 13], [4, 5, 8, 10, 13, 14], [5, 6, 9, 11, 14, 15], [6, 10, 15],
      [7, 8, 13, 16], [8, 9, 12, 14, 16, 17], [9, 10, 13, 15, 17, 18], [10, 11, 14, 18],
      [12, 13, 17], [13, 14, 16, 18], [14, 15, 17]
    ];
  } else {
    return [
      [1, 2, 4], [3, 4, 7], [4, 5, 8],
      [6, 7, 10], [7, 8, 11], [8, 9, 12],
      [3, 10, 13], [1, 3, 4, 10, 11, 14], [2, 4, 5, 11, 12, 15], [5, 12, 16],
      [3, 6, 7, 13, 14, 17], [4, 7, 8, 14, 15, 18], [5, 8, 9, 15, 16, 19],
      [6, 10, 17, 20], [7, 10, 11, 17, 18, 21], [8, 11, 12, 18, 19, 22], [9, 12, 16, 19, 23],
      [10, 13, 14, 20, 21, 24], [11, 14, 15, 21, 22, 25], [12, 15, 16, 22, 23, 26],
      [13, 17, 24], [14, 17, 18, 24, 25, 27], [15, 18, 19, 25, 26, 28], [16, 19, 23, 26],
      [17, 20, 21, 27], [18, 21, 22, 27, 28, 29], [19, 22, 23, 26, 28],
      [21, 24, 25, 29], [22, 25, 26, 29], [25, 27, 28]
    ];
  }
}

function getTileOffsets(mode: BoardMode): string[] {
  const size = 17.5;
  const s = 0.866 * size;
  const r = size;

  const tiles_per_row = mode === 'normal' ? [3, 4, 5, 4, 3] : [1, 2, 3, 4, 3, 4, 3, 4, 3, 2, 1];
  const center_row = Math.floor(tiles_per_row.length / 2);
  const row_step = mode === 'normal' ? 0.73 * r : s / 1.99;
  const cell_step = mode === 'normal' ? 0.99 * s : 1.51 * r * 0.99;

  const offsets: string[] = [];

  for (let row = 0; row < tiles_per_row.length; row++) {
    const row_level = row - center_row;
    const y_coordinate = 50 + row_level * row_step;
    const x_is_even_shift = row % 2 * cell_step / 2;
    const x_first_cell_shift = Math.floor(tiles_per_row[row] / 2) * cell_step;

    for (let col = 0; col < tiles_per_row[row]; col++) {
      const x_coordinate = 50 - x_first_cell_shift + x_is_even_shift + col * cell_step;
      offsets.push(`left:${x_coordinate.toFixed(2)}%;top:${y_coordinate.toFixed(2)}%`);
    }
  }

  return offsets;
}

function passedAdjacencyTest(tiles: Tile[], num1: number, num2: number, adjacencyList: number[][]): boolean {
  for (const [idx, tile] of tiles.entries()) {
    if (tile.chit === String(num1) || tile.chit === String(num2)) {
      for (const adjIdx of adjacencyList[idx]) {
        const adjTile = tiles[adjIdx];
        if (adjTile && (adjTile.chit === String(num1) || adjTile.chit === String(num2))) {
          return false;
        }
      }
    }
  }
  return true;
}

function passedResourceCheck(tiles: Tile[], maxAdjacent: number, adjacencyList: number[][]): boolean {
  for (const [idx, tile] of tiles.entries()) {
    if (tile.resource === 'desert') continue;

    let count = 1;
    for (const adjIdx of adjacencyList[idx]) {
      const adjTile = tiles[adjIdx];
      if (adjTile && adjTile.resource === tile.resource) {
        count++;
      }
    }
    if (count > maxAdjacent) return false;
  }
  return true;
}

function generateValidBoard(mode: BoardMode, rules: RulesConfig): Tile[] {
  const adjacencyList = getAdjacencyList(mode);
  const numArray = mode === 'normal' ? NORMAL_NUM_ARRAY : EXPANDED_NUM_ARRAY;
  const resourceArray = mode === 'normal' ? NORMAL_RESOURCE_ARRAY : EXPANDED_RESOURCE_ARRAY;

  let attempts = 0;
  const maxAttempts = 10000;

  while (attempts < maxAttempts) {
    attempts++;

    const shuffledNums = shuffle(numArray);
    const shuffledResources = shuffle(resourceArray);

    const tiles: Tile[] = shuffledNums.map((chit, i) => ({
      chit: String(chit),
      resource: shuffledResources[i],
      probability: PROB_DOTS[chit] || ''
    }));

    // Add desert tiles
    tiles.push({ chit: '', resource: 'desert', probability: '' });
    if (mode === 'expanded') {
      tiles.push({ chit: '', resource: 'desert', probability: '' });
    }

    // Validate rules
    let valid = true;

    // Check resource adjacency
    const maxAdjacent = rules.same_resource_touch ? 99 : (mode === 'normal' ? 2 : 1);
    if (!passedResourceCheck(tiles, maxAdjacent, adjacencyList)) {
      valid = false;
    }

    // Check 6 and 8 adjacency
    if (!rules.adjacent_6_8 && !passedAdjacencyTest(tiles, 6, 8, adjacencyList)) {
      valid = false;
    }

    // Check 2 and 12 adjacency
    if (!rules.adjacent_2_12 && !passedAdjacencyTest(tiles, 2, 12, adjacencyList)) {
      valid = false;
    }

    // Check same numbers touching
    if (!rules.same_numbers_touch) {
      for (const num of [3, 4, 5, 9, 10, 11]) {
        if (!passedAdjacencyTest(tiles, num, num, adjacencyList)) {
          valid = false;
          break;
        }
      }
    }

    if (valid) {
      console.log(`Generated valid board in ${attempts} attempts`);
      return tiles;
    }
  }

  console.warn('Could not generate valid board after max attempts, returning last attempt');
  const lastTiles: Tile[] = shuffle(numArray).map((chit, i) => ({
    chit: String(chit),
    resource: shuffle(resourceArray)[i],
    probability: PROB_DOTS[chit] || ''
  }));
  lastTiles.push({ chit: '', resource: 'desert', probability: '' });
  if (mode === 'expanded') {
    lastTiles.push({ chit: '', resource: 'desert', probability: '' });
  }
  return lastTiles;
}

export function CatanGenerator({ section }: { section: any }) {
  const [mode, setMode] = useState<BoardMode>('normal');
  const [rules, setRules] = useState<RulesConfig>({
    adjacent_6_8: false,
    adjacent_2_12: true,
    same_numbers_touch: true,
    same_resource_touch: true
  });
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateBoard = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newTiles = generateValidBoard(mode, rules);
      setTiles(newTiles);
      setIsGenerating(false);
    }, 100);
  };

  useEffect(() => {
    generateBoard();
  }, [mode, rules]);

  const tileOffsets = getTileOffsets(mode);
  const isExpanded = mode === 'expanded';

  return (
    <section className="py-12 px-4 bg-gradient-to-b from-amber-50 to-orange-50" data-catan-generator>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-amber-900 mb-4">
            卡坦岛棋盘生成器
          </h2>
          <p className="text-amber-700">
            生成随机的卡坦岛棋盘，支持经典版和扩展版
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Mode Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                棋盘模式
              </label>
              <div className="flex gap-4">
                <button
                  onClick={() => setMode('normal')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    mode === 'normal'
                      ? 'bg-amber-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  经典版 (3-4人)
                </button>
                <button
                  onClick={() => setMode('expanded')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    mode === 'expanded'
                      ? 'bg-amber-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  扩展版 (5-6人)
                </button>
              </div>
            </div>

            {/* Rules */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                生成规则
              </label>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={rules.adjacent_6_8}
                    onChange={(e) => setRules({ ...rules, adjacent_6_8: e.target.checked })}
                    className="rounded"
                  />
                  允许6和8相邻
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={rules.adjacent_2_12}
                    onChange={(e) => setRules({ ...rules, adjacent_2_12: e.target.checked })}
                    className="rounded"
                  />
                  允许2和12相邻
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={rules.same_numbers_touch}
                    onChange={(e) => setRules({ ...rules, same_numbers_touch: e.target.checked })}
                    className="rounded"
                  />
                  允许相同数字相邻
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={rules.same_resource_touch}
                    onChange={(e) => setRules({ ...rules, same_resource_touch: e.target.checked })}
                    className="rounded"
                  />
                  允许相同资源相邻
                </label>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div className="mt-6 text-center">
            <button
              onClick={generateBoard}
              disabled={isGenerating}
              className="px-8 py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {isGenerating ? '生成中...' : '重新生成'}
            </button>
          </div>
        </div>

        {/* Board */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div
            className={`relative mx-auto ${
              isExpanded ? 'w-[800px] h-[700px]' : 'w-[600px] h-[500px]'
            }`}
          >
            {tiles.map((tile, idx) => (
              <div
                key={idx}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  ...(() => {
                    const style = tileOffsets[idx];
                    const leftMatch = style.match(/left:([\d.]+)%/);
                    const topMatch = style.match(/top:([\d.]+)%/);
                    return {
                      left: leftMatch ? leftMatch[1] + '%' : '50%',
                      top: topMatch ? topMatch[1] + '%' : '50%'
                    };
                  })()
                }}
              >
                {/* Hexagon */}
                <div
                  className={`w-16 h-16 flex items-center justify-center relative ${
                    isExpanded ? 'w-14 h-14' : 'w-16 h-16'
                  }`}
                  style={{
                    backgroundColor: RESOURCE_COLORS[tile.resource],
                    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
                  }}
                >
                  {/* Number chit */}
                  {tile.chit && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                          tile.chit === '6' || tile.chit === '8'
                            ? 'bg-red-600 text-white'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {tile.chit}
                      </div>
                    </div>
                  )}

                  {/* Desert indicator */}
                  {tile.resource === 'desert' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl">🏜️</span>
                    </div>
                  )}
                </div>

                {/* Resource label (small) */}
                <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-600 whitespace-nowrap">
                  {RESOURCE_NAMES[tile.resource]}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
            {Object.entries(RESOURCE_COLORS).map(([resource, color]) => (
              <div key={resource} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: color }}
                />
                <span>{RESOURCE_NAMES[resource as ResourceType]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
