import * as React from "react";
//  import ReactDOM from "react-dom";
import { Token } from "../parseTokens";
// import TokenModal from "./TokenModal";

interface Props {
  caretActive: boolean;
  selectedImage: string;
  images: Array<string>;
  isDisabled: boolean;
  position: { top: number; left: number; width: number };
  token: Token;
  onToggleDisabled: Function;
}

const useState = React.useState;

export default function TokenTag(props: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const classes = ["__tokenTag"];

  classes.push(props.selectedImage ? "imageFound" : "imageNotFound");
  if (props.isDisabled) {
    classes.push("disabled");
  }
  if (modalVisible) {
    classes.push("__isOpen");
  }
  if (props.caretActive) {
    classes.push("__selected");
  }

  return (
    <div
      className={classes.join(" ")}
      data-token={props.token.value}
      onClick={() => {
        setModalVisible(!modalVisible);
      }}
      style={{
        top: props.position.top + "px",
        left: props.position.left + "px",
        width: props.position.width + "px"
      }}
    >
      <div className="__tokenTagArrow" />
      {/* {modalVisible ? (
        <TokenModal
          images={props.images}
          isDisabled={props.isDisabled}
          onToggleDisabled={props.onToggleDisabled}
        />
      ) : null} */}
    </div>
  );
}
