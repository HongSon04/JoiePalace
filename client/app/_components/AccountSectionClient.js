import React, { useEffect, useState } from 'react';
import UserRankAndImageClient from './UserRankAndImageClient';
import DetailUserClient from './DetailUserClient';
import rankMemberships from '@/app/_components/RankMemberships';

const AccountSectionClient = ({ title, nameUser, phoneUser, emailUser, partyBooked, waitingParty, totalMoney, imgUser, total_amount, isLoading }) => {
    const [rank, setRank] = useState()
    useEffect(() => {
        const getData = async () => {
            try {
                if (total_amount) {
                    // Tìm hạng thành viên dựa trên total_amount
                    const foundRank = rankMemberships
                        .slice() 
                        .sort((a, b) => b.condition - a.condition) 
                        .find(member => total_amount >= member.condition); 
        
                    // Nếu tìm thấy hạng, cập nhật trạng thái rank
                    if (foundRank) {
                        setRank(foundRank);
                    } else {
                        setRank(rankMemberships[0]); 
                    }
                } else {
                    setRank(rankMemberships[0]); 
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
                <UserRankAndImageClient userImage={imgUser ? imgUser : '/userImage.png'} rankImage={rank?.imageRank} title={rank?.title} isLoading={isLoading} />
                <DetailUserClient nameUser={nameUser} phoneUser={phoneUser} emailUser={emailUser} partyBooked={partyBooked} waitingParty={waitingParty} totalMoney={totalMoney} isLoading={isLoading} />
            </div>
        </div>
    );
};
export default AccountSectionClient;