import asyncio
from playwright.async_api import async_playwright
import os

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(
            viewport={'width': 1280, 'height': 720},
            device_scale_factor=1,
            geolocation={'latitude': -17.8248, 'longitude': 31.0530},
            permissions=['geolocation']
        )
        page = await context.new_page()

        os.makedirs("verification_fixed", exist_ok=True)

        screens = {
            "list": "http://localhost:8081/list",
            "map": "http://localhost:8081/map"
        }

        for name, url in screens.items():
            print(f"Navigating to {url}...")
            try:
                await page.goto(url, timeout=60000)
                await asyncio.sleep(8) # More time for list to load
                await page.screenshot(path=f"verification_fixed/{name}_screen.png")
                print(f"Captured {name.capitalize()} Screen")
            except Exception as e:
                print(f"Error capturing {name}: {e}")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
