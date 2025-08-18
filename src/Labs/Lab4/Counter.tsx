import { useState } from "react";
export default function Counter() {
  const [count, setCount] = useState(7);
  console.log(count);
  return (
    <div>
      <h2>Counter: {count}</h2>
      <button type="button" className="btn btn-success m-2" onClick={() => setCount(count + 1)}
        id="wd-counter-up-click">Up</button>
      <button type="button" className="btn btn-danger m-2" onClick={() => setCount(count - 1)}
        id="wd-counter-down-click">Down</button>
      <hr /></div>);
}