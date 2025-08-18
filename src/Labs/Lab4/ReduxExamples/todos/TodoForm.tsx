import { ListGroup, Button, FormControl } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { addTodo, updateTodo, setTodo } from "./todosReducer";

export default function TodoForm() {
  const { todo } = useSelector((state: any) => state.todosReducer);
  const dispatch = useDispatch();
  return (
    <ListGroup.Item className="d-flex align-items-center py-3">
      <Button onClick={() => dispatch(addTodo(todo))} id="wd-add-todo-click" variant="success"
        className="order-3 px-4 fw-semibold"> Add 
      </Button>
      <Button onClick={() => dispatch(updateTodo(todo))} id="wd-update-todo-click" variant="warning"
        className="order-2 ms-auto px-4 fw-semibold me-2"> Update 
      </Button>
      <FormControl value={todo.title}
        className="order-1 flex-grow-1 me-3 form-control-lg" placeholder="Learn Mongo"
        onChange={(e) => dispatch(setTodo({ ...todo, title: e.target.value })) }/>
    </ListGroup.Item>
);}
