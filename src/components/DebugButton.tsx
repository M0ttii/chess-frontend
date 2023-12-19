'use client'

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";


export function DebugButton() {
	
    const router = useRouter()

    function nav(){
        router.push('/debug/')
    }

	return (
        <Button onClick={nav}>Debug</Button>
        
    )
}