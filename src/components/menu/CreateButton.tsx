
import React, { useContext, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { Form } from "../ui/form";
import { useForm } from "react-hook-form";
import { CopyIcon, SymbolIcon } from "@radix-ui/react-icons";
import { useToast } from "../ui/use-toast";
import { useStomp } from "@/ws/StompClientContext";
import { useRouter } from "next/navigation";
import AbstractButton from "../AbstractButton";
import createIcon from "../../public/add-circle.svg";
import { AddIcon } from "@/assets/icons";


export function CreateButton() {
	const { stompClient, isConnected } = useStomp();
	const [isLoading, setIsLoading] = React.useState<boolean>(false)
	const [game, setGame] = useState('');
	const router = useRouter()
	const [open, setOpen] = useState(false);
	const form = useForm()
	const { toast } = useToast()

	useEffect(() => {
		if (isConnected) {
			console.log("STOMP: connected");
		} else {
			console.log("stompClient is null or disconnected");
		}
	}, [isConnected]);

	async function createLobby(state: boolean) {
		console.log(state)
		console.log("StompConnected: " + isConnected)
		if (state) {
			if (game != '') {
				try {
					var gameToDelete = game;
					const response = await fetch(process.env.NEXT_PUBLIC_HOST + "/lobby/" + gameToDelete, {
						method: 'DELETE',
						headers: {
							'Content-Type': 'application/json',
						}
					})
					setGame('');
				} catch (error) {
					console.log(error);
				}
			}
			const response = await fetch(process.env.NEXT_PUBLIC_HOST + "/lobby", {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ playerUUID: localStorage.getItem("id") })
			});
			const data = await response.json();
			setGame(data.id);
			console.log("Lobby ID " + data.id);
			console.log("Game: " + game)

			if (isConnected && stompClient) {
				stompClient.subscribe('/topic/lobby/' + data.id, message => {
					console.log("Second player joined")
					router.push('/game/' + data.id)

				})
			}
			//stompClient.publish({destination: '/app/test', body: JSON.stringify({'id': '123'})})
			//if(stompClient.connected)
			//stompClient.publish({destination: '/test', body: 'Message'});

		}

	}

	return (
		<Dialog onOpenChange={createLobby}>
			<DialogTrigger asChild>
				<AbstractButton title="Create New Game" type="blue" content={"Create a lobby and share your game code"}>
					<AddIcon className="h-4 w-4"></AddIcon>
				</AbstractButton>
			</DialogTrigger>
			<DialogContent className="dark absolute">

				<DialogHeader>
					<DialogTitle>Create Game</DialogTitle>
					<DialogDescription>Share your code with friends</DialogDescription>
				</DialogHeader>
				<div className="flex items-center space-x-2">

					<Input
						id="link"
						value={game}
						readOnly
					/>
					<Button type="submit" size="sm" className="px-3 dark">
						<span className="sr-only">Copy</span>
						<CopyIcon className="h-4 w-4"></CopyIcon>
					</Button>
				</div>
				<form>
					<DialogFooter className="sm:justify-start">
						<DialogClose asChild>
							<Button variant="secondary" type="button">
								Close
							</Button>
						</DialogClose>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}