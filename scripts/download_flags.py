#!/usr/bin/env python3
import os
import requests

def main():
    # Directory to save flags
    OUTPUT_DIR = "flags"
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # Country code -> country name mapping
    codes = requests.get(
        "https://flagcdn.com/en/codes.json"
    ).json()

    for code, name in codes.items():
        url = f"https://flagcdn.com/{code}.svg"

        response = requests.get(url)
        response.raise_for_status()

        # Clean filename
        filename = "".join(c for c in name if c not in r'\/:*?"<>|')

        with open(os.path.join(OUTPUT_DIR, f"{filename}.svg"), "wb") as f:
            f.write(response.content)

        print(f"Downloaded {filename}")

    print("Done!")

if __name__ == '__main__':
    main()
