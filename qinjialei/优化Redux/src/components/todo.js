import React from 'react';
import { TodoItem } from "./TodoItem";
import { useTodo } from '../hooks/useTodo';

const Todo = (props) => {
  // const { inputValue, inputChange, addItem, list } = props
  const { list, deleteTodo, addTodo } = useTodo()
  return (
    <div>
      <button onClick={() => { addTodo('1111') }}> 添加</button>
      <button onClick={() => { deleteTodo('1111') }}> 删除</button>
      <ul>
        {list.map((item, index) => {
          return <TodoItem key={index} index={index} item={item}></TodoItem>
        })
        }
      </ul>
    </div>
  )
}

export default Todo

