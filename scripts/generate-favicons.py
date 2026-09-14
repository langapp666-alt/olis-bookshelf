#!/usr/bin/env python3
"""Rasterize public/favicon.svg into PNG and ICO files at site-root URLs.

Brand mark (matches Logo.astro / favicon.svg):
  field    #141210
  bookmark #c11f13  path M16 8h16v26l-8-5-8 5V8Z in a 48×48 viewBox
"""

from __future__ import annotations

import struct
import zlib
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"

BG = (0x14, 0x12, 0x10, 255)
FG = (0xC1, 0x1F, 0x13, 255)
# M16 8 h16 v26 l-8-5 l-8 5 V8 Z
BOOKMARK = [(16.0, 8.0), (32.0, 8.0), (32.0, 34.0), (24.0, 29.0), (16.0, 34.0)]
VIEWBOX = 48.0


def point_in_poly(x: float, y: float, poly: list[tuple[float, float]]) -> bool:
    inside = False
    n = len(poly)
    for i in range(n):
        x1, y1 = poly[i]
        x2, y2 = poly[(i + 1) % n]
        if (y1 > y) != (y2 > y):
            xin = (x2 - x1) * (y - y1) / (y2 - y1) + x1
            if x < xin:
                inside = not inside
    return inside


def render(size: int, samples: int = 8) -> bytes:
    """Return tightly packed RGBA bytes with coverage antialiasing."""
    pixels = bytearray(size * size * 4)
    denom = samples * samples
    for py in range(size):
        for px in range(size):
            cover = 0
            for sy in range(samples):
                for sx in range(samples):
                    x = (px + (sx + 0.5) / samples) * VIEWBOX / size
                    y = (py + (sy + 0.5) / samples) * VIEWBOX / size
                    if point_in_poly(x, y, BOOKMARK):
                        cover += 1
            t = cover / denom
            i = (py * size + px) * 4
            inv = 1.0 - t
            pixels[i] = round(BG[0] * inv + FG[0] * t)
            pixels[i + 1] = round(BG[1] * inv + FG[1] * t)
            pixels[i + 2] = round(BG[2] * inv + FG[2] * t)
            pixels[i + 3] = 255
    return bytes(pixels)


def png_chunk(tag: bytes, data: bytes) -> bytes:
    crc = zlib.crc32(tag + data) & 0xFFFFFFFF
    return struct.pack(">I", len(data)) + tag + data + struct.pack(">I", crc)


def encode_png(size: int, rgba: bytes) -> bytes:
    raw = bytearray()
    row = size * 4
    for y in range(size):
        raw.append(0)  # filter: None
        raw.extend(rgba[y * row : (y + 1) * row])
    ihdr = struct.pack(">IIBBBBB", size, size, 8, 6, 0, 0, 0)
    return (
        b"\x89PNG\r\n\x1a\n"
        + png_chunk(b"IHDR", ihdr)
        + png_chunk(b"IDAT", zlib.compress(bytes(raw), 9))
        + png_chunk(b"IEND", b"")
    )


def write_png(path: Path, size: int, samples: int = 8) -> bytes:
    png = encode_png(size, render(size, samples))
    path.write_bytes(png)
    return png


def write_ico(path: Path, images: list[tuple[int, bytes]]) -> None:
    count = len(images)
    offset = 6 + 16 * count
    directory = bytearray()
    blob = bytearray()
    for size, png in images:
        directory.extend(
            struct.pack(
                "<BBBBHHII",
                size if size < 256 else 0,
                size if size < 256 else 0,
                0,
                0,
                1,
                32,
                len(png),
                offset,
            )
        )
        blob.extend(png)
        offset += len(png)
    path.write_bytes(struct.pack("<HHH", 0, 1, count) + directory + blob)


def main() -> None:
    PUBLIC.mkdir(exist_ok=True)
    pngs = {
        32: write_png(PUBLIC / "favicon-32x32.png", 32),
        48: write_png(PUBLIC / "favicon-48x48.png", 48),
        96: write_png(PUBLIC / "favicon-96x96.png", 96),
        192: write_png(PUBLIC / "favicon-192x192.png", 192),
        180: write_png(PUBLIC / "apple-touch-icon.png", 180),
    }
    ico_16 = encode_png(16, render(16, samples=16))
    write_ico(
        PUBLIC / "favicon.ico",
        [(16, ico_16), (32, pngs[32]), (48, pngs[48])],
    )
    print("Wrote favicon.ico, PNG sizes, and apple-touch-icon.png in public/")


if __name__ == "__main__":
    main()
