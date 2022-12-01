import { json, type ActionArgs } from '@remix-run/cloudflare';
import { Form, useActionData, useTransition, Link } from '@remix-run/react';
import { useEffect } from 'react';

interface ActionData {
	error?: string;
	urls?: string[];
}

type Style =
	| 'oilPainting'
	| 'pub'
	| 'blackAndWhite'
	| 'nature'
	| 'artsy'
	| 'vintage';

export const action = async ({ request, context }: ActionArgs) => {
	const formData = await request.formData();
	const artistName = String(formData.get('artistName') ?? '');
	const style = String(formData.get('style') ?? '');
	const specialRequests = String(formData.get('specialRequests') ?? '');
	if (style === '') {
		return json<ActionData>(
			{ error: 'Please select a style' },
			{ status: 400 }
		);
	}
	let stylePrompt = '';
	switch (style as Style) {
		case 'oilPainting':
			stylePrompt = 'In the style of an oil painting.';
			break;
		case 'pub':
			stylePrompt = 'In a smoky Irish pub.';
			break;
		case 'blackAndWhite':
			stylePrompt = 'In black and white.';
			break;
		case 'nature':
			stylePrompt = 'In nature.';
			break;
		case 'artsy':
			stylePrompt = 'In artsy style with creative elements.';
			break;
		case 'vintage':
			stylePrompt = 'In vintage 1920s style';
			break;
		default:
			throw new Error('Invalid style');
	}
	const prompt = `Album cover by ${artistName}. ${stylePrompt} Also add these details: ${specialRequests}`;
	const res = await fetch('https://api.openai.com/v1/images/generations', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${context.OPENAI_API_KEY}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			prompt,
			n: 4,
			size: '256x256',
		}),
	});
	interface OpenAIResponse {
		data: Array<{ url: string }>;
	}
	const resJson = await res.json<OpenAIResponse>();
	if (!resJson.data) {
		throw new Error('No data received from image generation API');
	}
	return json<ActionData>(
		{ urls: resJson.data.map(({ url }) => url) },
		{ status: 201 }
	);
};

export default function Home() {
	const { state } = useTransition();
	const data = useActionData<ActionData>();
	const error = data?.error;
	const generatedUrls = data?.urls;

	useEffect(() => {
		if (generatedUrls) {
			window.scrollTo(0, 0);
		}
	}, [generatedUrls]);

	return (
		<div className="flex h-screen w-full flex-col items-center justify-start">
			<div className="flex h-screen w-full flex-col items-center justify-start space-y-8 py-4 px-4 md:h-auto md:max-w-md">
				<div className="mt-4 flex flex-col items-center justify-start text-center">
					<h1>Album Cover Generator</h1>
					<div className="mt-1 text-gray-400">
						Get ideas for your next album cover
					</div>
				</div>

				<div className="flex w-full flex-col items-start">
					{generatedUrls ? (
						<div className="w-full">
							<div className="grid grid-cols-1 grid-rows-4 gap-10">
								{generatedUrls.map((url) => (
									<img
										key={url}
										src={url}
										alt="Generated album cover"
										width="100%"
										className="aspect-square rounded border border-gray-600 bg-gray-800 p-2"
									/>
								))}
							</div>
							<div className="mt-10 text-center">
								<Link to="/" reloadDocument>
									↻ Generate More
								</Link>
							</div>
						</div>
					) : (
						<Form method="post" className="space-y-6">
							<div className="flex w-full flex-col space-y-2">
								<label htmlFor="artistName">Your Artist Name</label>
								<input
									type="text"
									name="artistName"
									id="artistName"
									placeholder="Michael Coleman"
									required
								/>
							</div>

							<div className="flex w-full flex-col space-y-2">
								<label>Pick a Style</label>
								<div className="grid grid-cols-3 grid-rows-2 gap-2">
									<label
										htmlFor="oilPainting"
										className="flex w-full flex-col rounded bg-gray-700"
									>
										<img
											src="/images/oilpainting_sm.jpg"
											width="100%"
											alt="Oil Painting"
										/>
										<div className="flex flex-row items-center justify-start space-x-2 p-2">
											<input
												type="radio"
												name="style"
												id="oilPainting"
												value="oilPainting"
											/>
											<span className="rounded text-sm text-gray-50">
												Oil Painting
											</span>
										</div>
									</label>
									<label
										htmlFor="pub"
										className="flex w-full flex-col rounded bg-gray-700"
									>
										<img src="/images/pub_sm.jpg" width="100%" alt="Pub" />
										<div className="flex flex-row items-center justify-start space-x-2 p-2">
											<input type="radio" name="style" id="pub" value="pub" />
											<span className="rounded text-sm text-gray-50">Pub</span>
										</div>
									</label>
									<label
										htmlFor="blackAndWhite"
										className="flex w-full flex-col rounded bg-gray-700"
									>
										<img
											src="/images/blackandwhite_sm.jpg"
											width="100%"
											alt="Black and White"
										/>
										<div className="flex flex-row items-center justify-start space-x-2 p-2">
											<input
												type="radio"
												name="style"
												id="blackAndWhite"
												value="blackAndWhite"
											/>
											<span className="rounded text-sm text-gray-50">
												B & W
											</span>
										</div>
									</label>
									<label
										htmlFor="nature"
										className="flex w-full flex-col rounded bg-gray-700"
									>
										<img
											src="/images/nature_sm.jpg"
											width="100%"
											alt="Nature"
										/>
										<div className="flex flex-row items-center justify-start space-x-2 p-2">
											<input
												type="radio"
												name="style"
												id="nature"
												value="nature"
											/>
											<span className="rounded text-sm text-gray-50">
												Nature
											</span>
										</div>
									</label>
									<label
										htmlFor="artsy"
										className="flex w-full flex-col rounded bg-gray-700"
									>
										<img src="/images/artsy_sm.jpg" width="100%" alt="Artsy" />
										<div className="flex flex-row items-center justify-start space-x-2 p-2">
											<input
												type="radio"
												name="style"
												id="artsy"
												value="artsy"
											/>
											<span className="rounded text-sm text-gray-50">
												Artsy
											</span>
										</div>
									</label>
									<label
										htmlFor="vintage"
										className="flex w-full flex-col rounded bg-gray-700"
									>
										<img
											src="/images/vintage_sm.jpg"
											width="100%"
											alt="Vintage"
										/>
										<div className="flex flex-row items-center justify-start space-x-2 p-2">
											<input
												type="radio"
												name="style"
												id="vintage"
												value="vintage"
											/>
											<span className="rounded text-sm text-gray-50">
												Vintage
											</span>
										</div>
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

							<button
								type="submit"
								className="flex flex-row items-center space-x-2"
								disabled={state !== 'idle'}
							>
								{state === 'idle' ? (
									'Generate!'
								) : (
									<>
										<span className="animate-spin">↻</span>
										<span>Generating...</span>
									</>
								)}
							</button>

							{error && <p className="text-red-500">{error}</p>}
						</Form>
					)}
				</div>

				<div className="flex space-y-2 text-center text-sm text-gray-400">
					<p>
						Made by <a href="https://dangurney.net">Dan</a>
					</p>
				</div>
			</div>
		</div>
	);
}
