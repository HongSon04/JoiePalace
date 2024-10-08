import React from 'react';
import PartyDetailClient from './PartyDetailClient';

const PartySectionClient = ({ title, data }) => {
    return (
        <div className='flex flex-col gap-8'>
            <span className="text-base font-bold leading-normal text-gold">{title || "Tiệc gần nhất"}</span>
            {data.map((party, index) => (
                <PartyDetailClient key={index} {...party} />
            ))}
        </div>
    );
};

export default PartySectionClient;