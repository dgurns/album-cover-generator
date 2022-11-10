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

				<Form className="relative mt-8 flex w-full flex-col items-start space-y-6 overflow-y-scroll rounded border border-gray-600 bg-gray-800 p-2">
					<div className="flex w-full flex-col space-y-1">
						<label htmlFor="artistName">Your Artist Name</label>
						<input
							type="text"
							name="artistName"
							id="artistName"
							placeholder="Michael Coleman"
						/>
					</div>

					<div className="flex w-full flex-col space-y-1">
						<label>Pick a Style</label>
						<div className="grid grid-cols-3 grid-rows-1 gap-1">
							<label
								htmlFor="modern"
								className="relative aspect-square w-full rounded bg-gray-300"
							>
								<input
									type="radio"
									name="style"
									id="modern"
									className="absolute top-3 left-2"
								/>
								<span className="absolute top-2 left-8 rounded bg-gray-100 px-1 py-0.5 text-sm text-gray-600">
									Modern
								</span>
							</label>
							<label
								htmlFor="oilPainting"
								className="relative aspect-square w-full rounded bg-gray-300"
							>
								<input
									type="radio"
									name="style"
									id="oilPainting"
									className="absolute top-3 left-2"
								/>
								<span className="absolute top-2 left-8 rounded bg-gray-100 px-1 py-0.5 text-sm text-gray-600">
									Oil Painting
								</span>
							</label>
							<label
								htmlFor="pub"
								className="relative aspect-square w-full rounded bg-gray-300"
							>
								<input
									type="radio"
									name="style"
									id="pub"
									className="absolute top-3 left-2"
								/>
								<span className="absolute top-2 left-8 rounded bg-gray-100 px-1 py-0.5 text-sm text-gray-600">
									Pub
								</span>
							</label>
							<label
								htmlFor="blackAndWhite"
								className="relative aspect-square w-full rounded bg-gray-300"
							>
								<input
									type="radio"
									name="style"
									id="blackAndWhite"
									className="absolute top-3 left-2"
								/>
								<span className="absolute top-2 left-8 rounded bg-gray-100 px-1 py-0.5 text-sm text-gray-600">
									B & W
								</span>
							</label>
							<label
								htmlFor="outdoors"
								className="relative aspect-square w-full rounded bg-gray-300"
							>
								<input
									type="radio"
									name="style"
									id="outdoors"
									className="absolute top-3 left-2"
								/>
								<span className="absolute top-2 left-8 rounded bg-gray-100 px-1 py-0.5 text-sm text-gray-600">
									Outdoors
								</span>
							</label>
							<label
								htmlFor="vintage"
								className="relative aspect-square w-full rounded bg-gray-300"
							>
								<input
									type="radio"
									name="style"
									id="vintage"
									className="absolute top-3 left-2"
								/>
								<span className="absolute top-2 left-8 rounded bg-gray-100 px-1 py-0.5 text-sm text-gray-600">
									Vintage
								</span>
							</label>
						</div>
					</div>

					<div className="flex w-full flex-col space-y-1">
						<label htmlFor="specialRequests">Any Special Requests?</label>
						<input
							type="text"
							name="specialRequests"
							id="specialRequests"
							placeholder="Fiddle, standing on hilltop, etc."
						/>
					</div>

					<button type="submit">Generate!</button>
				</Form>

				<div className="mt-8 flex space-y-2 text-center text-sm text-gray-400">
					<p>
						Made by <a href="https://dangurney.net">Dan</a>
					</p>
				</div>
			</div>
		</div>
	);
}
