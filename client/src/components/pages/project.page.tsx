import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createProject,
  deleteProject,
  getFileNameFromUrl,
  getProject,
  updateProject,
} from "../../services/main.service";
import { Media, ProjectData } from "../../types/main.type";
import styles from "./project.module.css";
import { FaArrowLeft, FaTrashAlt } from "react-icons/fa";
import CategoryInput from "../widgets/categoryinput";
import MainButton from "../widgets/mainbutton";
import * as Yup from "yup";
import { Formik } from "formik";
import FormError from "../widgets/formerror";
import Loading from "../widgets/loading";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import MediaDraggable from "../widgets/mediadraggable";
import AddMediaButton from "../widgets/addmediabutton";
import { AuthContext } from "../../providers/auth.provider";

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title required"),
  shortDescription: Yup.string().required("Short description required"),
});

const Project: React.FC = () => {
  const urlParams = useParams();
  const navigation = useNavigate();
  const authContext = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [isNew, setNew] = useState(false);
  const [project, setProject] = useState<ProjectData>();
  const [stack, setStack] = useState<string[]>([]);
  const [medias, setMedias] = useState<Media[]>([]);
  const [mainMedia, setMainMedia] = useState<Media>({ name: "" });
  const [submitError, setSubmitError] = useState<string>();

  /**
   * End drag handler for React-beautiful-dnd
   */
  const onDragEndHandler = (result: DropResult) => {};
  const goHome = () => navigation("/home", { replace: true });

  /**
   * Add media
   * @param files list of files to add as media
   */
  const addMedia = (files: FileList) => {
    const temp = [...Array.from(medias)];
    Array.from(files).forEach((file) => {
      if (medias.find((media) => media.name === file.name))
        alert(`File ${file.name} already added`);
      else temp.push({ file, name: file.name });
    });

    setMedias(temp);
  };

  /**
   * Delete media
   * @param toDelete specific media to delete
   */
  const deleteMedia = (toDelete: Media) => {
    if (mainMedia === toDelete) setMainMedia({ name: "" });

    setMedias(medias.filter((media) => media !== toDelete));
  };

  /**
   * When user wants to delete this project
   */
  const handleProjectDelete = () => {
    if (
      project &&
      window.confirm(
        "Are you sure you want to delete this project? All data will be erased"
      )
    ) {
      deleteProject(project?.id).then(() => goHome());
    }
  };

  useEffect(() => {
    if (!urlParams.id) {
      setNew(true);
      setLoading(false);
      return;
    }

    getProject(parseInt(urlParams.id))
      .then((project) => {
        setProject(project);

        let arrayStack = project.stack
          ? Array.isArray(project.stack)
            ? project.stack
            : [project.stack]
          : [];
        setStack(arrayStack);
        const fetchedMainMedia = {
          url: project.mainMediaUrl,
          name: project.mainMediaUrl
            ? getFileNameFromUrl(project.mainMediaUrl, true)
            : "",
        } as Media;

        setMainMedia(fetchedMainMedia);

        const fetchedMedias = [];
        if (project.mainMediaUrl) fetchedMedias.push(fetchedMainMedia);

        project.mediaUrls?.forEach((url) => {
          fetchedMedias.push({
            url: url,
            name: getFileNameFromUrl(url, true),
          } as Media);
        });

        setMedias(fetchedMedias);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div className="body">
      {loading ? (
        <main className="center">
          <Loading size={20} />
        </main>
      ) : (
        <>
          <header>
            <button onClick={goHome} className={styles.icon_button}>
              <FaArrowLeft size={25} />
              <h2>back</h2>
            </button>
          </header>
          <main className={styles.main}>
            <h1>{isNew ? "Create a" : "Update your"} Project</h1>
            <Formik
              validationSchema={validationSchema}
              enableReinitialize
              initialValues={{
                ...project,
                title: project?.title,
                shortDescription: project?.shortDescription,
                inProgress: project?.inProgress,
              }}
              onSubmit={async (values) => {
                const data = values as ProjectData;

                data.stack = stack;

                /* Files */
                data.mainMedia = mainMedia?.file;
                let mediaFiles: File[] = [];
                medias.forEach((media) => {
                  // Don't upload mainmedia
                  if (media.file && media.name !== mainMedia.name) {
                    mediaFiles.push(media.file);
                  }
                });
                data.medias = mediaFiles;

                /* Urls */
                data.mainMediaUrl = mainMedia?.url;
                let mediaUrls: string[] = [];
                medias.forEach((media) => {
                  if (media.url && media.name !== mainMedia.name) {
                    mediaUrls.push(media.url);
                  }
                });
                data.mediaUrls = mediaUrls;

                try {
                  if (isNew && authContext.user) {
                    await createProject(authContext.user?.id, data);
                    goHome();
                  } else if (project) {
                    await updateProject(project.id, data);
                  }
                } catch (err: any) {
                  setSubmitError(err.data.message || err.data.errors[0].msg);
                }
              }}
            >
              {({
                values,
                touched,
                errors,
                handleChange,
                handleSubmit,
                isSubmitting,
              }) => (
                <form onSubmit={handleSubmit} className={styles.project_form}>
                  <DragDropContext onDragEnd={onDragEndHandler}>
                    <Droppable direction="horizontal" droppableId="media">
                      {(provided, snapshot) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className={styles.mediaRow}
                        >
                          {medias.map((media, i) => (
                            <MediaDraggable
                              isSelected={mainMedia === media}
                              index={i}
                              key={media.name + i}
                              draggableId={media.name + i}
                              media={media}
                              onClick={() => {
                                if (media === mainMedia)
                                  setMainMedia({ name: "" });
                                else setMainMedia(media);
                              }}
                              onDeleteClick={() => deleteMedia(media)}
                            />
                          ))}
                          {provided.placeholder}
                          <AddMediaButton onFileChange={addMedia} />
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                  <div className={styles.row}>
                    <div>
                      <label htmlFor="title">
                        Title <span>(required)</span>
                      </label>
                      <input
                        id="title"
                        name="title"
                        type="text"
                        value={values.title || ""}
                        onChange={handleChange}
                        className={
                          touched.title && errors.title ? "red-outline" : ""
                        }
                      />
                      <FormError name="title" />
                    </div>
                    <div>
                      <label htmlFor="link">Link</label>
                      <input
                        id="link"
                        name="link"
                        type="url"
                        value={values.link || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className={styles.row}>
                    <div>
                      <label htmlFor="shortDescription">
                        Short Description <span>(required)</span>
                      </label>
                      <textarea
                        className={`${styles.shortDescription} ${
                          touched.shortDescription && errors.shortDescription
                            ? "red-outline"
                            : ""
                        }`}
                        id="shortDescription"
                        name="shortDescription"
                        value={values.shortDescription || ""}
                        onChange={handleChange}
                      />
                      <FormError name="shortDescription" />
                    </div>
                    <div>
                      <label htmlFor="repo">Repo</label>
                      <input
                        id="repo"
                        name="repo"
                        type="url"
                        value={values.repo || ""}
                        onChange={handleChange}
                      />

                      <div className={styles.type_progress_row}>
                        <div>
                          <label id="type">Type</label>
                          <input
                            id="type"
                            name="type"
                            type="text"
                            value={values.type}
                            onChange={handleChange}
                          />
                        </div>

                        <div>
                          <label id="inProgressLabel">In Progress</label>
                          <input
                            aria-labelledby="inProgressLabel"
                            id="inProgress"
                            name="inProgress"
                            type="checkbox"
                            className={styles.switch}
                            checked={values.inProgress}
                            onChange={handleChange}
                          />
                          <label htmlFor="inProgress"></label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <label htmlFor="techStack">Tech Stack</label>
                  <CategoryInput values={stack} onChange={setStack} />

                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={values.description || ""}
                    onChange={handleChange}
                  />

                  <label htmlFor="purposeAndGoal">Purpose & Goal</label>
                  <textarea
                    id="purposeAndGoal"
                    name="purposeAndGoal"
                    value={values.purposeAndGoal || ""}
                    onChange={handleChange}
                  />

                  <label htmlFor="problems">Problems</label>
                  <textarea
                    id="problems"
                    name="problems"
                    value={values.problems || ""}
                    onChange={handleChange}
                  />

                  <label htmlFor="lessonsLearned">Lessons Learned</label>
                  <textarea
                    id="lessonsLearned"
                    name="lessonsLearned"
                    value={values.lessonsLearned || ""}
                    onChange={handleChange}
                  />

                  <div className={styles.row_between}>
                    <div className={styles.row}>
                      <MainButton
                        type="submit"
                        style={{ marginRight: `0.5rem` }}
                      >
                        {isSubmitting ? <Loading size={20} /> : "Save"}
                      </MainButton>
                      <MainButton onclick={goHome} contrast>
                        Cancel
                      </MainButton>
                    </div>

                    {!isNew && (
                      <MainButton onclick={handleProjectDelete}>
                        <FaTrashAlt size={20} />
                      </MainButton>
                    )}
                  </div>

                  {submitError !== "" && (
                    <h3 className="submit-error">{submitError}</h3>
                  )}
                </form>
              )}
            </Formik>
          </main>
        </>
      )}
    </div>
  );
};

export default Project;
