import React from 'react';
import heroImg from '../assets/anniversary_hero.gif';
import ProjectPageTemplate from './ProjectPageTemplate';

const ProjectPageNoise2Ink: React.FC = () => {
  const descriptionContent = (
    <>
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
    </>
  );

  return (
    <ProjectPageTemplate
      title="Anniversary Gift"
      heroImage={heroImg}
      imageAlt="Anniversary Album Cover"
      githubUrl="https://github.com/menshguy/frame_project_sockets"
      siteUrl=""
      siteLinkText="Site (WIP)"
      tools={['Raspberry Pi', 'After Effects', 'Sockets', 'Acrylics']}
      descriptionContent={descriptionContent}
    />
  );
};

export default ProjectPageNoise2Ink;