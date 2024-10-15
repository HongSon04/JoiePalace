import React from 'react';
import PartyDetailClient from './PartyDetailClient';
import PropTypes from 'prop-types';

const PartySectionClient = ({ linkTo, showFull, data, showDetailLink, Collapsed }) => {
    return (
        <div className='flex flex-col gap-8'>
            <PartyDetailClient {...data} linkTo={linkTo} showFull={showFull} showDetailLink={showDetailLink} Collapsed={Collapsed} />
        </div>
    );
};

PartySectionClient.propTypes = {
    linkTo: PropTypes.string,
    showFull: PropTypes.bool,
    data: PropTypes.object,  
    showDetailLink: PropTypes.bool,
    Collapsed: PropTypes.bool,
};

export default PartySectionClient;
