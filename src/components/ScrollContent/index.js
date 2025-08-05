import './index.scss'

export default function ScrollContent() {
  return (
    <div className="scroll-content">
      <section className="content-section hero">
        <h1>OPX Groups</h1>
        <p>Experience the dynamic logo animation as you scroll</p>
      </section>

      <section className="content-section company-brief">
        <h2>About OPX Groups</h2>
        <div className="brief-content">
          <div className="brief-text">
            <p>OPX Groups stands at the forefront of technological innovation, combining cutting-edge development with visionary design. We specialize in creating immersive digital experiences that push the boundaries of what's possible.</p>

            <div className="company-stats">
              <div className="stat">
                <span className="stat-number">150+</span>
                <span className="stat-label">Projects Delivered</span>
              </div>
              <div className="stat">
                <span className="stat-number">25+</span>
                <span className="stat-label">Enterprise Clients</span>
              </div>
              <div className="stat">
                <span className="stat-number">5+</span>
                <span className="stat-label">Years Experience</span>
              </div>
            </div>

            <p>Our expertise spans across web development, mobile applications, blockchain solutions, and interactive media. We transform complex ideas into elegant, user-centered digital solutions.</p>
          </div>

          <div className="brief-highlights">
            <h3>Core Services</h3>
            <ul>
              <li><span className="highlight-icon">⚡</span> Full-Stack Development</li>
              <li><span className="highlight-icon">🎨</span> UI/UX Design</li>
              <li><span className="highlight-icon">🔗</span> Blockchain Solutions</li>
              <li><span className="highlight-icon">📱</span> Mobile Applications</li>
              <li><span className="highlight-icon">🌐</span> Web3 Integration</li>
              <li><span className="highlight-icon">🚀</span> Digital Transformation</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="content-section">
        <h2>Innovation in Motion</h2>
        <p>Our 3D logo ring responds to your scroll, creating an immersive coin-like rotation effect with stunning particle animations.</p>
      </section>

      <section className="content-section">
        <h2>Dynamic Lighting</h2>
        <p>Move your mouse to see how the lighting dynamically follows your cursor, creating beautiful reflections on the OPX logos.</p>
      </section>

      <section className="content-section">
        <h2>Particle Effects</h2>
        <p>Watch as particles float upward, creating an atmospheric environment around the rotating logo ring.</p>
      </section>

      <section className="content-section">
        <h2>Responsive Design</h2>
        <p>The animation adapts beautifully to all screen sizes while maintaining its captivating visual appeal.</p>
      </section>

      <section className="content-section">
        <h2>Scroll More</h2>
        <p>Continue scrolling to see the full range of the coin rotation effect and lighting changes.</p>
      </section>

      <section className="content-section">
        <h2>Keep Going</h2>
        <p>The animation continues infinitely, providing endless visual interest as you explore the content.</p>
      </section>

      <section className="content-section final">
        <h2>Experience Complete</h2>
        <p>You've seen the full range of our OPX logo animation. The ring continues to rotate as you scroll back up!</p>
      </section>
    </div>
  )
}
