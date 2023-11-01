'use client'
import Board from '@/components/Board'
import { JoinButton } from '@/components/JoinButton'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { SymbolIcon } from '@radix-ui/react-icons'
import React from 'react'

export default function Home() {
	const [isLoading, setIsLoading] = React.useState<boolean>(false)
	const {toast} = useToast();

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
		<div className="flex flex-col h-screen justify-center bg-[#161618]">
			<div className="text-white text-center absolute top-40 left-1/2 transform -translate-x-1/2">
				<Label className="text-4xl font-semibold">IU-Chess</Label>
			</div>
			<div className="flex flex-col mx-auto w-40 h-20 items-center justify-between md:flex">
				<Button onClick={create} variant="default" className='mx-auto dark font-semibold'>
					{isLoading && (
						<SymbolIcon className="mr-2 h-4 w-4 animate-spin" />
					)}
					Create Game</Button>

				<JoinButton />
			</div>
		</div>
	)
}
