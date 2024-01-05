import * as photon from '@wasm/photon';
import * as png from '@wasm/png';

// ! No more needed
// photon.initCloudflare();
// pngs.initCloudflare();

const worker: ExportedHandler<Bindings> = {
	async fetch() {
		const imageUrl = 'https://avatars.githubusercontent.com/u/314135';

		const imageBytes = await fetch(imageUrl)
		  .then((res) => res.ok ? res.arrayBuffer() : null)
			.then(buffer => buffer ? new Uint8Array(buffer) : null);

		if (!imageBytes) {
			return new Response("404: Error fetching image");
		}

		const inputImage = photon.PhotonImage.new_from_byteslice(imageBytes);

		// resizing using photon
		const outputImage = photon.resize(inputImage, inputImage.get_width() * 0.5, inputImage.get_height() * 0.5, 1);

		// encoding using png
		const outputPng = png.encode(outputImage.get_raw_pixels(), outputImage.get_width(), outputImage.get_height());

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
