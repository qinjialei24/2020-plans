import { useState } from "react";

export const useTodo = () => {
  const [list, setList] = useState([1, 2, 3])
  const addTodo = (todo) => {
    setList(pre => [...list, todo])
  }
  const deleteTodo = (todo) => {
    setList(pre => {
      const res = list.filter(item => item !== todo)
      return res
    })
  }

  return {
    list,
    addTodo,
    deleteTodo,
  }

}