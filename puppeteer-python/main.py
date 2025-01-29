import os
import asyncio
import pyppeteer

OUTPUT_FILE = "output.mp4"
FILE_SIZE = 1024 * 1024 * 100  # 100MB pre-allocation

# Get here https://googlechromelabs.github.io/chrome-for-testing/#stable
CHROMIUM_PATH = "~/.cache/puppeteer/chrome/mac_arm-132.0.6834.83/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing"

# Remove output file if it exists
if os.path.exists(OUTPUT_FILE):
    os.remove(OUTPUT_FILE)
    print(f"Removed existing file: {OUTPUT_FILE}")

def save_chunk(data, position):
    """Writes the received video chunk at the specified position."""
    with open(OUTPUT_FILE, "r+b") as f:
        f.seek(position)
        f.write(bytearray(data))

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
        return 0;
    } catch (e) {
        console.error(e);
        return JSON.stringify({ error: e.message, stack: e.stack });
    }
}
"""

async def main():
    try:
        browser = await pyppeteer.launch(
            headless=False,
            executablePath=CHROMIUM_PATH
        )
        page = await browser.newPage()

        # Pre-allocate a file
        with open(OUTPUT_FILE, "wb") as f:
            f.truncate(FILE_SIZE)
        
        # Expose save_chunk function to be used within the page
        await page.exposeFunction("saveChunk", save_chunk)

        await page.goto("https://www.cloudflare.com/cdn-cgi/trace")
        await page.addScriptTag({"url": "https://unpkg.com/mp4-muxer"})
        await page.addScriptTag({"url": "https://unpkg.com/@diffusionstudio/core-v2/dist/core.umd.js"})
        await page.waitForFunction("typeof window.core !== 'undefined'")
        await page.waitForFunction("typeof window.Mp4Muxer !== 'undefined'")

        print("Scripts loaded")
        
        result = await page.evaluate(js_function)
        print("result:", result)

    except Exception as e:
        print(f"Error: {e}")
        raise
    finally:
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
