import * as photon from './photon';
import * as pngs from './pngs';

photon.initCloudflare();
pngs.initCloudflare();

const worker: ExportedHandler<Env> = {
	async fetch() {
		const imageUrl = 'https://avatars.githubusercontent.com/u/314135';

		const imageBuffer = await fetch(imageUrl).then((res) => res.arrayBuffer());
		const imageBytes = new Uint8Array(imageBuffer);

		const inputImage = photon.PhotonImage.new_from_byteslice(imageBytes);

		// resizing using photon
		const outputImage = photon.resize(inputImage, inputImage.get_width() * 0.5, inputImage.get_height() * 0.5, 1);

		// encoding using pngs
		const outputPng = pngs.encode(outputImage.get_raw_pixels(), outputImage.get_width(), outputImage.get_height());

		const imageResponse = new Response(outputPng, {
			headers: {
				'content-type': 'image/png',
			},
		});

		inputImage.free();
		outputImage.free();

		return imageResponse;
	},
};

export default worker;
