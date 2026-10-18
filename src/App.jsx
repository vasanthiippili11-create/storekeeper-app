import { Routes, Route, NavLink } from 'react-router-dom'
import Dashboard from './Dashboard.jsx'
import Orders from './Orders.jsx'
import Catalog from './Catalog.jsx'

function App() {
  return (
    <div>
      <header className="header">
        <div className="logo">Storekeeper</div>
        <nav>
          <NavLink to="/" end>Dashboard</NavLink>
          <NavLink to="/orders">Orders</NavLink>
          <NavLink to="/catalog">Catalog</NavLink>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/catalog" element={<Catalog />} />
      </Routes>
    </div>
  )
}

export default App