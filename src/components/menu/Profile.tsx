import { cn } from "@/lib/utils";
import localFont from "next/font/local";
import React, { useEffect, useState } from "react";
import { Separator } from "../ui/separator";
import Image from "next/image";
import { set } from "react-hook-form";

const myFont = localFont({
    src: '../../fonts/Supreme-Variable.ttf',
    display: 'swap',
    weight: '500',
})

const font2 = localFont({
    src: '../../fonts/Supreme-Variable.ttf',
    display: 'swap',
    weight: '300',
})

export const Profile = () => {
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        localStorage.getItem("username");
        if (username == null) {
            setUsername("Spieler");
        } else {
            setUsername(username);
        }
    }, []);

    return (
        <div className="pl-2 flex pb-2">
            <div className="wtop-0 left-0">
                <div className="flex">

                    <div className="text-container flex flex-col items-center pr-3">
                        <div className={cn(myFont.className, "font-bold text-white text-[18px] mb-0 tracking-[0] leading-[normal] whitespace-nowrap")}>
                            {username}
                        </div>
                        <Separator className="w-8 my-0 bg-[#ffffff30] rounded"></Separator> {/* Hinzufügen von vertikalem Margin */}
                        <div className={cn(font2.className, "font-bold text-white text-[15px] tracking-[0] leading-[normal] whitespace-nowrap")}>
                            1000
                        </div>
                    </div>
                    <div className="w-[46px] h-[46px] rounded-full overflow-hidden">
                        <Image
                            src="https://cdn.vox-cdn.com/uploads/chorus_asset/file/21825429/VRG_Birchler_Catalina.0.jpg"
                            width={46}
                            height={46}
                            alt="Profilbild"
                            className="object-cover"
                        />
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
