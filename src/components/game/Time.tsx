import { Roboto, Roboto_Mono } from "next/font/google";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";

export const roboto_mono = Roboto({
    subsets: ['latin'],
    display: 'swap',
    weight: '700',
  })

export const Time = () => {
    return (
      <div className="w-[100px] h-[41px]">
        <div className="fixed w-[102px] h-[41px]">
          <div className="w-[100px] h-[41px] bg-[#1c1c22] rounded-[5px] items-center flex justify-center">
            <Label className={cn(roboto_mono.className, " text-xl text-[#ffffff80]")}>5:00</Label>
          </div>
        </div>
      </div>
    );
  };