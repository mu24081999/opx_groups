/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";

import {
  faCss3,
  faGitAlt,
  faHtml5,
  faJsSquare,
  faPython,
  faReact,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loader from "react-loaders";

import AnimatedLetters from "../AnimatedLetters";
import "./index.scss";

const About = () => {
  const aboutArray = "About Me".split("");

  const [letterClass, setLetterClass] = useState("text-animate");

  useEffect(() => {
    const timer = setTimeout(() => {
      setLetterClass("text-animate-hover");
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="container about-page">
        <div className="text-zone">
          <h1>
            <AnimatedLetters
              letterClass={letterClass}
              strArray={aboutArray}
              idx={15}
            />
          </h1>

          <p>
            I’m a Full stack and DevOps with over 3 years of experience, With a
            deep understanding of front-end and back-end development, I
            specialize in building dynamic, scalable web applications. I excel
            at creating seamless user experiences with React and have strong
            skills in developing RESTful APIs and handling databases
          </p>
          <p>
            I’m passionate about solving real-world problems through innovative
            technology and continuously learning to stay ahead of industry
            trends. Whether it's streamlining infrastructure or building
            scalable applications, I bring a holistic approach to every project.
          </p>
        </div>

        <div className="stage-cube-cont">
          <div className="cubespinner">
            <div className="face1">
              <FontAwesomeIcon icon={faPython} color="#4B8BBE" />
            </div>
            <div className="face2">
              <FontAwesomeIcon icon={faHtml5} color="#F06529" />
            </div>
            <div className="face3">
              <FontAwesomeIcon icon={faCss3} color="#28A4D9" />
            </div>
            <div className="face4">
              <FontAwesomeIcon icon={faReact} color="#5ED4F4" />
            </div>
            <div className="face5">
              <FontAwesomeIcon icon={faJsSquare} color="#EFD81D" />
            </div>
            <div className="face6">
              <FontAwesomeIcon icon={faGitAlt} color="#EC4D28" />
            </div>
          </div>
        </div>
      </div>

      <Loader type="pacman" />
    </>
  );
};

export default About;
