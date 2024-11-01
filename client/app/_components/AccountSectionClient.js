import React, { useEffect, useState } from 'react';
import UserRankAndImageClient from './UserRankAndImageClient';
import DetailUserClient from './DetailUserClient';
import bronzeCrown from '@/public/bronzeCrown.svg'
import silverCrown from '@/public/silverCrown.svg'
import goldCrown from '@/public/goldCrown.svg'
import platinum from '@/public/platinum.svg'
import account_circle from '@/public/account_circle.svg'


const rankMemberships = [
    {
        id: 1,
        title: "Khách",
        condition: "100 000 000 000",
        imageRank: account_circle
    },
    {
        id: 2,
        title: 'Đồng',
        condition: '100 000 000 000',
        imageRank: bronzeCrown
    },
    {
        id: 3,
        title: 'Bạc',
        condition: '500 000 000 000',
        imageRank: silverCrown
    },
    {
        id: 4,
        title: 'Vàng',
        condition: '700 000 000 000',
        imageRank: goldCrown
    },
    {
        id: 5,
        title: 'VIP',
        condition: '1 000 000 000 000',
        imageRank: platinum
    },
]

const AccountSectionClient = ({ title, nameUser, phoneUser, emailUser, partyBooked, waitingParty, totalMoney, imgUser, total_amount }) => {
    const [rank, setRank] = useState()
    useEffect(() => {
        const getData = async () => {
            try {
                if (total_amount) {
                    const rank = rankMemberships?.filter((member) => member.condition === total_amount);
                    setRank(rank);
                } else if (rankMemberships && rankMemberships.length > 0) {
                    setRank(rankMemberships[0]);
                } else {
                    setRank(null); 
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        getData();
    }, [total_amount, rankMemberships]); 


    return (
        <div className="flex flex-col gap-7">
            <span className="text-gold font-bold text-base leading-[22px]">{title}</span>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                <UserRankAndImageClient userImage={imgUser ? imgUser : '/userImage.png'} rankImage={rank?.imageRank} title={rank?.title} />
                <DetailUserClient nameUser={nameUser} phoneUser={phoneUser} emailUser={emailUser} partyBooked={partyBooked} waitingParty={waitingParty} totalMoney={totalMoney} />
            </div>
        </div>
    );
};
export default AccountSectionClient;