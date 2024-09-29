import React from 'react';

const ButtonCustomAdmin = ({ id, title, svg , bgColor, textColor}) => {
    return (
            <button id={id} className={`flex gap-2 items-center px-3 py-2 ${textColor} leading-5 font-semibold ${bgColor} rounded-lg ml-auto`}>{svg}{title}</button>
    );
};

export default ButtonCustomAdmin;