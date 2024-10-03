import React from 'react';
import UserRankAndImage from './UserRankAndImage';
import DetailUser from './DetailUser';

const AccountSection = ({title}) => {
    return (
        <div className="flex flex-col gap-7">
        <span className="text-gold font-bold text-base leading-[22px]">{title}</span>

        <div className="flex gap-8">
            <UserRankAndImage userImage={'/userImage.png'} rankImage={'/rankUser.png'} title={'Vàng'}></UserRankAndImage>
            <DetailUser nameUser={'Hồ Duy Hoàng Giang'} phoneUser={'0934 630 736'} emailUser={'hohoanggiang80@gmail.com'} partyBooked={3} waitingParty={1} totalMoney={'500.000.000 VND'}></DetailUser>
        </div>
    </div>
    );
};

export default AccountSection;