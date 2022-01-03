import { useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { ProjectData } from "../../types/main.type";
import styles from "./projects.module.css";
import { FaChevronCircleRight, FaLink, FaGithubAlt } from "react-icons/fa";
import MainButton from "../widgets/mainbutton";

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<ProjectData[]>([
    { name: "test" },
    { name: "test2" },
    { name: "test3" },
    { name: "test4" },
  ]);

  const onDragEndHandler = (result: DropResult) => {
    if (!result.destination) return;

    const temp = [...projects];
    temp.splice(result.source.index, 1);
    temp.splice(result.destination.index, 0, projects[result.source.index]);

    setProjects(temp);
  };

  return (
    <section id="projects" className={styles.section}>
      <h1 className={styles.title}>Projects</h1>
      <div className={styles.save_create_container}>
        <MainButton contrast>Create New Project</MainButton>
        <MainButton>Save Changes</MainButton>
      </div>
      <DragDropContext onDragEnd={onDragEndHandler}>
        <Droppable droppableId="projects">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={styles.projects_container}
            >
              {projects.map((project, i) => (
                <Draggable
                  index={i}
                  key={project.name + i}
                  draggableId={project.name + i}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.dragHandleProps}
                      {...provided.draggableProps}
                      className={styles.project_draggable}
                    >
                      <div>
                        <h1>{project.name}</h1>
                        <p>
                          This is a description that could be very very long
                          about this project. Let's assume that it actually gets
                          this long holy crap? asdf Whit shtia asdf asdf
                          asddddddddd asdf asdfs asdfdddddddddddddddddddd
                        </p>
                      </div>
                      <div className={styles.row}>
                        <a href="" className={styles.icon_button}>
                          <FaLink size={20} />
                        </a>
                        <a href="" className={styles.icon_button}>
                          <FaGithubAlt size={20} />
                        </a>
                      </div>
                      <a href="" className={styles.icon_button}>
                        <FaChevronCircleRight size={25} />
                      </a>

                      <div role="menubar" className={styles.drag} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </section>
  );
};

export default Projects;
