
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Form } from "./ui/form";
import { useForm } from "react-hook-form";
import { SymbolIcon } from "@radix-ui/react-icons";
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/navigation";


export function JoinButton() {
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [game, setGame] = useState('');
    const router = useRouter()
    const form = useForm()
    const { toast } = useToast()

    const handleGameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setGame(event.target.value); // Aktualisieren des Zustands mit dem neuen Wert
    };

    async function onSubmit(event: React.SyntheticEvent) {
        event.preventDefault()
        if (game.length == 0) {
            toast({
                variant: "destructive",
                description: "Lobby cannot be empty!"
            })
            return;
        }

        setIsLoading(true);
        const lobbyRes = await fetch("http://localhost:8080/lobby/" + game)

        if (!lobbyRes.ok) {
            toast({
                variant: "destructive",
                description: "This lobby could not be found"
            })
            setIsLoading(false);
            return;
        }

        const lobbyResData = await lobbyRes.json();
        console.log("LobbyRedData: " + lobbyResData);

        const gameCreateRes = await fetch("http://localhost:8080/game", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ player1: localStorage.getItem("id"), player2: lobbyResData.playerUUID, lobbyId: lobbyResData.id })
        });

        if(!gameCreateRes.ok){
            toast({
                variant: "destructive",
                description: "There was an error joining the game."
            })
            setIsLoading(false);
            return;
        }
        
        const gameCreateResData = await gameCreateRes.json();
        const gameID = gameCreateResData.id;
        router.push('/game/' + gameID);





    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default" className='mx-auto dark font-semibold'>Join Game</Button>
            </DialogTrigger>
            <DialogContent className="dark absolute">

                <DialogHeader>
                    <DialogTitle>Join Game</DialogTitle>
                    <DialogDescription>Paste the game code here</DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                    <Input
                        id="link"
                        placeholder="000000"
                        value={game}
                        onChange={handleGameChange}
                    />
                </div>
                <form onSubmit={onSubmit}>
                    <DialogFooter className="sm:justify-start">
                        <Button type="submit" variant="secondary" disabled={isLoading}>
                            {isLoading && (
                                <SymbolIcon className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Join
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}