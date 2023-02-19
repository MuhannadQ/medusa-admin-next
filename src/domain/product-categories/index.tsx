import { Route, Routes } from "react-router-dom"
import CategoryDetails from "./details"

const Categories = () => {
  return (
    <Routes>
      <Route path="/:id" element={<CategoryDetails />} />
    </Routes>
  )
}

export default Categories
