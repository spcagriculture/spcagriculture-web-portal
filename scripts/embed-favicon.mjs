import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const jpegPath = path.join(root, "public", "council logo.jpeg");
const outPath = path.join(root, "public", "favicon.svg");

const b64 = fs.readFileSync(jpegPath).toString("base64");
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <clipPath id="c">
      <circle cx="50" cy="50" r="50" />
    </clipPath>
  </defs>
  <g clip-path="url(#c)">
    <g transform="translate(50 50) scale(1.5) translate(-50 -50)">
      <image
        href="data:image/jpeg;base64,${b64}"
        width="100"
        height="100"
        preserveAspectRatio="xMidYMid slice"
      />
    </g>
  </g>
</svg>
`;

fs.writeFileSync(outPath, svg, "utf8");
console.log("Wrote", outPath, `(${Math.round(svg.length / 1024)} KB)`);
