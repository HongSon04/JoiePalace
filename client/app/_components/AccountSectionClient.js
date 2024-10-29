import React from 'react';
import UserRankAndImageClient from './UserRankAndImageClient';
import DetailUserClient from './DetailUserClient';
import goldCrown from '@/public/goldCrown.svg'
const AccountSectionClient = ({title, nameUser, phoneUser, emailUser, partyBooked, waitingParty, totalMoney}) => {
    return (
        <div className="flex flex-col gap-7">
        <span className="text-gold font-bold text-base leading-[22px]">{title}</span>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
            <UserRankAndImageClient userImage={'/userImage.png'} rankImage={goldCrown} title={'Vàng'} />
            <DetailUserClient nameUser={nameUser} phoneUser={phoneUser} emailUser={emailUser} partyBooked={partyBooked} waitingParty={waitingParty} totalMoney={totalMoney} />
        </div>
    </div>
    );
};
export default AccountSectionClient;