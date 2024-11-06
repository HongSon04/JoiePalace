// RankMemberships.js
import bronzeCrown from '@/public/bronzeCrown.svg';
import silverCrown from '@/public/silverCrown.svg';
import goldCrown from '@/public/goldCrown.svg';
import platinum from '@/public/platinum.svg';
import account_circle from '@/public/account_circle.svg';

const rankMemberships = [
    {
        id: 1,
        title: "Khách",
        condition: 0,
        imageRank: account_circle,
    },
    {
        id: 2,
        title: 'Đồng',
        condition: 100000000,
        imageRank: bronzeCrown,
    },
    {
        id: 3,
        title: 'Bạc',
        condition: 500000000,
        imageRank: silverCrown,
    },
    {
        id: 4,
        title: 'Vàng',
        condition: 700000000,
        imageRank: goldCrown,
    },
    {
        id: 5,
        title: 'VIP',
        condition: 1000000000000,
        imageRank: platinum,
    },
];

export default rankMemberships;
