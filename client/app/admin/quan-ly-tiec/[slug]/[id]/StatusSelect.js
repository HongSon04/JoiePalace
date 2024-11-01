"use client";

import { useState } from 'react';

function StatusSelect() {
    const options = [
        { id: 1, value: 1, name: "Hoàng Văn Thụ" },
        { id: 2, value: 2, name: "Phạm Văn Đồng" },
        { id: 3, value: 3, name: "Võ Văn Kiệt" },
        { id: 4, value: 4, name: "Hồ Chí Minh" },
    ];

    // State to hold the currently selected value
    const [selectedOption, setSelectedOption] = useState(options[0].value);

    const handleChange = (e) => {
        setSelectedOption(Number(e.target.value));
        console.log(`Selected: ${e.target.options[e.target.selectedIndex].text}`); 
    };

    return (
        <div className="relative inline-block w-full">
            <select
                value={selectedOption}
                onChange={handleChange}
                className="block border bg-whiteAlpha-200 border-gray-300 rounded-md p-2 font-medium text-white leading-6"
            >
                {options.map(option => (
                    <option key={option.id} value={option.value} className="text-black">
                        {option.name}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default StatusSelect;
