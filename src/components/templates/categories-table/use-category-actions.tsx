import * as React from "react"
import { useNavigate } from "react-router-dom"
import useImperativeDialog from "../../../hooks/use-imperative-dialog"
import { useAdminDeleteCategory } from "../../../services/categories"
import EditIcon from "../../fundamentals/icons/edit-icon"
import TrashIcon from "../../fundamentals/icons/trash-icon"
import { ActionType } from "../../molecules/actionables"

const useCategoryActions = (category) => {
  const navigate = useNavigate()
  const dialog = useImperativeDialog()
  const deleteCategory = useAdminDeleteCategory(category?.id!)

  const handleDelete = async () => {
    const shouldDelete = await dialog({
      heading: "Delete Category",
      text: "Are you sure you want to delete this category?",
    })

    if (shouldDelete) {
      deleteCategory.mutate()
    }
  }

  const getActions = (coll): ActionType[] => [
    {
      label: "Edit",
      onClick: () => navigate(`/a/product-categories/${coll.id}`),
      icon: <EditIcon size={20} />,
    },
    {
      label: "Delete",
      variant: "danger",
      onClick: handleDelete,
      icon: <TrashIcon size={20} />,
    },
  ]

  return {
    getActions,
  }
}

export default useCategoryActions
