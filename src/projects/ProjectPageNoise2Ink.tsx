import React from 'react';
import styles from './ProjectPageNoise2Ink.module.css';
import heroImg from '../assets/n2i_hero_large.png'

const ProjectPageNoise2Ink: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.imageContainer}>
          <img
            src={heroImg}
            alt="Noise to Ink Project"
            className={styles.image}
          />
        </div>
        <div className={styles.description}>
          <h1 className={styles.title}>Noise to Ink (WIP)</h1>
          <div className={styles.links}>
            <a
              href="https://github.com/menshguy/noisetoink"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              GitHub
            </a>
            <a
              href="https://www.noisetoink.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              Site (WIP)
            </a>
          </div>
          <p>
            Noise to Ink is an innovative project that offers the Generative Art community a space to quickly
            and easily share their artwork and sell their work as art prints.
          </p>
          <p>
            The main objectives of this project include:
          </p>
          <ul>
            <li><strong>In-Browser Code Editor:</strong> Artists can create and edit their artwork directly in the browser. </li>
            <li><strong>Link Sharing:</strong> Artists can generate a shareable link that they can share anywhere.</li>
            <li><strong>Sell Prints:</strong>Noise to Ink connects to a Print service, where customers can purchase a print of the artwork they generate.</li>
          </ul>
          
        </div>
      </div>
    </div>
  );
};

export default ProjectPageNoise2Ink;