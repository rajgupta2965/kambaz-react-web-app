import { ListGroup } from "react-bootstrap";
import TodoForm from "./TodoForm";
import TodoItem from "./TodoItem";
import { useSelector } from "react-redux";

export default function TodoList() {
  const { todos } = useSelector((state: any) => state.todosReducer);

  return (
    <div className="p-3">
      <h2 className="display-6 fw-bold mb-3">Todo List</h2>

      <ListGroup variant="flush" className="rounded-3 shadow m-2 border">
         <TodoForm />
        {todos.map((todo: any) => (
         <TodoItem todo={todo} />
        ))}
      </ListGroup>
    </div>
  );
}