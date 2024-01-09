'use client'
import { cn } from '@/lib/utils'
import styles from '../styles.module.css'
import { Label } from '@/components/ui/label'
import { CreateButton } from '@/components/menu/CreateButton'
import { JoinButton } from '@/components/menu/JoinButton'
import { DebugButton } from '@/components/menu/DebugButton'

export default function Home() {

	return (
		<>
			{/* <UserDialog open={open} setOpen={setOpen}></UserDialog> */}
			<div className={cn("h-full flex items-center justify-center" + styles.rdgradient)}>
				<div className="flex flex-col w-full items-center justify-center">
					<div className="mb-4 right-0">
						<Label className='text-4xl text-[#E9E9E9] font-semibold'></Label>
					</div>
					<div className="flex space-x-20 items-center justify-center">
						<CreateButton />
						<JoinButton />
						<DebugButton></DebugButton>
					</div>
				</div>
					
			</div>
		</>
	)
}