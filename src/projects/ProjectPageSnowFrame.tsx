import React from 'react';
import heroVideo from '../assets/snowy_hero.mp4';
import ProjectPageTemplate from './ProjectPageTemplate';

const ProjectPageSnowFrame: React.FC = () => {
  const descriptionContent = (
    <>
      <p>
        A Birthday gift to my wife. 
      </p>
      <p>
        I used an old picture frame and a Raspberry Pi to create a little animated picture frame. I then used some acrylic
        sheets and paint to draw a layered image to give it some depth.
      </p>
    </>
  );

  return (
    <ProjectPageTemplate
      title="Snowy Afternoon"
      heroImage={heroVideo}
      imageAlt="Snowy Afternoon Picture Frame"
      githubUrl=""
      siteUrl=""
      siteLinkText=""
      tools={['Raspberry Pi', 'After Effects', 'Acrylics', 'p5xjs']}
      descriptionContent={descriptionContent}
    />
  );
};

export default ProjectPageSnowFrame;