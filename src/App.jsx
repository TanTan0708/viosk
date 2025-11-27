import Header from './Header.jsx'
import Search from './Search.jsx'
import Filter from './Filter.jsx'
import Card from './Card.jsx'

function App() {

  return (
    <>
      
      <Header></Header>
      
      <Search></Search>
      <Filter></Filter>
      <div className="supercardcontainer">
        <Card></Card>
        <Card></Card>
        <Card></Card>
        <Card></Card>
        <Card></Card>
        <Card></Card>
      </div>
    </>
  );
}

export default App
