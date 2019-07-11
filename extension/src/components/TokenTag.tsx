import React, { useState } from "react";
//  import ReactDOM from "react-dom";
import { Token } from "../parseTokens";
import TokenModal from "./TokenModal";

interface Props {
  domNode: HTMLDivElement;
  images: Array<string>;
  isDisabled: boolean;
  token: Token;
  onToggleDisabled: Function;
}

export default function TokenTag(props: Props) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <div
      className={"__tokenTag" + modalVisible ? "__isOpen" : ""}
      data-token={props.token.value}
      onClick={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <div className="__tokenTagArrow" />
      {modalVisible ? (
        <TokenModal
          images={props.images}
          isDisabled={props.isDisabled}
          onToggleDisabled={props.onToggleDisabled}
        />
      ) : null}
    </div>
  );
}
