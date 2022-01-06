import { useContext, useEffect, useState } from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { ProjectData } from "../../types/main.type";
import styles from "./projects.module.css";
import MainButton from "../widgets/mainbutton";
import { AuthContext } from "../../providers/auth.provider";
import { getProjects, updateProject } from "../../services/main.service";
import ProjectDraggable from "../widgets/projectdraggable";
import { useNavigate } from "react-router-dom";
import { AxiosResponse } from "axios";
import Loading from "../widgets/loading";

const Projects: React.FC = () => {
  const navigation = useNavigate();
  const authContext = useContext(AuthContext);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    if (!authContext.user) return;

    getProjects(authContext.user?.id)
      .then((projects) =>
        setProjects(projects.sort((a, b) => a.order - b.order))
      )
      .catch((err) => console.error(err));
  }, [authContext]);

  const onDragEndHandler = (result: DropResult) => {
    if (!result.destination) return;

    const temp = [...projects];
    temp.splice(result.source.index, 1);
    temp.splice(result.destination.index, 0, projects[result.source.index]);

    setProjects(temp);
  };

  const saveChangesHandler = async () => {
    const updateTasks: Promise<AxiosResponse>[] = [];
    projects.forEach((project, index) => {
      const orderedProj = { ...project };
      orderedProj.order = index;
      updateTasks.push(updateProject(orderedProj.id, orderedProj));
    });

    setSaveLoading(true);
    await Promise.all(updateTasks);
    setSaveLoading(false);
  };

  const creatProjectHandler = () => {
    navigation("/project/create", { replace: true });
  };

  return (
    <section id="projects" className={styles.section}>
      <h1 className={styles.title}>Projects</h1>
      <div className={styles.save_create_container}>
        <MainButton onclick={creatProjectHandler} contrast>
          Create New Project
        </MainButton>
        <MainButton onclick={saveChangesHandler} style={{ minWidth: "5rem" }}>
          {saveLoading ? <Loading size={20} /> : "Save Changes"}
        </MainButton>
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
                <ProjectDraggable
                  key={project.title + i}
                  index={i}
                  draggableId={project.title + i}
                  project={project}
                />
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
