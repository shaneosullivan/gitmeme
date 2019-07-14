import * as React from "../lib/react";
const { useState } = React;

interface Props {
  images: Array<string>;
  isDisabled: boolean;
  selectedIndex: number;
  onToggleDisabled: Function;
  onSelectImage: (url: string) => void;
}

export default function TokenModal(props: Props) {
  const [style, setStyle] = useState({});
  useState({
    height: "inherit",
    marginLeft: "0px",
    marginTop: "0px",
    width: "inherit"
  });

  const selectedButtonImage = chrome.runtime.getURL(
    "assets/selectedButton.png"
  );

  return (
    <div className="__tokenTagModal">
      <div className="__tokenTagModalImages">
        {props.images.map((url, idx) => {
          const isSelected = idx === props.selectedIndex;
          return (
            <div className="__image">
              <img
                className="__memeImage"
                style={style}
                src={url}
                onLoad={evt => {
                  const image = evt.target;
                  const height = image.height;
                  const width = image.width;
                  console.log(idx, ": height", height, "width", width);
                  let newStyle;
                  if (height > width) {
                    newStyle = {
                      height: "inherit",
                      marginLeft: "0px",
                      marginTop: -((height - width) / 2) + "px",
                      width: "100%"
                    };
                  } else {
                    newStyle = {
                      height: "100%",
                      marginLeft: -((width - height) / 2) + "px",
                      marginTop: "0px",
                      width: "inherit"
                    };
                  }
                  setStyle(newStyle);
                }}
                onClick={() => {
                  props.onSelectImage(props.images[idx]);
                }}
              />
              <div
                className={
                  "__selectButton" +
                  (isSelected ? " __selected" : " __unselected")
                }
              >
                {isSelected ? <img src={selectedButtonImage} /> : null}
              </div>
            </div>
          );
        })}
      </div>
      <div className="__tokenTagModalButtons">
        <button onClick={props.onToggleDisabled}>
          {props.isDisabled ? "Enable Tag" : "Disable Tag"}
        </button>
      </div>
    </div>
  );
}
