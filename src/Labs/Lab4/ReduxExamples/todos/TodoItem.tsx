import { Button, ListGroup } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { deleteTodo, setTodo } from "./todosReducer";
type Todo = { id: string; title: string };

export default function TodoItem({ todo }: { todo: Todo }) {

  const dispatch = useDispatch();
  return (
    <ListGroup.Item key={todo.id} className="d-flex align-items-center py-3">
      <Button onClick={() => dispatch(deleteTodo(todo.id))}
        id="wd-delete-todo-click" variant="danger" className="order-3 px-4"> Delete 
      </Button>
      <Button onClick={() => dispatch(setTodo(todo))}
        id="wd-set-todo-click" variant="primary" className="order-2 me-2 px-4"> Edit 
      </Button>
      <span className="order-1 flex-grow-1 fs-4">{todo.title}</span>
    </ListGroup.Item>
  );
}