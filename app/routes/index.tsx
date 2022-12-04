import type { AppLoadContext, LoaderArgs } from '@remix-run/cloudflare';
import { json, type ActionArgs } from '@remix-run/cloudflare';
import { Form, useActionData, useTransition, Link } from '@remix-run/react';
import { useEffect } from 'react';

export const headers = () => ({
	'WWW-Authenticate': 'Basic',
});

function isAuthorized(request: Request, context: AppLoadContext) {
	const header = request.headers.get('Authorization');
	if (!header) {
		return false;
	}
	const base64 = header.replace('Basic ', '');
	// atob is present in Cloudflare Workers global scope
	// https://developers.cloudflare.com/workers/runtime-apis/web-standards#base64-utility-methods
	const [username, password] = atob(base64).toString().split(':');
	return username === context.USERNAME && password === context.PASSWORD;
}

export const loader = async ({ request, context }: LoaderArgs) => {
	if (!isAuthorized(request, context)) {
		return json({ authorized: false }, { status: 401 });
	}
	return null;
};

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

// mock image URLs to use while testing
const mockImageUrls = [
	'https://oaidalleapiprodscus.blob.core.windows.net/private/org-VvkFe6SnkydfF2qu5gZ5lX75/user-9CcsV2OhgdvKp3qOCsZ3s2fb/img-4RuVw8Fmyl6wNlulHDEYskJ2.png?st=2022-12-04T10%3A09%3A11Z&se=2022-12-04T12%3A09%3A11Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2022-12-04T01%3A59%3A06Z&ske=2022-12-05T01%3A59%3A06Z&sks=b&skv=2021-08-06&sig=puHakZ/pzmCl1q69EjTUAORmInWmfxKjCOGNd4o7hgs%3D',
	'https://oaidalleapiprodscus.blob.core.windows.net/private/org-VvkFe6SnkydfF2qu5gZ5lX75/user-9CcsV2OhgdvKp3qOCsZ3s2fb/img-uXfANRCveMeaqaYsUF1OZWdB.png?st=2022-12-04T10%3A09%3A11Z&se=2022-12-04T12%3A09%3A11Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2022-12-04T01%3A59%3A06Z&ske=2022-12-05T01%3A59%3A06Z&sks=b&skv=2021-08-06&sig=iFsryB82lv2u3LPyXzNvm5I2O%2Bk5C5tLJhaqycZxWsI%3D',
	'https://oaidalleapiprodscus.blob.core.windows.net/private/org-VvkFe6SnkydfF2qu5gZ5lX75/user-9CcsV2OhgdvKp3qOCsZ3s2fb/img-W1czF7lzVzGeGCPYeECDJ0jc.png?st=2022-12-04T10%3A09%3A11Z&se=2022-12-04T12%3A09%3A11Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2022-12-04T01%3A59%3A06Z&ske=2022-12-05T01%3A59%3A06Z&sks=b&skv=2021-08-06&sig=AX1YcBO5pdEWsQ/8kivhaopkIb2B/4xvo%2BHx8nm2mHY%3D',
];

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
	// if we don't want to hit the actual OpenAI API during testing, can set
	// USE_MOCK_IMAGES to true and return mock image URLs
	if (context.USE_MOCK_IMAGES) {
		return json<ActionData>({ urls: mockImageUrls });
	}
	const res = await fetch('https://api.openai.com/v1/images/generations', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${context.OPENAI_API_KEY}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			prompt,
			n: 3,
			size: '512x512',
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
		<div className="flex w-full flex-col items-center justify-start pb-8">
			<div className="flex w-full flex-col items-center justify-start space-y-8 py-4 px-4 md:h-auto md:max-w-md">
				<div className="mt-4 flex flex-col justify-start text-center">
					<h1>Album Cover Generator</h1>
					<div className="mt-1 text-gray-400">
						Get ideas for your next album cover
					</div>
				</div>

				<div className="flex w-full flex-col items-start justify-center">
					{generatedUrls ? (
						<div className="flex w-full flex-col items-center">
							<div className="grid w-full grid-cols-1 grid-rows-3 gap-10">
								{generatedUrls.map((url) => (
									<img
										key={url}
										src={url}
										alt="Generated album cover"
										width="100%"
										className="aspect-square w-full rounded border border-gray-600 bg-gray-800 p-2"
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
