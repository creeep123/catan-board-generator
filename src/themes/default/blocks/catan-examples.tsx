'use client';

import { useEffect, useState } from 'react';

interface ExampleBoard {
  id: string;
  board_type: 'classic' | 'expansion';
  title: string;
  description: string;
  board_config: {
    tiles_per_row: number[];
    center_row: number;
    mode: 'normal' | 'expanded';
  };
  rules_config: {
    adjacent_6_8: boolean;
    adjacent_2_12: boolean;
    same_numbers_touch: boolean;
    same_resource_touch: boolean;
  };
  is_featured: boolean;
  display_order: number;
}

const SUPABASE_URL = 'https://roruthlntnpjtfardmte.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvcnV0aGxudG5wanRmYXJkbXRlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjU0OTY3OCwiZXhwIjoyMDg4MTI1Njc4fQ.g2N4GYhKlbjDtTxkVwuNO2Q1rPWD0ui6GnCmrS66LRw';

export function CatanExamples({ section }: { section: any }) {
  const [boards, setBoards] = useState<ExampleBoard[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBoard, setSelectedBoard] = useState<ExampleBoard | null>(null);

  useEffect(() => {
    async function fetchBoards() {
      try {
        const response = await fetch(
          `${SUPABASE_URL}/rest/v1/catan_board_examples?select=*&order=display_order`,
          {
            headers: {
              'apikey': SUPABASE_KEY,
              'Authorization': `Bearer ${SUPABASE_KEY}`
            }
          }
        );

        if (response.ok) {
          const data = await response.json();
          setBoards(data);
        } else {
          console.error('Failed to fetch boards:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching boards:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBoards();
  }, []);

  const classicBoards = boards.filter(b => b.board_type === 'classic');
  const expansionBoards = boards.filter(b => b.board_type === 'expansion');

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-orange-50 to-amber-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-amber-900 mb-4">
            示例棋盘配置
          </h2>
          <p className="text-amber-700 text-lg">
            点击查看详细配置，或使用这些预设生成类似棋盘
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            <p className="mt-4 text-amber-700">加载示例中...</p>
          </div>
        ) : (
          <>
            {/* Classic Boards */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-amber-800 mb-6 flex items-center gap-2">
                <span className="bg-amber-600 text-white px-3 py-1 rounded-lg text-sm">
                  3-4人
                </span>
                经典版配置
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classicBoards.map(board => (
                  <BoardCard
                    key={board.id}
                    board={board}
                    onClick={() => setSelectedBoard(board)}
                  />
                ))}
              </div>
            </div>

            {/* Expansion Boards */}
            <div>
              <h3 className="text-2xl font-bold text-amber-800 mb-6 flex items-center gap-2">
                <span className="bg-orange-600 text-white px-3 py-1 rounded-lg text-sm">
                  5-6人
                </span>
                扩展版配置
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {expansionBoards.map(board => (
                  <BoardCard
                    key={board.id}
                    board={board}
                    onClick={() => setSelectedBoard(board)}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {/* Detail Modal */}
        {selectedBoard && (
          <BoardDetailModal
            board={selectedBoard}
            onClose={() => setSelectedBoard(null)}
          />
        )}
      </div>
    </section>
  );
}

function BoardCard({ board, onClick }: { board: ExampleBoard; onClick: () => void }) {
  const ruleLabels = {
    adjacent_6_8: '6和8可相邻',
    adjacent_2_12: '2和12可相邻',
    same_numbers_touch: '相同数字可相邻',
    same_resource_touch: '相同资源可相邻'
  };

  const activeRules = Object.entries(board.rules_config)
    .filter(([_, value]) => value)
    .map(([key]) => ruleLabels[key as keyof typeof ruleLabels]);

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition-all hover:scale-105 hover:shadow-xl"
    >
      {/* Preview Image Placeholder */}
      <div className="h-48 bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-2">
            {board.board_type === 'classic' ? '🎲' : '🎲🎲'}
          </div>
          <p className="text-amber-700 font-medium">
            {board.board_type === 'classic' ? '经典版' : '扩展版'}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h4 className="text-xl font-bold text-gray-900 mb-2">
          {board.title}
        </h4>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {board.description}
        </p>

        {/* Rules */}
        <div className="flex flex-wrap gap-2">
          {activeRules.slice(0, 2).map(rule => (
            <span
              key={rule}
              className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full"
            >
              {rule}
            </span>
          ))}
          {activeRules.length > 2 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{activeRules.length - 2} 更多
            </span>
          )}
        </div>

        {/* Featured Badge */}
        {board.is_featured && (
          <div className="mt-4">
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-500 text-white text-xs rounded-full">
              ⭐ 精选
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function BoardDetailModal({ board, onClose }: { board: ExampleBoard; onClose: () => void }) {
  const ruleLabels = {
    adjacent_6_8: '6和8可相邻',
    adjacent_2_12: '2和12可相邻',
    same_numbers_touch: '相同数字可相邻',
    same_resource_touch: '相同资源可相邻'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h3 className="text-2xl font-bold text-gray-900">{board.title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Description */}
          <p className="text-gray-600 mb-6">{board.description}</p>

          {/* Board Info */}
          <div className="mb-6">
            <h4 className="font-bold text-gray-900 mb-3">棋盘信息</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">类型：</span>
                <span className="font-medium">
                  {board.board_type === 'classic' ? '经典版 (3-4人)' : '扩展版 (5-6人)'}
                </span>
              </div>
              <div>
                <span className="text-gray-500">模式：</span>
                <span className="font-medium">
                  {board.board_config.mode === 'normal' ? '标准' : '扩展'}
                </span>
              </div>
            </div>
          </div>

          {/* Rules */}
          <div className="mb-6">
            <h4 className="font-bold text-gray-900 mb-3">生成规则</h4>
            <div className="space-y-2">
              {Object.entries(board.rules_config).map(([key, value]) => (
                <div
                  key={key}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                    value
                      ? 'bg-green-50 text-green-800'
                      : 'bg-gray-50 text-gray-600'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${
                    value ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                  <span className="text-sm">
                    {ruleLabels[key as keyof typeof ruleLabels]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Board Config */}
          <div className="mb-6">
            <h4 className="font-bold text-gray-900 mb-3">布局配置</h4>
            <div className="bg-gray-50 rounded-lg p-4 text-sm">
              <div className="mb-2">
                <span className="text-gray-500">每行方块数：</span>
                <span className="font-mono">
                  [{board.board_config.tiles_per_row.join(', ')}]
                </span>
              </div>
              <div>
                <span className="text-gray-500">中心行：</span>
                <span className="font-medium">{board.board_config.center_row}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                // Scroll to generator and apply config
                const generator = document.querySelector('[data-catan-generator]');
                if (generator) {
                  generator.scrollIntoView({ behavior: 'smooth' });
                }
                onClose();
              }}
              className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors"
            >
              使用此配置生成
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
