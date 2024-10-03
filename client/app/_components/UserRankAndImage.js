import React from 'react';
import Image from "next/image";

const UserRankAndImage = ({userImage, rankImage, title}) => {
    return (
        <div className="flex flex-col items-center gap-3">
        <div className="relative w-12 h-12">
            <Image
                src={userImage}
                alt="user-img"
                layout="fill"
                objectFit="cover"
                className="rounded-full"
            />
        </div>
        <div className="flex gap-2 items-center">
            <div className="relative w-6 h-3">
                <Image
                    src={rankImage}
                    alt="rank-img"
                    layout="fill"
                    objectFit="contain"
                />
            </div>
            <span className="text-xs text-white">{title}</span>
        </div>
    </div>
    );
};

export default UserRankAndImage;