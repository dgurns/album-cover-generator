import { Form } from '@remix-run/react';

export default function Home() {
	return (
		<div className="flex h-screen w-full flex-col items-center justify-start">
			<div className="flex h-screen w-full flex-col items-center justify-start py-4 px-4 md:h-auto md:max-w-md">
				<div className="mt-4 flex flex-col items-center justify-start text-center">
					<h1>Album Cover Generator</h1>
					<div className="text-gray-400">
						Get ideas for your next album cover
					</div>
				</div>

				<Form className="relative mt-8 flex w-full flex-col overflow-y-scroll rounded border border-gray-600 bg-gray-800 p-2">
					<input
						type="text"
						name="artistName"
						id="artistName"
						placeholder="Your artist name"
					/>
				</Form>

				<div className="mt-8 flex flex-col space-y-2 text-center text-sm text-gray-400">
					Footer
				</div>
			</div>
		</div>
	);
}
