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
      <h1
        className="text-6xl md:text-7xl font-mono text-[#888] uppercase text-left leading-tight max-w-sm"
        style={{
          textShadow: `
            0 4px 8px rgba(0, 0, 0, 0.3),
            0 2px 4px rgba(0, 0, 0, 0.2),
            0 1px 2px rgba(0, 0, 0, 0.1)
          `,
          background: 'linear-gradient(135deg, #888 0%, #666 50%, #444 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}
      >
        {title.split("\n").map((line, i) => (
          <React.Fragment key={i}>
            {line}
            <br />
          </React.Fragment>
        ))}
      </h1>

      {/* Content */}
      <div
        className={`hidden max-w-sm opacity-70 md:block text-left text-sm font-mono text-gray-300 space-y-3 ${
          isRight ? "md:mr-16" : "md:ml-16"
        }`}
        style={{
          background: 'linear-gradient(135deg, rgba(27, 26, 26, 0.6) 0%, rgba(40, 40, 40, 0.4) 100%)',
          backdropFilter: 'blur(10px)',
          padding: '2rem',
          borderRadius: '16px',
          border: '1px solid rgba(139, 92, 246, 0.1)',
          boxShadow: `
            0 8px 20px rgba(0, 0, 0, 0.2),
            0 4px 10px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.05)
          `,
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
        }}
      >
        {desc}
      </div>
    </div>
  );
};

export default DynamicContentSection;
