import * as React from "../lib/react";
const { useState } = React;

interface Props {
  isSelected: boolean;
  src: string;
  onSelectImage: (url: string) => void;
}

// @ts-ignore: In extension
const selectedButtonImage = chrome.runtime.getURL("assets/selectedButton.png");

export default function TokenModalImage(props: Props) {
  const [style, setStyle] = useState({
    height: "inherit",
    marginLeft: "0px",
    marginTop: "0px",
    width: "inherit"
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoverTranslate, setHoverTranslate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const transformStyle = {
    transform: `translate(${isHovered ? hoverTranslate.x : 0}px, ${
      isHovered ? hoverTranslate.y : 0
    }px)`
  };

  const currentStyle = {
    ...style,
    ...transformStyle
  };

  return (
    <div
      className="__image"
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
    >
      <img
        className={"__memeImage" + (isLoaded ? " __loaded" : "__preload")}
        style={currentStyle}
        src={props.src}
        onLoad={evt => {
          const image = evt.target;
          const height = image.naturalHeight;
          const width = image.naturalWidth;

          const parentWidth = image.parentNode.offsetWidth;
          const parentHeight = image.parentNode.offsetHeight;

          let transformX = 0;
          let transformY = 0;

          let newStyle;
          if (height >= width) {
            newStyle = {
              height: "auto",
              marginLeft: "0px",
              marginTop: "0px",
              width: "100%"
            };

            // The width will be parentWidth, so calculate the height offset
            // that the UI will auto-scroll when hovered
            transformY = -(height * (parentWidth / width) - parentHeight);
          } else {
            const parentRatio = parentHeight / parentWidth;
            const imageRatio = height / width;

            if (parentRatio < imageRatio) {
              // Image is not wide enough to fill the space
              // We need to make it wide enough such that the
              // height will fill the space.
              // Hmm.....
              const newWidth = parentWidth / imageRatio;
              const newHeight = height * (newWidth / width);
              newStyle = {
                height: newHeight + "px",
                marginLeft: "0px",
                marginTop: "0px",
                width: newWidth + "px"
              };
              transformY = parentHeight - newHeight;
              transformX = parentWidth - newWidth;
            } else {
              // Image is wide enough to fill the space
              newStyle = {
                height: "100%",
                marginLeft: "0px",
                marginTop: "0px",
                width: "auto"
              };

              // The height will be parentHeight, so calculate the width offset
              // that the UI will auto-scroll when hovered
              transformX = -(width * (parentHeight / height) - parentWidth);
            }
          }
          setStyle(newStyle);
          setIsLoaded(true);
          setHoverTranslate({
            x: transformX,
            y: transformY
          });
        }}
        onClick={() => {
          props.onSelectImage(props.src);
        }}
      />
      <div
        className={
          "__selectButton" +
          (props.isSelected ? " __selected" : " __unselected")
        }
      >
        {props.isSelected ? <img src={selectedButtonImage} /> : null}
      </div>
    </div>
  );
}
