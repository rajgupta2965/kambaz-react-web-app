import { useState } from "react";

export default function ArrayStateVariable() {
  const [array, setArray] = useState([1, 2, 3, 4, 5]);
  const addElement = () => {
    setArray([...array, Math.floor(Math.random() * 100)]);
  };
  const deleteElement = (index: number) => {
    setArray(array.filter((_item, i) => i !== index));
  };

  return (
    <div id="wd-array-state-variables" className="p-3">
      <h2 className="h3 fw-bold mb-3">Array State Variable</h2>
      <button onClick={addElement} className="btn btn-success mb-3 rounded-2">
        Add Element
      </button>

      <div className="card rounded-3 shadow-sm">
        <ul className="list-group">
          {array.map((item, index) => (
            <li key={index} className="list-group-item d-flex justify-content-between align-items-center py-3">
              <span className="fs-4 fw-semibold">{item}</span>
              <button onClick={() => deleteElement(index)} className="btn btn-danger px-4 rounded-2">
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}