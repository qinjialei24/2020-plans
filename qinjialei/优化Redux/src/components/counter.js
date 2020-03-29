import React, { useState, useEffect } from "react";

function Counter(props) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    document.title = "componentDidMount" + count;
  }, [count]);

  return (
    <div>
      <div>{count}</div>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  )
}



export default Counter