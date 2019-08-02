import * as React from "../lib/react";
import TokenModalImage from "./TokenModalImage";
import isValidUrl from "../util/isValidUrl";
import getGithubContext from "../shared/auth/getGithubContext";
const { useState, useRef, useEffect } = React;

interface Props {
  formIsAbsolutelyPositioned: boolean;
  images: Array<string>;
  isDisabled: boolean;
  selectedIndex: number;
  tokenValue: string;
  onAddNewImage?: (
    url: string
  ) => Promise<{ status: boolean; image_url: string }>;
  onLogIn: Function;
  onToggleDisabled: Function;
  onSelectImage: (url: string) => void;
}

enum NewUrlSubmitState {
  NOT_SUBMITTING,
  SUBMITTING,
  FAILED,
  SUCCEEDED
}

interface ExternalLink {
  url: string;
  label: string;
}

const AddNewLinks: Array<ExternalLink> = [
  {
    url: "https://images.google.com",
    label: "Google Images"
  },
  {
    url: "https://imgflip.com/memegenerator",
    label: "Imgflip"
  },
  {
    url: "https://makeameme.org/memegenerator",
    label: "Make A Meme"
  },
  {
    url: "https://imgur.com/memegen",
    label: "Imgur"
  }
];

export default function TokenModal(props: Props) {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [newUrlSubmitState, setNewUrlSubmitState] = useState(
    NewUrlSubmitState.NOT_SUBMITTING
  );
  const [expandedImageUrl, setExpandedImageUrl] = useState(null);
  const [expandedImageHeight, setExpandedImageHeight] = useState(-1);

  const canAddNewImage = !!props.onAddNewImage;
  const modalImagesRef = useRef();
  const pageContext = getGithubContext();

  function handleAddNew() {
    setIsAddingNew(true);
  }

  useEffect(() => {
    if (expandedImageUrl && modalImagesRef.current) {
      modalImagesRef.current.scrollTop = 0;
    }
  }, [expandedImageUrl]);

  function renderImages() {
    return (
      <div
        className={
          "__tokenTagModalImages" + (!!expandedImageUrl ? " __expanded" : "")
        }
        style={
          expandedImageHeight > 0 ? { height: expandedImageHeight + "px" } : {}
        }
        ref={modalImagesRef}
      >
        {props.images.map((url, idx) => {
          const isSelected = idx === props.selectedIndex;
          return (
            <TokenModalImage
              isExpanded={expandedImageUrl && url === expandedImageUrl}
              isSelected={isSelected}
              src={url}
              onSelectImage={props.onSelectImage}
              onToggleExpanded={(imgUrl: string, imageHeight: number) => {
                if (expandedImageUrl === imgUrl) {
                  setExpandedImageUrl(null);
                  setExpandedImageHeight(-1);
                } else {
                  setExpandedImageUrl(imgUrl);
                  setExpandedImageHeight(imageHeight);
                }
              }}
            />
          );
        })}
        {props.images.length % 2 !== 0 ? <div className="__image" /> : null}) }
        {!canAddNewImage ? (
          <div className="loginMessage">
            <button
              className="loginButton"
              onClick={() => {
                props.onLogIn();
              }}
            >
              Log In
            </button>{" "}
            with Github to remember your selection
            {pageContext ? (
              <>
                <span> and see memes from others in </span>
                <strong>{pageContext}</strong>
              </>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  }

  function renderEmpty() {
    return (
      <div className="__tokenModalEmpty">
        No memes found for <strong>/{props.tokenValue}</strong>
      </div>
    );
  }

  function renderAddNew() {
    let content;

    if (canAddNewImage) {
      switch (newUrlSubmitState) {
        case NewUrlSubmitState.FAILED:
        case NewUrlSubmitState.NOT_SUBMITTING:
          content = (
            <div>
              <div>
                To add a new meme for <strong>/{props.tokenValue}</strong>,
                enter the URL to the image below. If you'd like to find or make
                a meme, you can use one of these sites
              </div>
              <div className="thirdPartySiteLinks">
                {AddNewLinks.map(linkInfo => {
                  return (
                    <a href={linkInfo.url} target="_blank">
                      {linkInfo.label}
                    </a>
                  );
                })}
              </div>
              <input
                type="text"
                placeholder="Enter image URL"
                value={newUrl}
                style={{ marginTop: "6px", width: "100%" }}
                onChange={evt => {
                  setNewUrl(evt.target.value);
                }}
              />

              {newUrlSubmitState === NewUrlSubmitState.FAILED ? (
                <div>
                  Failed to save image. Please check the URL and try again
                </div>
              ) : null}
            </div>
          );
          break;
        case NewUrlSubmitState.SUBMITTING:
          content = <div>Submitting new image, please wait</div>;
          break;
      }
    } else {
      content = <div>To add new memes you must be logged in.</div>;
    }

    return (
      <div className="__tokenTagModalAddNew">
        <div>Add new meme</div>
        {content}
      </div>
    );
  }

  const actionButton = canAddNewImage ? (
    <button
      onClick={async () => {
        setNewUrlSubmitState(NewUrlSubmitState.SUBMITTING);

        let urlToAdd = newUrl.toLowerCase();
        if (urlToAdd.indexOf("http://") === 0) {
          urlToAdd = urlToAdd.replace("http://", "https://");
        }

        const { status: success } = await props.onAddNewImage(urlToAdd);

        setNewUrlSubmitState(
          success ? NewUrlSubmitState.NOT_SUBMITTING : NewUrlSubmitState.FAILED
        );
        if (success) {
          setIsAddingNew(false);
        } else {
          alert(
            "Failed to add the new image. The hosting site may be preventing it from loading on Github.com." +
              " Please try to find the image on another web host."
          );
        }
      }}
      title={
        isValidUrl(newUrl)
          ? "Click to submit your awesome new meme"
          : "Cannot submit, the url you entered is not valid"
      }
      disabled={
        !isValidUrl(newUrl) ||
        newUrlSubmitState === NewUrlSubmitState.SUBMITTING
      }
    >
      Submit
    </button>
  ) : (
    <button
      onClick={() => {
        props.onLogIn();
      }}
    >
      Log In
    </button>
  );

  return (
    <div
      className={
        "__tokenTagModal" + (props.formIsAbsolutelyPositioned ? " __fixed" : "")
      }
    >
      {isAddingNew
        ? renderAddNew()
        : props.images.length > 0
        ? renderImages()
        : renderEmpty()}
      <div className="__tokenTagModalButtons">
        {isAddingNew ? (
          <>
            {actionButton}
            <button
              onClick={() => {
                setIsAddingNew(false);
              }}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            {props.images.some(url => url.indexOf("giphy.com") > -1) ? (
              <span className="_attribution">Powered by Giphy</span>
            ) : null}
            {props.images.length > 0 ? (
              <button onClick={props.onToggleDisabled}>
                {props.isDisabled ? "Enable Tag" : "Disable Tag"}
              </button>
            ) : null}

            <button onClick={handleAddNew}>{"Add New"}</button>
          </>
        )}
      </div>
    </div>
  );
}
