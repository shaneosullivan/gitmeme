export default function getGithubContext() {
  const url = typeof window !== undefined ? window.location.href : "";
  if (!url) {
    return null;
  }
  const domain = "github.com";
  const idx = url.indexOf(domain);
  if (idx < 0) {
    return null;
  }
  return url.substring(idx + domain.length + 1).split("/")[0];
}
