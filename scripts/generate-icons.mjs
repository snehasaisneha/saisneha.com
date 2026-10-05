import { readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

const publicDir = new URL("../public/", import.meta.url);
const svg = await readFile(new URL("favicon.svg", publicDir), "utf8");
const png = size => sharp(Buffer.from(svg)).resize(size, size).png().toBuffer();
const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map(png));
// ICO directory containing PNG images, so browsers can choose a native size.
const directory = Buffer.alloc(6 + images.length * 16);
directory.writeUInt16LE(1, 2);
directory.writeUInt16LE(images.length, 4);
let offset = directory.length;
images.forEach((data, index) => {
  const entry = 6 + index * 16;
  directory[entry] = sizes[index];
  directory[entry + 1] = sizes[index];
  directory.writeUInt16LE(1, entry + 4);
  directory.writeUInt16LE(32, entry + 6);
  directory.writeUInt32LE(data.length, entry + 8);
  directory.writeUInt32LE(offset, entry + 12);
  offset += data.length;
});
await writeFile(new URL("favicon.ico", publicDir), Buffer.concat([directory, ...images]));
await writeFile(new URL("favicon-32.png", publicDir), images[1]);
// iOS supplies the mask; flatten transparent corners to the logo background.
await sharp(Buffer.from(svg)).resize(180, 180).flatten({ background: "#faf9f6" })
  .png().toFile(new URL("apple-touch-icon.png", publicDir).pathname);
