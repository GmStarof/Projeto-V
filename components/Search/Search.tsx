// Search.js
"use client";

import React, { useState, ChangeEvent } from 'react';

interface SearchProps {
    onSearch: (term: string) => void;
    disabled?: boolean;
}

export default function Search({ onSearch, disabled }: SearchProps) {
    const [searchTerm, setSearchTerm] = useState<string>('');

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        onSearch(term);
    };

    const handleClear = () => {
        setSearchTerm('');
        onSearch('');
    };

    return (
        <div className="relative mt-5 max-w-md mx-auto">
            <div className="flex items-center border-b border-gray-300">
                <input
                    type="text"
                    name="search"
                    id="search"
                    disabled={disabled}
                    value={searchTerm}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleSearch(e.target.value)}
                    className="focus:outline-none flex-grow py-2 px-2 text-sm border-none"
                    placeholder="Procure por..."
                    spellCheck={false}
                />
                {searchTerm && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="text-blue-500 ml-2 focus:outline-none hover:text-blue-700"
                    >
                        Limpar
                    </button>
                )}
            </div>
        </div>
    );
}
