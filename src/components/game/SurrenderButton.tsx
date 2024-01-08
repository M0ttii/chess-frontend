import { CheckIcon, Cross1Icon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export const SurrenderButton = () => {
    return (
        <>
            <Popover>
                <PopoverTrigger asChild>
                    <Button className="w-full bg-[#E05E5E] text-white">Surrender</Button>
                </PopoverTrigger>
                <PopoverContent  className="w-23 p-0 bg-transparent border-0">
                    <div className="flex p-1 space-x-2 justify-center">
                        <Button variant="default" size="icon">
                            <Cross1Icon className="h-4 w-4" />
                        </Button>
                        <Button variant="default" size="icon">
                            <CheckIcon className="h-4 w-4" />
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
        </>

    );
};