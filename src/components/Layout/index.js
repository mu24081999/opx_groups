import './index.scss'

const Layout = ({ children }) => {
  return (
    <div className="App">
      <div className="page">
        <span className="tags top-tags">&lt;body&gt;</span>

        {children}
        <span className="tags bottom-tags">
          <div id="stars"></div>
          <div id="stars2"></div>
          <div id="stars3"></div>
          &lt;/body&gt;
          <br />
          <span className="bottom-tag-html">&lt;/html&gt;</span>
        </span>
      </div>
    </div>
  )
}

export default Layout
