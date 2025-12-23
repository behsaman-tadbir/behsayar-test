const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

function resolveRepoName() {
  const githubRepo = process.env.GITHUB_REPOSITORY;
  if (githubRepo) {
    const parts = githubRepo.split("/");
    return parts[parts.length - 1];
  }

  const packagePath = path.join(__dirname, "package.json");
  if (fs.existsSync(packagePath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(packagePath, "utf8"));
      if (pkg.name) {
        return pkg.name;
      }
    } catch (error) {}
  }

  try {
    const remoteUrl = execSync("git config --get remote.origin.url", {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();

    const match = remoteUrl.match(/[:/]([^/]+?)(?:\.git)?$/);
    if (match && match[1]) {
      return match[1];
    }
  } catch (error) {}

  return path.basename(path.resolve(__dirname));
}

const repoName = resolveRepoName();
const basePath = `/${repoName}`;

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath,
  assetPrefix: `${basePath}/`,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

module.exports = nextConfig;
