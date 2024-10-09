import React from 'react';
import UserRankAndImageClient from './UserRankAndImageClient';
import DetailUserClient from './DetailUserClient';

const AccountSectionClient = ({title}) => {
    return (
        <div className="flex flex-col gap-7">
        <span className="text-gold font-bold text-base leading-[22px]">{title}</span>
        <div className="flex gap-8">
            <UserRankAndImageClient userImage={'/userImage.png'} rankImage={'/rankUser.png'} title={'Vàng'}></UserRankAndImageClient>
            <DetailUserClient nameUser={'Hồ Duy Hoàng Giang'} phoneUser={'0934 630 736'} emailUser={'hohoanggiang80@gmail.com'} partyBooked={3} waitingParty={1} totalMoney={'500.000.000 VND'}></DetailUserClient>
        </div>
    </div>
    );
};
export default AccountSectionClient;