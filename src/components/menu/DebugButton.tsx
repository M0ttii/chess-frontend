'use client'

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import AbstractButton from "../AbstractButton";
import { PawnIcon } from "@/assets/icons";


export function DebugButton() {
	
    const router = useRouter()

    function nav(){
        router.push('/debug/')
    }

	return (
        <AbstractButton title="Free Mode" type="blue" content="Play scenarios & debug the engine" onClick={nav}>
            <PawnIcon></PawnIcon>
        </AbstractButton>
        
    )
}