const AboutUsModal = () => {
  return (
    <div className="min-h-screen  text-gray-400 p-10 font-mono overflow-hidden">
      <h1 className="text-4xl text-purple-400 mb-6">About Us</h1>
      <p className="mb-4">
        We are a team of developers, designers, and dreamers passionate about
        creating interactive 3D experiences for the web. Our mission is to bring
        imagination to life through immersive visuals and innovative
        technologies.
      </p>
      <p className="mb-4">
        With backgrounds in 3D animation, creative coding, and user experience
        design, we craft experiences that are not only functional but also
        beautiful.
      </p>
      <p className="mb-4">
        Whether it’s data visualization, artistic installations, or product
        showcases, we strive to blend creativity and code seamlessly.
      </p>

      <div className="mt-10">
        <h2 className="text-xl text-purple-300 mb-2">Our Values</h2>
        <ul className="list-disc list-inside space-y-1 text-white/80">
          <li>Creativity through code</li>
          <li>User-first design</li>
          <li>Performance matters</li>
          <li>Open collaboration</li>
        </ul>
      </div>
    </div>
  );
};
export default AboutUsModal;
