//list-group
import React, { useState } from "react";
import { TopTokenItem } from "../types";
import "../style/bootstrap.min.css";
import copyToClipboard from "../util/copyToClipboard";
import formatNumber from "format-number";
import "./ListWithBadges.css";
import "./token.css";

interface Props {
  emptyMessage?: React.ReactNode;
  label: string;
  items: Array<TopTokenItem>;
}

const commaFormat = formatNumber({});

export default function ListWithBadges(props: Props) {
  const [copiedIdx, setCopiedIdx] = useState(-1);
  return (
    <div className="ListWithBadges">
      <div className="listHeader">
        <span className="listLabel">{props.label}</span>
        {props.items.length > 0 ? (
          <span className="timesUsed">Times used</span>
        ) : null}
      </div>
      {props.items.length > 0
        ? renderList(props, copiedIdx, setCopiedIdx)
        : renderEmpty(props)}
    </div>
  );
}

function renderList(
  props: Props,
  copiedIdx: number,
  setCopiedIdx: Function
): React.ReactNode {
  function selectInputContents(evt: any) {
    const node = evt.target as HTMLInputElement;
    const nodeIdx = parseInt(node.getAttribute("data-idx") || "-1", 0);
    const text = props.items[nodeIdx].token;
    copyToClipboard(`/${text}`);
    setCopiedIdx(nodeIdx);

    evt.preventDefault();
  }
  return (
    <ul className="list-group">
      {props.items.map((tokenItem: TopTokenItem, idx: number) => {
        return (
          <li className="list-group-item d-flex align-items-left" key={idx}>
            <span className="idx">{idx + 1}.</span>
            <span
              className="token"
              data-idx={idx}
              onClick={selectInputContents}
            >
              /{tokenItem.token}
            </span>
            {copiedIdx === idx ? (
              <span className="copiedText">Copied!</span>
            ) : null}
            <span className="count">{commaFormat(tokenItem.count)}</span>
          </li>
        );
      })}
    </ul>
  );
}

function renderEmpty(props: Props) {
  return (
    <div className="emptyList">
      {props.emptyMessage || (
        <span>
          <strong>{props.label}</strong>: No memes found, try choosing from
          another list!
        </span>
      )}
    </div>
  );
}
