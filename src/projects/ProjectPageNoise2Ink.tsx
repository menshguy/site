import React from 'react';
import heroImg from '../assets/n2i_hero_large.png';
import ProjectPageTemplate from './ProjectPageTemplate';

const ProjectPageNoise2Ink: React.FC = () => {
  const descriptionContent = (
    <>
      <p>
        Noise to Ink is a project that empowers Generative Artists to monetize their creations
        by selling physical prints on various productions and mediums.
      </p>
      <p>
        Traditionally, Generative artists sell their artwork as NFTs. If they want to sell their artwork as prints, they
        are forced to generate a select few images and add them to online marketplaces like Etsy, Redbubble, etc. This destroys
        one of the main benefits of Generative Art - the ability to create an unlimited number of totally unique pieces, meaning each
        customer gets their own unique "1 of 1" piece. 
      </p>
      <p>
        "Noise to ink" aims to solve this issue by giving artist their own space to create and edit their artwork, and share it
        with their followings.
      </p>
      <p>
        The main features include:
      </p>
      <ul>
        <li><strong>In-Browser Code Editor:</strong> Artists can create and edit their artwork directly in the browser. </li>
        <li><strong>Link Sharing:</strong> Artists can generate a shareable link that they can post anywhere - Twitter/X, Reddit, Instagram, etc.</li>
        <li>
          <strong>Sell Prints:</strong> Noise to Ink connects to a Print service API, where customers can purchase a print of the artwork they generate.
          Artists are free to customize which products they sell, how much profit/markup they want to charge, and how customers can interact with their piece.
        </li>
      </ul>
    </>
  );

  return (
    <ProjectPageTemplate
      title="Noise to Ink (WIP)"
      heroImage={heroImg}
      imageAlt="Noise to Ink Project"
      githubUrl="https://github.com/menshguy/noisetoink"
      siteUrl="https://www.noisetoink.com/"
      siteLinkText="Site (WIP)"
      tools={['React', 'Next.js', 'Node.js', 'Express', 'MongoDB', 'Mongoose', 'p5xjs']}
      descriptionContent={descriptionContent}
    />
  );
};

export default ProjectPageNoise2Ink;