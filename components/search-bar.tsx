"use client";

import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface SearchBarProps {
  items: { id: string; label: string }[];
  query: string;
  onQueryChange: (query: string) => void;
  onSelect: (selectedItem: { id: string; label: string }) => void;
  filteredItems: { id: string; label: string }[];
}

export function SearchBar({
  items,
  query,
  onQueryChange,
  onSelect,
  filteredItems,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="relative w-full md:w-60">
      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
      <input
        type="text"
        placeholder="Search..."
        className="w-full rounded-md border border-input bg-background px-8 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        ref={inputRef}
      />
      {query && (
        <div className="absolute top-full left-0 w-full bg-background border rounded-md shadow-md z-10">
          <Command>
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {filteredItems.map((item) => (
                  <CommandItem
                    key={item.id}
                    onSelect={() => {
                      onSelect(item);
                      onQueryChange("");
                    }}
                  >
                    {item.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
}
