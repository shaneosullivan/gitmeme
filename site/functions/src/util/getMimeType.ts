export default function getMimeType(str: string): string | null {
  const periodIdx = str.lastIndexOf(".");
  const slashIdx = str.lastIndexOf("/");

  let fileExtension = "jpg";

  if (periodIdx > slashIdx) {
    fileExtension = str.substring(periodIdx + 1).toLowerCase();

    switch (fileExtension) {
      case "jpg":
      case "jpeg":
        return "image/jpeg";

      case "png":
        return "image/png";
      case "gif":
        return "image/gif";
    }
  }
  return null;
}
