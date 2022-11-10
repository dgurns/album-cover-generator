export default function Home() {
	return (
		<div className="flex flex-col items-center justify-start w-full h-screen">
			<div className="flex w-full md:max-w-md h-screen md:h-auto flex-col items-center justify-start py-4 px-4">
				<div className="flex flex-row items-center justify-start mt-4">
					Title
				</div>

				<div className="flex flex-col w-full h-[400px] md:h-[500px] p-2 bg-gray-800 border border-gray-600 rounded mt-8 overflow-y-scroll relative">
					Content
				</div>

				<div className="flex flex-col space-y-2 mt-8 text-sm text-gray-400 text-center">
					Footer
				</div>
			</div>
		</div>
	);
}
