import React, { useState, useEffect } from 'react';
import Image from "next/image";

const UserRankAndImageClient = ({ userImage, rankImage, title, isLoading }) => {
    return (
        <div className="flex flex-col items-center gap-3 sm:gap-4 lg:gap-6">
            {isLoading ? (
                // Show loading skeletons or placeholders
                <>
                    <div className="relative w-12 h-12 sm:w-16 sm:h-16 lg:w-12 lg:h-12 bg-gray-300 animate-pulse rounded-full"></div>
                    <div className="flex gap-2 items-center">
                        <div className="relative w-3 h-3 sm:w-4 sm:h-4 lg:w-8 lg:h-8 bg-gray-300 animate-pulse rounded-full"></div>
                        <span className="h-4 w-[50px] bg-gray-300 animate-pulse rounded"></span>
                    </div>
                </>
            ) : (
                <>
                    <div className="relative w-12 h-12 sm:w-16 sm:h-16 lg:w-12 lg:h-12">
                        <Image
                            src={userImage}
                            alt="user-img"
                            fill
                            className="rounded-full object-cover"
                        />
                    </div>
                    <div className="flex gap-2 items-center">
                        <div className="relative w-6 h-3 sm:w-8 sm:h-4 lg:w-10 lg:h-8">
                            <Image
                                src={rankImage}
                                alt="rank-img"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <span className="text-sm text-white">{title}</span>
                    </div>
                </>
            )}
        </div>
    );
};

export default UserRankAndImageClient;
