import * as React from "react";
import { Token } from "../parseTokens";
import TokenModal from "./TokenModal";

interface Props {
  caretActive: boolean;
  selectedImage: string;
  images: Array<string>;
  isDisabled: boolean;
  modalIsOpen: boolean;
  position: { top: number; left: number; width: number };
  token: Token;
  onSelectImage: (url: string) => void;
  onToggleDisabled: Function;
  onToggleModal: Function;
}

export default function TokenTag(props: Props) {
  const classes = ["__tokenTag"];

  classes.push(props.selectedImage ? "imageFound" : "imageNotFound");
  if (props.isDisabled) {
    classes.push("disabled");
  }
  if (props.modalIsOpen) {
    classes.push("__isOpen");
  }
  if (props.caretActive) {
    classes.push("__selected");
  }

  return (
    <div
      className={classes.join(" ")}
      data-token={props.token.value}
      style={{
        top: props.position.top - 19 + "px",
        left: props.position.left - 4 + "px",
        width: props.position.width + 24 + "px"
      }}
    >
      <div
        className="__tokenTagArrow"
        onClick={() => {
          props.onToggleModal();
        }}
      >
        <div className="__inner" />
      </div>
      {props.modalIsOpen ? (
        <TokenModal
          images={props.images}
          isDisabled={props.isDisabled}
          selectedIndex={props.images.indexOf(props.selectedImage)}
          onToggleDisabled={props.onToggleDisabled}
          onSelectImage={props.onSelectImage}
        />
      ) : null}
    </div>
  );
}
