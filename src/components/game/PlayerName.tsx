import { cn } from "@/lib/utils";
import localFont from "next/font/local";
import React, { use, useEffect } from "react";

import Image from 'next/image'

const myFont = localFont({
    src: '../../fonts/Supreme-Variable.ttf',
    display: 'swap',
    weight: '500',
  })

interface PlayerNameProps {
    name: string;
}

export const PlayerName = (props: PlayerNameProps) => {

    useEffect(() => {
    }, []);

    return (
        <div className="pl-2 flex pb-2">
            <div className="wtop-0 left-0">
                <div className="flex">

                    <div className="pb  w-[46px] h-[46px] top-[11px] left-[8px] object-cover rounded-[20px]">
                        <Image className="rounded" src="/shelby.png" alt="sds" width={100} height={300}></Image>
                    </div>
                    <div className={cn(myFont.className, " w-[77px] top-[11px] left-[60px] pl-2 font-bold text-white opacity-90 text-[18px] tracking-[0] leading-[normal] whitespace-nowrap")}>
                        {props.name}
                    </div>
                </div>

                {/* <div className="absolute w-[35px] h-[17px] top-[32px] left-[58px]">
                    <PiecePawnSideBlack className="!absolute !w-[17px] !h-[17px] !top-0 !left-0" color="#F2F2F2" />
                    <PiecePawnSideBlack className="!left-[9px] !absolute !w-[17px] !h-[17px] !top-0" color="#F2F2F2" />
                    <PiecePawnSideBlack className="!left-[18px] !absolute !w-[17px] !h-[17px] !top-0" color="#F2F2F2" />
                </div> */}
            </div>
        </div>
    );
};
