'use client'
import { CreateButton } from '@/components/CreateButton'
import { DebugButton } from '@/components/DebugButton'
import { MenuHistory } from '@/components/MenuHistory'
import { JoinButton } from '@/components/JoinButton'
import UserDialog from '@/components/UserDialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { SymbolIcon } from '@radix-ui/react-icons'
import { UUID } from 'crypto'
import React, { useEffect } from 'react'
import { Profile } from '@/components/menu/Profile'
import styles from './styles.module.css'
import { cn } from '@/lib/utils'

export default function Home() {
	const [isLoading, setIsLoading] = React.useState<boolean>(false)
	const [user, setUser] = React.useState<boolean>(false)
	const [open, setOpen] = React.useState<boolean>(false);
	const { toast } = useToast();

	var loaded = false;

	useEffect(() => {
		async function checkUser() {
			const userID = localStorage.getItem("id");
			if (userID) {
				try {
					const res = await fetch('http://localhost:8080/user/' + userID);
					if (res.ok) {
						console.log("User exists");
					} else {
						console.log("User not found");
						localStorage.removeItem("id");
						setOpen(true);
					}
				} catch (error) {
					toast({
						variant: "destructive",
						description: "Can't connect to server"
					});
				}
			} else {
				setOpen(true);
			}
		}

		checkUser();
	}, [toast]);

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

	const WhiteKingIcon = (props: any) => (
		<svg width="50" height="50" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M30.0019 3.87506C30.0694 1.71562 31.8395 0 34 0H40C42.1605 0 43.9306 1.71562 43.998 3.87506L44.0332 5H46C48.2091 5 50 6.79086 50 9V11.4261C54.3602 10.4394 59.0663 11.0984 63.0607 14.4271C71.3589 21.3423 70.5954 35.8381 60.7472 43.7669C58.3706 45.6803 56.5035 47.2665 55.2178 48.901C54.9245 49.2739 54.6732 49.6347 54.4617 49.9878L58.5156 50.5361C60.4995 50.8044 61.9795 52.4981 61.9795 54.5V62C61.9795 64.2091 60.1886 66 57.9795 66H16.0205C13.8114 66 12.0205 64.2091 12.0205 62V54.5C12.0205 52.4981 13.5005 50.8044 15.4844 50.5361L19.5383 49.9878C19.3268 49.6347 19.0755 49.2739 18.7822 48.901C17.4965 47.2665 15.6294 45.6803 13.2528 43.7669C3.40462 35.8381 2.64109 21.3423 10.9393 14.4271C14.9337 11.0984 19.6398 10.4394 24 11.4261V9C24 6.79086 25.7909 5 28 5H29.9668L30.0019 3.87506Z" fill="#34364C" />
			<path d="M34 4H40L40.1562 9H46V15H40.3437L40.6185 21.793C40.7282 21.6638 40.8411 21.5372 40.9574 21.4135C46.4206 15.6071 54.5207 12.5172 60.5 17.5C66.5 22.5 66.5 34 58.2387 40.6512C53.559 44.4188 49.3673 48.0509 49.5739 53.3632L57.9795 54.5V62H16.0205V54.5L24.4261 53.3632C24.6327 48.0509 20.441 44.4188 15.7613 40.6512C7.5 34 7.5 22.5 13.5 17.5C19.4793 12.5172 27.5794 15.6071 33.0426 21.4135C33.1589 21.5372 33.2718 21.6638 33.3815 21.793L33.6562 15H28V9H33.8437L34 4ZM28.348 26.9731C32.0147 32.9791 32.5 40 32.5 43.0532C30.6621 43.0565 23.7338 40.0085 20.0656 35.0046C17.4248 31.4022 16.7362 26.0575 19 23.9825C21.2638 21.9075 26.0563 23.2194 28.348 26.9731ZM45.652 26.9731C41.9853 32.9791 41.5 40 41.5 43.0532C43.3379 43.0565 50.2662 40.0085 53.9344 35.0046C56.5752 31.4022 57.2638 26.0575 55 23.9825C52.7362 21.9075 47.9436 23.2194 45.652 26.9731Z" fill="#F4F7FA" />
		</svg>

	)

	return (
		<>
			{/* <UserDialog open={open} setOpen={setOpen}></UserDialog> */}
			<div className={cn("h-full flex items-center justify-center" + styles.rdgradient)}>
				<div className="flex flex-col w-full items-center justify-center space-x-5">
					<div className="mb-4 right-0">
						<Label className='text-4xl text-[#E9E9E9] font-semibold'>Play</Label>
					</div>
					<div className="flex space-x-8 items-center justify-center">
						<CreateButton />
						<JoinButton />
						<DebugButton></DebugButton>
					</div>
				</div>
					
			</div>
		</>
	)
}
