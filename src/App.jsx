import { useState } from "react";
import "./index.css";


function App() {
  const [items,setItems] = useState([]);

  function handleSubmitItem(item){
    setItems((oldItems)=>[...oldItems,item]);
  }

  function handleRemoveItem(id){
    setItems(items => items.filter((item)=> item.id != id));
  }

  function handleToogleItem(id){
    setItems(items => items.map((item)=> item.id === id ? {...item,packed: !item.packed} : item))
    console.log(items);
  }

  function handleDeleteList(){
    const confirmed = window.confirm('Are you sure');

    if(confirmed)setItems([]);
  }

  return (
    <div className="app">
      <Logo />
      <Form onSubmitItem={handleSubmitItem}/>
      <PackingList onDeleteList={handleDeleteList} onToogleItem={handleToogleItem} items={items} onRemoveItem={handleRemoveItem}/>
      <Stats items={items}/>
    </div>
  );
}

function Logo() {
  return <h1>🌳 Far Away 📦🌏</h1>;
}
function Form({onSubmitItem}) {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);

  function handleSubmit(e) {
    e.preventDefault();

    const newItem = { quantity, description, packed: false, id: Date.now() };
    onSubmitItem(newItem)
    setDescription("");
    setQuantity(1);
  }
  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>What do you need for your 😁 trip ?</h3>
      <select
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        name=""
        id=""
      >
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <option key={num} value={num}>
            {num}
          </option>
        ))}
      </select>
      <input
        onChange={(e) => setDescription(e.target.value)}
        value={description}
        type="text"
        placeholder="item..."
      />
      <button>Add</button>
    </form>
  );
}
function PackingList({items,onRemoveItem,onToogleItem,onDeleteList}) {
  const [sortBy,setSortBy] = useState('input');
  let sortedItems;

  if(sortBy === 'input') sortedItems = items;
  if(sortBy === 'description') sortedItems = items.slice().sort((a, b) => a.description.localeCompare(b.description));
  if(sortBy === 'packed') sortedItems = items.slice().sort((a,b)=> Number(a.packed) - Number(b.packed));
  return (
    <div className="list">
      <ul>
        {sortedItems.map((item) => (
          <Item onToogleItem={onToogleItem} onRemoveItem={onRemoveItem} key={item.id} item={item}></Item>
        ))}
      </ul>

      <div className="actions">
        <select value={sortBy} onChange={(e)=> setSortBy(e.target.value)}>
          <option value="input">Sort by input order</option>
          <option value="description">Sort by description</option>
          <option value="packed">Sort by packed status</option>
        </select>
        <button onClick={onDeleteList}>Clear List</button>
      </div>
     
    </div>
  );
}

function Item({ item,onRemoveItem ,onToogleItem}) {
  return (
    <li>
      <input type="checkbox" value={item.packed} onChange={()=>onToogleItem(item.id)}/>
      <span style={item.packed ? { textDecoration: "line-through" } : {}}>
        {item.quantity} {item.description}
      </span>
      <button onClick={()=>onRemoveItem(item.id)}>❌</button>
    </li>
  );
}

function Stats({items}) {

  if(!items.length){
    return (
      <p className="stats">
        <em>Start adding some items to your packing list 🚀</em>
      </p>
    )
  }
  const numItems = items.length;
  const packedItems = items.filter(item => item.packed).length;
  const percentageOfPacked = Math.round((packedItems/numItems)*100);
  return (
    <footer className="stats">
      <em>
        {
          percentageOfPacked === 100 ? `You got everything!Ready to go 🛩️` : `💼 you have ${numItems} items on your list and you already packed ${packedItems} (${percentageOfPacked}%)`
        }
        </em>
    </footer>
  );
}

export default App;
