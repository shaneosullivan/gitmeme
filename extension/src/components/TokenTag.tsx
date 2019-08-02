import * as React from "../lib/react";
import { Token } from "../parseTokens";
import TokenModal from "./TokenModal";

interface Props {
  caretActive: boolean;
  formIsAbsolutelyPositioned: boolean;
  selectedImage: string;
  images: Array<string>;
  isDisabled: boolean;
  modalIsOpen: boolean;
  position: { top: number; left: number; width: number };
  token: Token;
  trimBottom: number;
  trimTop: number;
  onLogIn: Function;
  onSelectImage: (url: string) => void;
  onAddNewImage?: (
    url: string
  ) => Promise<{ status: boolean; image_url: string }>;
  onToggleDisabled: Function;
  onToggleModal: Function;
}

const DEFAULT_HEIGHT = 21;

export default function TokenTag(props: Props) {
  const [arrowHovered, setArrowHovered] = React.useState(false);
  const classes = ["__tokenTag"];

  classes.push(props.selectedImage ? "imageFound" : "imageNotFound");
  if (props.isDisabled) {
    classes.push("__disabled");
  }
  if (props.modalIsOpen) {
    classes.push("__isOpen");
  }
  if (props.caretActive) {
    classes.push("__selected");
  }
  if (arrowHovered) {
    classes.push("__arrowHovered");
  }

  let top = props.position.top - DEFAULT_HEIGHT + 2;

  const style: { [key: string]: string } = {
    top: top + "px",
    left: props.position.left - 4 + "px",
    width: props.position.width + 5 + "px"
  };

  if (props.trimTop) {
    style.height = DEFAULT_HEIGHT - props.trimTop + "px";
    top += props.trimTop;
    style.top = top + "px";
    classes.push("__topTrimmed");
  } else if (props.trimBottom) {
    style.height = DEFAULT_HEIGHT - props.trimBottom + "px";
    classes.push("__bottomTrimmed");
  }

  let title;
  if (!props.modalIsOpen) {
    if (props.isDisabled) {
      title = `GitMeme image disabled`;
    } else if (props.selectedImage) {
      const addition = props.caretActive
        ? "Click or press the UP arrow to see the meme image or to select others"
        : "Click to see the meme image or to select others";
      title = `GitMeme for "${props.token.value}". ${addition}`;
    } else {
      title = `GitMeme for "${props.token.value}" not found`;
    }
  }

  return (
    <div
      className={classes.join(" ")}
      data-token={props.token.value}
      style={style}
      title={title}
    >
      <div
        className="__tokenTagArrow"
        onClick={() => {
          props.onToggleModal();
        }}
        onMouseEnter={() => {
          setArrowHovered(true);
        }}
        onMouseOut={() => {
          setArrowHovered(false);
        }}
      >
        <div className="__inner" />
      </div>
      {props.modalIsOpen ? (
        <TokenModal
          formIsAbsolutelyPositioned={props.formIsAbsolutelyPositioned}
          images={props.images}
          isDisabled={props.isDisabled}
          selectedIndex={props.images.indexOf(props.selectedImage)}
          tokenValue={props.token.value}
          onAddNewImage={props.onAddNewImage}
          onLogIn={props.onLogIn}
          onToggleDisabled={props.onToggleDisabled}
          onSelectImage={props.onSelectImage}
        />
      ) : null}
    </div>
  );
}
