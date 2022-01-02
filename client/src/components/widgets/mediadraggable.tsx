import React from "react";
import styles from "./mediadraggable.module.css";
import { FaCheck, FaTrashAlt } from "react-icons/fa";
import { Draggable } from "react-beautiful-dnd";

interface MediaProps {
  onClick?: () => void;
  onDeleteClick?: () => void;
  draggableId: string;
  index: number;
  media: File;
  isSelected?: boolean;
}

const MediaDraggable: React.FC<MediaProps> = (props) => {
  return (
    <Draggable index={props.index} draggableId={props.draggableId}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={styles.media_container}
        >
          <div
            role="button"
            onClick={props.onClick}
            className={styles.image_button}
          >
            {props.isSelected && (
              <div className={styles.check_background}>
                <FaCheck className={styles.check} />
              </div>
            )}
            <img alt="media" src={URL.createObjectURL(props.media)} />
          </div>
          <button
            type="button"
            onClick={props.onDeleteClick}
            className={styles.remove_button}
          >
            <FaTrashAlt size={17.5} />
          </button>
        </div>
      )}
    </Draggable>
  );
};
export default MediaDraggable;
