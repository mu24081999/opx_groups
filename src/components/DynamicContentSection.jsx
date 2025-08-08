import React from "react";

const DynamicContentSection = ({ title, desc, align }) => {
  const isRight = align === "right";

  return (
    <div
      className={`flex items-center justify-around relative h-screen px-4 flex-col md:flex-row ${
        isRight ? "md:flex-row-reverse" : ""
      }`}
    >
      {/* Heading */}
      <h1 className="text-6xl md:text-7xl font-mono text-[#888] uppercase text-left leading-tight max-w-sm">
        {title.split("\n").map((line, i) => (
          <React.Fragment key={i}>
            {line}
            <br />
          </React.Fragment>
        ))}
      </h1>

      {/* Content */}
      <div
        className={`hidden max-w-sm opacity-60 md:block text-left text-sm font-mono text-gray-300 space-y-2  ${
          isRight ? "md:mr-16" : "md:ml-16"
        }`}
      >
        <p>{desc}</p>
      </div>
    </div>
  );
};

export default DynamicContentSection;
