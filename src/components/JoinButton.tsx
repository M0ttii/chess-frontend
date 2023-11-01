
import React from "react";
import { Button } from "./ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Form } from "./ui/form";
import { useForm } from "react-hook-form";
import { SymbolIcon } from "@radix-ui/react-icons";
import { useToast } from "./ui/use-toast";


export function JoinButton() {
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const form = useForm()
    const { toast } = useToast()

    async function onSubmit(event: React.SyntheticEvent) {
        event.preventDefault()
        setIsLoading(true)

        setTimeout(() => {
            setIsLoading(false)
            toast({
                variant: "destructive",
                description: "This game could not be found"
            })
        }, 3000)
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