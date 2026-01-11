import { useState, useMemo } from 'react';
import { shuffle } from '../utils/util';

// Game data (immutable, defined outside component to avoid recreation)
const GAME_DATA: { [key: string]: string } = {
  India: 'Delhi',
  Russia: 'Moscow',
  USA: 'Washington DC',
  UK: 'London',
  France: 'Paris',
  Germany: 'Berlin',
  Italy: 'Rome',
  Spain: 'Madrid',
  Canada: 'Ottawa',
};

const DisplayList = () => {
  // State: selected items by player, correct matches, remaining items on screen
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [correctMatches, setCorrectMatches] = useState<Set<string>>(new Set());
  const [matchResult, setMatchResult] = useState<
    'correct' | 'incorrect' | null
  >(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Memoize selected items as a Set for O(1) lookup performance
  const selectedItemsSet = useMemo(
    () => new Set(selectedItems),
    [selectedItems]
  );

  // Initialize shuffled items from game data (once on mount)
  const initialItems = useMemo(
    () => shuffle(Object.entries(GAME_DATA).flat()),
    []
  );

  // Compute remaining items (those not in correct matches) — O(n) but memoized
  const remainingItems = useMemo(
    () => initialItems.filter((item) => !correctMatches.has(item)),
    [initialItems, correctMatches]
  );

  // Check if a selection is a valid country-capital pair — O(1) lookup
  const isValidMatch = (first: string, second: string): boolean => {
    return GAME_DATA[first] === second || GAME_DATA[second] === first;
  };

  // Get border class based on item state — inlined for simplicity
  const getItemBorderClass = (item: string): string => {
    if (correctMatches.has(item)) {
      return 'border-[#414141]';
    }
    if (matchResult === 'correct' && selectedItemsSet.has(item)) {
      return 'border-[#66cc99]';
    }
    if (matchResult === 'incorrect' && selectedItemsSet.has(item)) {
      return 'border-red-600';
    }
    if (selectedItemsSet.has(item)) {
      return 'border-blue-600';
    }
    return 'border-[#414141]';
  };

  // Handle item click — normal function instead of useCallback
  const handleItemClick = (item: string) => {
    if (isProcessing || correctMatches.has(item)) return;

    const newSelection = [...selectedItems, item];

    if (newSelection.length === 2) {
      setIsProcessing(true);
      const [first, second] = newSelection;

      if (isValidMatch(first, second)) {
        // Correct match
        setMatchResult('correct');
        setTimeout(() => {
          setCorrectMatches((prev) => new Set([...prev, first, second]));
          setSelectedItems([]);
          setMatchResult(null);
          setIsProcessing(false);
        }, 1000);
      } else {
        // Incorrect match
        setSelectedItems(newSelection);
        setMatchResult('incorrect');
        setTimeout(() => {
          setSelectedItems([]);
          setMatchResult(null);
          setIsProcessing(false);
        }, 1000);
      }
    } else {
      setSelectedItems(newSelection);
    }
  };

  if (remainingItems.length === 0) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-2xl font-bold text-green-600">
          Congratulations! You matched all countries and capitals!
        </h2>
      </div>
    );
  }

  return (
    <div className="p-4">
      <ul className="flex flex-row flex-wrap gap-2 list-none p-0 m-0">
        {remainingItems.map((item: string) => (
          <li key={item}>
            <button
              onClick={() => handleItemClick(item)}
              disabled={isProcessing || selectedItemsSet.has(item)}
              className={`border ${getItemBorderClass(
                item
              )} px-3 py-1 rounded text-sm bg-white transition-colors cursor-pointer disabled:cursor-not-allowed hover:opacity-80`}
            >
              {item}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DisplayList;
