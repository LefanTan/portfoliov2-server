import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { FaChevronCircleRight, FaGithubAlt, FaLink } from "react-icons/fa";
import { Link } from "react-router-dom";
import { ProjectData } from "../../types/main.type";
import styles from "./projectdraggable.module.css";

interface ProjectDraggableProps {
  index: number;
  draggableId: string;
  project: ProjectData;
}

const ProjectDraggable: React.FC<ProjectDraggableProps> = (props) => {
  let project = props.project;

  return (
    <Draggable index={props.index} draggableId={props.draggableId}>
      {(provided, snapshot) => (
        <div
          tabIndex={props.index}
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
          className={styles.project_draggable}
        >
          <div>
            <h1>{props.project.title}</h1>
            <p>{props.project.shortDescription}</p>
          </div>
          <div className={styles.row}>
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                aria-label="website"
                className={styles.icon_button}
              >
                <FaLink size={20} />
              </a>
            )}
            {project.repo && (
              <a
                href={project.repo}
                target="_blank"
                rel="noreferrer"
                className={styles.icon_button}
                aria-label="github"
              >
                <FaGithubAlt size={20} />
              </a>
            )}
          </div>
          <Link
            to={`/project/${project.id}`}
            aria-label="project details"
            className={styles.icon_button}
          >
            <FaChevronCircleRight size={25} />
          </Link>

          <div role="menubar" className={styles.drag} />
        </div>
      )}
    </Draggable>
  );
};

export default ProjectDraggable;
