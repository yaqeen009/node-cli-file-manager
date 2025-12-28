import https from "https";
import http from "http";
import path from "path";
import fs from "fs";
import { urlValidator } from "../utils/fileHelper.js";

const MAX_FILE_SIZE = 10 * 1024 * 1024 * 1024; // 10GB
const MAX_REDIRECTS = 5;

export const download = async (args = []) => {
  const [url, outputName] = args;

  if (!url || !urlValidator(url)) {
    console.error("Enter a valid URL");
    return;
  }

  const parsedURL = new URL(url);

  const fileName =
    outputName || path.basename(parsedURL.pathname) || "downloaded-file";

  let downloadedBytes = 0;
  let totalBytes = 0;
  let redirects = 0;

  const startDownload = (downloadUrl, startByte = 0) => {
    const { protocol } = new URL(downloadUrl);
    const client = protocol === "https:" ? https : http;

    const options = {
      headers: startByte ? { Range: `bytes=${startByte}-` } : {},
    };

    const req = client.get(downloadUrl, options, (res) => {
      /* ---------- Redirects ---------- */
      if (
        res.statusCode >= 300 &&
        res.statusCode < 400 &&
        res.headers.location
      ) {
        if (++redirects > MAX_REDIRECTS) {
          console.error("Too many redirects");
          return;
        }

        const nextUrl = res.headers.location.startsWith("http")
          ? res.headers.location
          : new URL(res.headers.location, downloadUrl).href;

        return startDownload(nextUrl, startByte);
      }

      /* ---------- Status validation ---------- */
      if (![200, 206].includes(res.statusCode)) {
        console.error("Failed to download. Status:", res.statusCode);
        res.resume();
        return;
      }

      totalBytes =
        parseInt(res.headers["content-length"] || "0") + startByte;

      if (totalBytes > MAX_FILE_SIZE) {
        console.error("File exceeds limit. Cancelling download.");
        req.destroy();
        return;
      }

      const fileStream = fs.createWriteStream(fileName, {
        flags: startByte ? "a" : "w",
      });

      res.on("data", (chunk) => {
        downloadedBytes += chunk.length;

        const percent = totalBytes
          ? ((downloadedBytes / totalBytes) * 100).toFixed(2)
          : "0";

        process.stdout.write(
          `\rDownloading: ${percent}% (${(
            downloadedBytes /
            (1024 * 1024)
          ).toFixed(2)} MB)`
        );
      });

      res.pipe(fileStream);

      fileStream.on("finish", () => {
        fileStream.close();
        console.log("\nDownload finished:", fileName);
      });

      fileStream.on("error", (err) => {
        console.error("File write error:", err.message);
      });
    });

    req.on("error", (err) => {
      console.error("Request error:", err.message);
    });
  };

  /* ---------- Resume ---------- */
  let existingSize = 0;
  if (fs.existsSync(fileName)) {
    existingSize = fs.statSync(fileName).size;
    downloadedBytes = existingSize;
    console.log("Resuming download...");
  }

  startDownload(url, existingSize);
};
