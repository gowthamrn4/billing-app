import React from "react";

type Props = {
  size: String;
  color?: String;
};

const TickIcon = ({ size, color }: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 50 50"
      width={`${size}`}
      height={`${size}`}
    >
        <path
          fill="#c8e6c9"
          d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"
        />
        <path
          fill="#4caf50"
          d="M34.586,14.586l-13.57,13.586l-5.602-5.586l-2.828,2.828l8.434,8.414l16.395-16.414L34.586,14.586z"
        />
    </svg>
  );
};

export default TickIcon;
