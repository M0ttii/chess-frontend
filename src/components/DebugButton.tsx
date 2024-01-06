'use client'

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import AbstractButton from "./AbstractButton";
import { PawnIcon } from "@/assets/icons";


export function DebugButton() {
	
    const router = useRouter()

    function nav(){
        router.push('/debug/')
    }

	return (
        <AbstractButton content="Debug" onClick={nav}>
            <PawnIcon></PawnIcon>
        </AbstractButton>
        
    )
}