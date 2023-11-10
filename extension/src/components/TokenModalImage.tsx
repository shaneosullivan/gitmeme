import * as React from "../lib/react";
const { useEffect, useRef, useState } = React;

interface Props {
  isSelected: boolean;
  isExpanded: boolean;
  src: string;
  index: number;
  onSelectImage: (url: string) => void;
  onToggleExpanded: (url: string, imgHeight: number) => void;
}

// @ts-ignore: In extension
const selectedButtonImage = chrome.runtime.getURL("assets/selectedButton.png");
// @ts-ignore: In extension
const expandButtonImage = chrome.runtime.getURL("assets/expandButton.png");
// @ts-ignore: In extension
const unexpandButtonImage = chrome.runtime.getURL("assets/collapseButton.png");

export default function TokenModalImage(props: Props) {
  const { index } = props;

  const [style, setStyle] = useState({
    marginLeft: "0px",
    marginTop: "0px",
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoverTranslate, setHoverTranslate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [imageSize, setImageSize] = useState({ height: 0, width: 0 });

  const sizeTimerRef = useRef(0);
  const imgRef = useRef(null as HTMLImageElement);

  const transformStyle = {
    transform: `translate(${isHovered ? hoverTranslate.x : 0}px, ${
      isHovered ? hoverTranslate.y : 0
    }px)`,
  };

  const root = React.useRef();

  function getParentSize() {
    if (root.current) {
      return {
        height: root.current.parentNode.offsetHeight,
        width: root.current.parentNode.offsetWidth,
      };
    }
    return { height: 0, width: 0 };
  }
  let expandedStyle = {};
  if (props.isExpanded && root.current) {
    const parentWidth = getParentSize().width;
    expandedStyle = {
      height: "auto",
      width: parentWidth + "px",
      zIndex: 10,
    };
  }

  const currentStyle = {
    ...style,
    ...(props.isExpanded ? expandedStyle : transformStyle),
  };

  // We need to know the dimensions of the gif before it is fully loaded.
  // Once a single frame is loaded, we know the dimensions, so run an interval
  // to keep checking the size of the image, and cancel the interval when this
  // happens
  useEffect(() => {
    if (!sizeTimerRef.current && !isLoaded) {
      sizeTimerRef.current = setInterval(() => {
        const img = imgRef.current as HTMLImageElement;
        if (img && !isLoaded) {
          if (img.width > 0 && img.height > 0) {
            updateImgSize();
          }
        }
      }, 100);
    } else if (isLoaded) {
      clearInterval(sizeTimerRef.current);
    }
  }, [isLoaded]);

  function updateImgSize() {
    const image = imgRef.current;
    const height = image.naturalHeight || image.height;
    const width = image.naturalWidth || image.width;

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
        width: "100%",
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
          width: newWidth + "px",
        };
        transformY = parentHeight - newHeight;
        transformX = parentWidth - newWidth;
      } else {
        // Image is wide enough to fill the space
        newStyle = {
          height: "100%",
          marginLeft: "0px",
          marginTop: "0px",
          width: "auto",
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
      y: transformY,
    });
    setImageSize({ height, width });
  }

  return (
    <div
      className={
        "__image" +
        (props.isExpanded ? " __expanded" : "") +
        (isLoaded ? " __loaded" : "") +
        (props.isSelected ? " __selected" : "")
      }
      ref={root}
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
    >
      <img
        className={"__memeImage" + (isLoaded ? " __loaded" : " __preload")}
        style={currentStyle}
        src={props.src}
        ref={imgRef}
        onLoad={() => {
          if (!isLoaded) {
            updateImgSize();
          }
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
        onClick={() => {
          props.onSelectImage(props.src);
        }}
      >
        {props.isSelected ? <img src={selectedButtonImage} /> : null}
      </div>

      <button
        className={
          "__toggleExpandButton" +
          (props.isExpanded ? " __expanded" : " __notexpanded")
        }
        onClick={() => {
          // Calculate the height of the image
          const height =
            imageSize.height * (getParentSize().width / imageSize.width);

          props.onToggleExpanded(props.src, height);
        }}
      >
        {
          <img
            src={props.isExpanded ? unexpandButtonImage : expandButtonImage}
          />
        }
      </button>
    </div>
  );
}
