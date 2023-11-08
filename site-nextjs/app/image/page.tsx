import { getStringValue } from "../../lib/util/getStringValue";
import InstallButton from "../InstallButton";
import styles from "../page.module.css";
import { useParams } from "next/navigation";

export default function ImagePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const imageUrl = getStringValue(searchParams.url);

  return (
    <div className={styles.page}>
      {imageUrl ? renderImage(imageUrl) : <div />}
    </div>
  );
}

function renderImage(imageUrl: string): React.ReactNode {
  return (
    <div>
      <div>
        Get the Gitmeme browser extension to add fun images like this one to
        your Github issues and pull requests
      </div>
      <div>
        <InstallButton />
      </div>
      <img src={imageUrl} />
    </div>
  );
}
