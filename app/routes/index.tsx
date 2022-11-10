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
					<div className="flex w-full flex-col space-y-2">
						<label htmlFor="artistName">Your Artist Name</label>
						<input
							type="text"
							name="artistName"
							id="artistName"
							placeholder="Michael Coleman"
						/>
					</div>

					<div className="flex w-full flex-col space-y-2">
						<label>Pick a Style</label>
						<div className="grid grid-cols-3 grid-rows-1 gap-2">
							<label
								htmlFor="oilPainting"
								className="relative aspect-square w-full rounded bg-gray-300"
							>
								<img
									src="/images/oilpainting_sm.jpg"
									width="100%"
									height="100%"
									alt="Oil Painting"
								/>
								<span className="absolute top-1.5 left-1 rounded bg-gray-100 py-1 pl-7 pr-2 text-sm text-gray-600">
									Oil Painting
								</span>
								<input
									type="radio"
									name="style"
									id="oilPainting"
									className="absolute top-3 left-2.5"
								/>
							</label>
							<label
								htmlFor="pub"
								className="relative aspect-square w-full rounded bg-gray-300"
							>
								<img
									src="/images/pub_sm.jpg"
									width="100%"
									height="100%"
									alt="Pub"
								/>
								<span className="absolute top-1.5 left-1 rounded bg-gray-100 py-1 pl-7 pr-2 text-sm text-gray-600">
									Pub
								</span>
								<input
									type="radio"
									name="style"
									id="pub"
									className="absolute top-3 left-2.5"
								/>
							</label>
							<label
								htmlFor="blackAndWhite"
								className="relative aspect-square w-full rounded bg-gray-300"
							>
								<img
									src="/images/blackandwhite_sm.jpg"
									width="100%"
									height="100%"
									alt="Black and White"
								/>
								<span className="absolute top-1.5 left-1 rounded bg-gray-100 py-1 pl-7 pr-2 text-sm text-gray-600">
									B & W
								</span>
								<input
									type="radio"
									name="style"
									id="blackAndWhite"
									className="absolute top-3 left-2.5"
								/>
							</label>
							<label
								htmlFor="nature"
								className="relative aspect-square w-full rounded bg-gray-300"
							>
								<img
									src="/images/nature_sm.jpg"
									width="100%"
									height="100%"
									alt="Nature"
								/>
								<span className="absolute top-1.5 left-1 rounded bg-gray-100 py-1 pl-7 pr-2 text-sm text-gray-600">
									Nature
								</span>
								<input
									type="radio"
									name="style"
									id="nature"
									className="absolute top-3 left-2.5"
								/>
							</label>
							<label
								htmlFor="artsy"
								className="relative aspect-square w-full rounded bg-gray-300"
							>
								<img
									src="/images/artsy_sm.jpg"
									width="100%"
									height="100%"
									alt="Artsy"
								/>
								<span className="absolute top-1.5 left-1 rounded bg-gray-100 py-1 pl-7 pr-2 text-sm text-gray-600">
									Artsy
								</span>
								<input
									type="radio"
									name="style"
									id="artsy"
									className="absolute top-3 left-2.5"
								/>
							</label>
							<label
								htmlFor="vintage"
								className="relative aspect-square w-full rounded bg-gray-300"
							>
								<img
									src="/images/vintage_sm.jpg"
									width="100%"
									height="100%"
									alt="Vintage"
								/>
								<span className="absolute top-1.5 left-1 rounded bg-gray-100 py-1 pl-7 pr-2 text-sm text-gray-600">
									Vintage
								</span>
								<input
									type="radio"
									name="style"
									id="vintage"
									className="absolute top-3 left-2.5"
								/>
							</label>
						</div>
					</div>

					<div className="flex w-full flex-col space-y-2">
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
