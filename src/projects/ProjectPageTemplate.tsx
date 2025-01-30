import React, { ReactNode } from 'react';
import styles from './ProjectPageTemplate.module.css';

interface ProjectPageTemplateProps {
  title: string;
  heroImage: string;
  imageAlt: string;
  githubUrl: string;
  siteUrl: string;
  siteLinkText: string;
  tools: string[];
  descriptionContent: ReactNode;
}

const ProjectPageTemplate: React.FC<ProjectPageTemplateProps> = ({
  title,
  heroImage,
  imageAlt,
  githubUrl,
  siteUrl,
  siteLinkText,
  tools,
  descriptionContent,
}) => {
  const isVideo = heroImage.endsWith('.mp4') || heroImage.endsWith('.webm');

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.imageContainer}>
          {isVideo ? (
            <video
              src={heroImage}
              className={styles.image}
              autoPlay
              loop
              muted
              playsInline
            />
          ) : (
            <img
              src={heroImage}
              alt={imageAlt}
              className={styles.image}
            />
          )}
        </div>
        <div className={styles.description}>
          <h1 className={styles.title}>{title}</h1>
          <div className={styles.links}>
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                GitHub
              </a>
            )}
            {siteUrl && (
              <a
                href={siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                {siteLinkText}
              </a>
            )}
          </div>
          {tools && (
            <div className={styles.tools}>
              {tools.map((tool, i) => (
                <span className={styles.tool} key={i}>{tool}</span>
              ))}
            </div>
          )}
          {descriptionContent}
        </div>
      </div>
    </div>
  );
};

export default ProjectPageTemplate;