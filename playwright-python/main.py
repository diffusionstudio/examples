from playwright.sync_api import sync_playwright, Playwright

OUTPUT_FILE = "output.mp4"

with open(OUTPUT_FILE, "wb") as f:
    pass  # Create empty file
    print(f"Created empty output file: {OUTPUT_FILE}")   

def save_chunk(data, position):
    """Writes the received video chunk at the specified position."""
    with open(OUTPUT_FILE, "r+b") as f:
        f.seek(position)
        f.write(bytearray(data))
        print(f"Saved chunk of size {len(data)} at position {position}")

# Define JavaScript function
js_function = """
async () => {
    try {
        const composition = new core.Composition();
        const source = await core.VideoSource.from(
            'https://diffusion-studio-public.s3.eu-central-1.amazonaws.com/videos/big_buck_bunny_1080p_30fps.mp4'
        );
        const video = new core.VideoClip(source).subclip(0, 150);
        await composition.add(video);
        const encoder = new core.Encoder(composition);
        await encoder.render((data, position) => {
            window.saveChunk(Array.from(new Uint8Array(data)), position);
        });
        return 'rendered';
    } catch (e) {
        console.error(e);
    }
}
"""

def main(playwright: Playwright):
    try:
        browser = playwright.chromium.launch(
            headless=False,
            # Make sure browser is hardware accelerated and has access to video/audio codecs
            executable_path="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        )
        page = browser.new_page()

        page.goto("https://www.cloudflare.com/cdn-cgi/trace")
        page.add_script_tag(url="https://unpkg.com/mp4-muxer")
        page.add_script_tag(
            url="https://unpkg.com/@diffusionstudio/core/dist/core.umd.js"
        )
        page.wait_for_function("typeof window.core !== 'undefined'")
        page.wait_for_function("typeof window.Mp4Muxer !== 'undefined'")

        page.on("console", lambda msg: print(f"[Browser]: {msg.text}"))

        # Expose save_chunk function to be used within the page
        page.expose_function("saveChunk", save_chunk)

        print("Environment ready")

        result = page.evaluate(js_function)
        print("result:", result)

        browser.close()

    except Exception as e:
        print(f"Error: {e}")
        raise


if __name__ == "__main__":
    with sync_playwright() as playwright:
        main(playwright)
