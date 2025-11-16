import { Search } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface SearchbarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}
function Searchbar({ onSearch, placeholder = "Search..." }: SearchbarProps) {
  return (
    // <input
    //   type="text"
    //   placeholder={placeholder}
    //   className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    //   onChange={(e) => onSearch(e.target.value)}
    // />
    <div className="relative">
      <div className=" items-center  px-4 py-2 bg-background rounded-md hidden md:flex">
        <Search size="20px" />
        <input
          type="text"
          placeholder={placeholder}
          className=" rounded-md focus:outline-none pl-4 "
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <div className=" "></div>
      <Popover>
        <PopoverTrigger
          asChild
          className="items-center  px-2 py-2 bg-background rounded-full flex md:hidden"
        >
          <Search size="30px" />
        </PopoverTrigger>
        <PopoverContent
          align="end"
          side="bottom"
          className="w-64 ml-10 md:hidden"
        >
          <input
            type="text"
            placeholder={placeholder}
            className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => onSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key !== "Enter") return;
              onSearch(e.currentTarget.value);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default Searchbar;
