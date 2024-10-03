import React from 'react';
import PartyDetail from './PartyDetail';

const PartySection = ({ title, data }) => {
    return (
        <div className='flex flex-col gap-8'>
            <span className="text-base font-bold leading-normal text-gold">{title || "Tiệc gần nhất"}</span>
            {data.map((party, index) => (
                <PartyDetail key={index} {...party} />
            ))}
        </div>
    );
};

export default PartySection;
