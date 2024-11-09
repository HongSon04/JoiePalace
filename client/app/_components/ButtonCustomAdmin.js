// ButtonCustomAdmin.js
import React from 'react';

const ButtonCustomAdmin = ({ title, svg, bgColor, textColor, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-3 py-2 ${textColor} ${bgColor} rounded-lg`}
        >
            {svg}
            <span>{title}</span>
        </button>
    );
};

export default ButtonCustomAdmin;
