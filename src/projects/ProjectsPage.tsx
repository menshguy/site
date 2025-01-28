import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';

const ProjectsPage = () => {

    return (
        <>
        <h1>Projects</h1>
        <div>
            <ul>
                <li><a href="projects/noise2Ink">Noise to Ink</a></li>
                {/* <li><a href="projects/todo">LLMS</a></li> */}
            </ul>
        </div>
        </>
    );
};

export default ProjectsPage;