'use client'
import Board from '@/components/Board'
import { CreateButton } from '@/components/CreateButton'
import { JoinButton } from '@/components/JoinButton'
import  UserDialog  from '@/components/UserDialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { SymbolIcon } from '@radix-ui/react-icons'
import { UUID } from 'crypto'
import React, { useEffect } from 'react'

export default function Home() {
	const [isLoading, setIsLoading] = React.useState<boolean>(false)
	const [isConnected, setIsConnected] = React.useState<boolean>(false)
	const [user, setUser] = React.useState<boolean>(false)
	const [open, setOpen] = React.useState<boolean>(false);
	const { toast } = useToast();

	useEffect(() => {
		async function checkUser() {
			const userID = localStorage.getItem("id");

			if(userID){
				try{

					const res = await fetch('http://localhost:8080/user/' + userID)
					if(res.ok){
						const data = await res.json();
						console.log("User exists: " + data);
						setIsConnected(true);
					} else {
						console.log("User not found")
						localStorage.removeItem("id");
						setOpen(true);
						setIsConnected(true);
					}
				} catch (error){
					
					toast({
						variant: "destructive",
						description: "Can't connect to server"
					})
				
				}
			} else {
				setOpen(true);
			}
		}
		
		checkUser();
	})

	function create() {
		setIsLoading(true);

		setTimeout(() => {
			setIsLoading(false)
			toast({
				variant: "destructive",
				description: "Can't connect to server"
			})
		}, 2000)
	}
	return (
		<div className="">
			<UserDialog open={open} setOpen={setOpen}></UserDialog>
			<div className="flex flex-col h-screen justify-center bg-[#161618]">
				<div className="text-white text-center absolute top-40 left-1/2 transform -translate-x-1/2">
					<Label className="text-4xl font-semibold">IU</Label>
				</div>
				<div className="flex flex-col mx-auto w-40 h-20 items-center justify-between md:flex">
					{/* <Button onClick={create} variant="default" disabled={!isConnected} className='mx-auto dark font-semibold'>
						{isLoading && (
							<SymbolIcon className="mr-2 h-4 w-4 animate-spin" />
						)}
						Create Game</Button> */}

					<CreateButton/>
					<JoinButton />
				</div>
			</div>
		</div>
	)
}
