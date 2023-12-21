import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";
import { useSelector, useDispatch } from "react-redux";
import "./column.scss";
import "../cards/task-card.scss";
import "./board.scss";
import axios from "axios";
import * as actionTypes from "../../actions/types";
import plus from "../../assets/more.png";
import BoardTaskModal from "../modal/BoardTaskModal";
import { getColumns, getCurrentProject } from "../../actions/projectActions";
const onDragEnd = (result, columns, setColumns) => {
  if (!result.destination) return;
  const { source, destination } = result;

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems,
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems,
      },
    });
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems,
      },
    });
  }
};

const BoardContainer = ({ getTasks }) => {
  const userInfo = useSelector((user) => {
    return user.auth;
  });
  const dispatch = useDispatch();
  const token = userInfo?.userData?.token;
  const id = userInfo?.currentProject?._id.toString();
  const tasks = userInfo?.currentProjectTasks;
  const fullTeam = userInfo?.fullTeam;
  const cols = userInfo?.currentColumns;
  const getColumns = async () => {
    try {
      const { data } = await axios.get(`/api/column/get-columns/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setColumns(data);
      dispatch({
        type: actionTypes.GET_CURRENT_COLUMNS,
        payload: data,
      });
    } catch (error) {
      console.log(error);
    }
  };







  
  
  const addColumn = async () => {
    try {
      const projectId = id;
      const { data } = await axios.post(
        "/api/column/create-column",
        { columnName, projectId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setColumnName("");
      getColumns();
    } catch (error) {}
  };





  const setColumnsTaskArray = async () => {
    Object.entries(columns).map(async ([colId, column], index) => {
      let task = column && column.items;
      task.length != 0 &&
        task.map(async (t) => {
          if (t && t.status !== column.name) {
            const id = t._id;
            const status = column.name;
            try {
              const { res } = await axios.put(
                `/api/tasks/update-task/${id}`,
                { status },
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
            } catch (error) {
              console.log(error);
            }
          }
        });
      try {
        const arr =
          (task.length != 0 &&
            task.map((t) => {
              return { _id: t._id };
            })) ||
          [];
        task = [...arr];
        const { res } = await axios.put(
          `/api/column/update-tasks-array-on-columns/${colId}`,
          { task },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } catch (error) {
        console.log(error);
      }
    });
  };

  useEffect(() => {
    getColumns();
  }, []);

  useEffect(() => {
    getColumns();
  }, [tasks]);


  const openModal = async (item, columnId) => {
    const id = item._id;
    axios
      .get(`/api/tasks/get-task/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setCurrentTask(res.data.task);
        setCurrentColumn(columnId);
        setShow(true);
      })
      .catch((error) => console.log(error));
  };
  const [columns, setColumns] = useState({});
  const [columnName, setColumnName] = useState("");
  const [show, setShow] = useState(false);
  const [currentTask, setCurrentTask] = useState({});
  const [currentColumn, setCurrentColumn] = useState(null);
  const currentProject = userInfo?.currentProject;
  useEffect(() => {
    setColumnsTaskArray();
  }, [columns]);
  console.log(columns);
  const getInitials=(name)=>{
    const nameAsString=name.split(" ");
    return nameAsString[0].charAt(0)+nameAsString[1].charAt(0);
  }
  return (
    <div className="board-container">
      <div className="board-container-columns">
        <DragDropContext
          onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
        >
          {columns &&
            Object.entries(columns).map(([columnId, column], index) => {
              return (
                <div className="column" key={columnId}>
                  <div className="column-inside">
                    <h2>{column.name}</h2>
                    <Droppable droppableId={columnId} key={columnId}>
                      {(provided, snapshot) => {
                        return (
                          <div
                            className="tasks-container"
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                          >
                            {column.items.map((item, index) => {
                              return (
                                <Draggable
                                  key={item?._id}
                                  draggableId={item?._id}
                                  index={index}
                                >
                                  {(provided, snapshot) => {
                                    return (
                                      <div
                                        onClick={() =>
                                          openModal(item, columnId)
                                        }
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className="task-card"
                                        style={{
                                          ...provided.draggableProps.style,
                                        }}
                                      >
                                        <h4>{item?.taskTitle}</h4>
                                        <div className="card-down-side">
                                          {item?.priority === "Medium" && (
                                            <p id="medium">{item?.priority}</p>
                                          )}
                                          {item?.priority === "Low" && (
                                            <p id="low">{item?.priority}</p>
                                          )}
                                          {item?.priority === "High" && (
                                            <p id="high">{item?.priority}</p>
                                          )}
                                          <div className="initials">{getInitials(item.name)}</div>
                                        </div>
                                      </div>
                                    );
                                  }}
                                </Draggable>
                              );
                            })}
                            {provided.placeholder}
                          </div>
                        );
                      }}
                    </Droppable>
                  </div>
                </div>
              );
            })}
        </DragDropContext>
      </div>
      {currentProject.owner === userInfo.userData._id && 
      <div className="new-column" id="new">
        <div>
          <input
            name="columnName"
            id="columnName"
            placeholder="Column name..."
            value={columnName}
            onChange={(e) => setColumnName(e.target.value)}
          />
        </div>
        <div>
          <button onClick={addColumn}>
            <img src={plus} alt="plus" />
          </button>
        </div>
      </div>}
      {currentTask && (
        <BoardTaskModal
          show={show}
          onClose={() => setShow(false)}
          currentTask={currentTask}
          taskTitle={currentTask.taskTitle}
          currentColumn={currentColumn}
          fullTeam={fullTeam}
        />
      )}
    </div>
  );
};

export default BoardContainer;
