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
			<div className={cn("h-screen flex items-center justify-center " + styles.rdgradient)}>
				<div className="flex flex-col w-full">
					<div className="section mx-auto w-[1180px] space-y-4 ">
						<div className="">
							<Label className='text-[64px] text-[#ffffff] opacity-80 font-semibold '>Play</Label>
						</div>
						<div className="flex space-x-20 items-center justify-center">
							<CreateButton />
							<JoinButton />
							<DebugButton></DebugButton>
						</div>
					</div>
				</div>

			</div>
		</>
	)
}