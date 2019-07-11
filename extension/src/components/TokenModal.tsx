import React from "react";

interface Props {
  images: Array<string>;
  isDisabled: boolean;
  selectedIndex: number;
  onToggleDisabled: Function;
  onSelectImage: (idx: number) => void;
}

export default function TokenModal(props: Props) {
  return (
    <div className="__tokenTagThumbnail">
      <div className="__tokenTagThumbnailImages">
        {props.images.map((url, idx) => {
          return (
            <img
              src={url}
              className={idx === props.selectedIndex ? "__selected" : ""}
              onClick={() => {
                props.onSelectImage(idx);
              }}
            />
          );
        })}
      </div>
      <div className="__tokenTagThumbnailButtons">
        <button onClick={props.onToggleDisabled}>
          {props.isDisabled ? "Enable Tag" : "Disable Tag"}
        </button>
      </div>
    </div>
  );
}
