import React from 'react';
import heroImg from '../assets/anniversary_hero.gif';
import ProjectPageTemplate from './ProjectPageTemplate';

const ProjectPageNoise2Ink: React.FC = () => {
  const descriptionContent = (
    <>
      <p>
        This photo album was a birthday gift to my wife. It uses a Raspberry Pi and sockets
        to create an interactive photo album. 
      </p>
      <p>
        All the photos are copies from a thumb drive. Whenever she wants to add new photos or
        albums she can simply add to the thumb drive and restart the pi.
      </p>
      <p>
        Each album represents a subway stop, and clicking a little button on top of the frame
        will navigate you to the next album.
      </p>
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