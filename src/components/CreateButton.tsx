
import React, { useContext, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Form } from "./ui/form";
import { useForm } from "react-hook-form";
import { CopyIcon, SymbolIcon } from "@radix-ui/react-icons";
import { useToast } from "./ui/use-toast";
import { useStomp } from "@/ws/StompClientContext";


export function CreateButton() {
	const { stompClient } = useStomp();
	const [isLoading, setIsLoading] = React.useState<boolean>(false)
	const [game, setGame] = useState('');
	const [open, setOpen] = useState(false);
	const form = useForm()
	const { toast } = useToast()


	if (stompClient) {
		stompClient.onConnect = (frame) => {
			console.log("Connected")
		}

		stompClient.onWebSocketError = (error) => {
			console.error('Error with websocket', error);
		};

		stompClient.onStompError = (frame) => {
			console.error('Broker reported error: ' + frame.headers['message']);
			console.error('Additional details: ' + frame.body);
		};
	}

	async function createLobby(state: boolean) {
		if (state) {
			if (game != '') {
				try {
					var gameToDelete = game;
					setGame('');
					const response = await fetch("http://localhost:8080/lobby/" + gameToDelete, {
						method: 'DELETE',
						headers: {
							'Content-Type': 'application/json',
						}
					})
				} catch (error) {
					console.log(error);
				}
			}
			const response = await fetch("http://localhost:8080/lobby", {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ playerUUID: localStorage.getItem("id") })
			});
			const data = await response.json();
			setGame(data.id);

			if (stompClient) {
				console.log("Stomp: " + stompClient.connected)
				stompClient.activate();
				console.log("Stomp: " + stompClient.connected)
				//if(stompClient.connected)
				stompClient.publish({destination: '/test', body: 'Message'});
			}
		}

	}

	return (
		<Dialog onOpenChange={createLobby}>
			<DialogTrigger asChild>
				<Button variant="default" className='mx-auto dark font-semibold'>Create Game</Button>
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