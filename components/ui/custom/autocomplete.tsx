"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type AutoCompleteItem<T extends string> = {
  value: T;
  label: string;
};

interface AutoCompleteProps<T extends string> {
  selectedValue: T;
  onSelectedValueChange: (value: T) => void;
  searchValue: string;
  onSearchValueChange: (value: string) => void;
  items: AutoCompleteItem<T>[];
  isLoading?: boolean;
  emptyMessage?: string;
  placeholder?: string;
}

export function AutoComplete<T extends string>({
  selectedValue,
  onSelectedValueChange,
  searchValue,
  onSearchValueChange,
  items,
  isLoading = false,
  emptyMessage = "No items found.",
  placeholder = "Search...",
}: AutoCompleteProps<T>) {
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Filter items based on search value
  const filteredItems = items.filter((item) => {
    if (!searchValue) return true;
    return item.label.toLowerCase().includes(searchValue.toLowerCase());
  });

  // Reset selected index when items change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [filteredItems.length, searchValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onSearchValueChange(newValue);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < filteredItems.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (
      e.key === "Enter" &&
      selectedIndex >= 0 &&
      filteredItems[selectedIndex]
    ) {
      e.preventDefault();
      const selectedItem = filteredItems[selectedIndex];
      onSelectedValueChange(selectedItem.value);
      onSearchValueChange(selectedItem.label);
      setIsFocused(false);
      setSelectedIndex(-1);
    } else if (e.key === "Escape") {
      setIsFocused(false);
      setSelectedIndex(-1);
      inputRef.current?.blur();
    }
  };

  const handleSuggestionClick = (item: AutoCompleteItem<T>) => {
    onSelectedValueChange(item.value);
    onSearchValueChange(item.label);
    setIsFocused(false);
    setSelectedIndex(-1);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = (e: React.FocusEvent) => {
    // Delay hiding suggestions to allow for click events on suggestions
    setTimeout(() => {
      if (!listRef.current?.contains(e.relatedTarget as Node)) {
        setIsFocused(false);
        setSelectedIndex(-1);
      }
    }, 200);
  };

  // Get the display value - show selected item label if available, otherwise show search value
  const displayValue =
    selectedValue && items.find((item) => item.value === selectedValue)
      ? items.find((item) => item.value === selectedValue)!.label
      : searchValue;

  return (
    <div className="relative w-full">
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={displayValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="pr-10"
          aria-label="Search input"
          aria-autocomplete="list"
          aria-controls="autocomplete-list"
          aria-expanded={isFocused && filteredItems.length > 0}
        />
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="absolute right-0 top-0 h-full pointer-events-none"
          aria-label="Search"
          tabIndex={-1}
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
      {isFocused && (
        <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-md max-h-[300px] overflow-hidden">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Loading...
            </div>
          ) : filteredItems.length > 0 ? (
            <ul
              ref={listRef}
              id="autocomplete-list"
              className="overflow-y-auto max-h-[300px]"
              role="listbox"
            >
              {filteredItems.map((item, index) => {
                const isSelected = item.value === selectedValue;
                const isHighlighted = index === selectedIndex;
                return (
                  <li
                    key={item.value}
                    className={cn(
                      "px-4 py-2 cursor-pointer flex items-center gap-2",
                      "hover:bg-accent hover:text-accent-foreground",
                      isHighlighted && "bg-accent text-accent-foreground",
                      isSelected && "font-medium"
                    )}
                    onClick={() => handleSuggestionClick(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <Check
                      className={cn(
                        "h-4 w-4 shrink-0",
                        isSelected ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="flex-1 truncate">{item.label}</span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              {emptyMessage}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
