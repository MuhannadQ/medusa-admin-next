import { AdminPostProductCategoriesCategoryProductsBatchReq } from "@medusajs/medusa"
import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import BackButton from "../../../components/atoms/back-button"
import Spinner from "../../../components/atoms/spinner"
import EditIcon from "../../../components/fundamentals/icons/edit-icon"
import TrashIcon from "../../../components/fundamentals/icons/trash-icon"
import Actionables from "../../../components/molecules/actionables"
import DeletePrompt from "../../../components/organisms/delete-prompt"
import Section from "../../../components/organisms/section"
import CategoryModal from "../../../components/templates/category-modal"
import AddProductsTable from "../../../components/templates/collection-product-table/add-product-table"
import ViewProductsTable from "../../../components/templates/collection-product-table/view-products-table"
import useNotification from "../../../hooks/use-notification"
import Medusa from "../../../services/api"
import {
  useAdminCategory,
  useAdminDeleteCategory,
} from "../../../services/categories"
import { getErrorMessage } from "../../../utils/error-messages"

type ProductsBatchReq = AdminPostProductCategoriesCategoryProductsBatchReq

const CategoryDetails = () => {
  const { id } = useParams()

  const { product_category, isLoading, refetch } = useAdminCategory(id!)
  const category = useMemo(() => product_category, [product_category])
  const deleteCategory = useAdminDeleteCategory(id!)
  // const updateCategory = useAdminUpdateCategory(id!)
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [showAddProducts, setShowAddProducts] = useState(false)
  const navigate = useNavigate()
  const notification = useNotification()
  const [updates, setUpdates] = useState(0)

  const handleDelete = () => {
    deleteCategory.mutate(undefined, {
      onSuccess: () => navigate(`/a/product-categories`),
    })
  }

  const handleUpdateDetails = (data: any) => {
    /*
      This wasn't actually called
      So, we don't need this because category-modal does the update
    */
    // const payload: UpdateCategoryReq = {
    //   name: data.title,
    //   handle: data.handle,
    //   // add other fields
    // }
    // updateCategory.mutate(payload, {
    //   onSuccess: () => {
    //     setShowEdit(false)
    //     refetch()
    //   },
    // })
  }

  const handleAddProducts = async (
    addedIds: string[],
    removedIds: string[]
  ) => {
    try {
      if (addedIds.length > 0) {
        const payload: ProductsBatchReq = {
          product_ids: addedIds.map((id) => ({ id })),
        }
        await Medusa.categories.addProducts(category?.id, payload)
      }

      if (removedIds.length > 0) {
        const payload: ProductsBatchReq = {
          product_ids: removedIds.map((id) => ({ id })),
        }
        await Medusa.categories.removeProducts(category?.id, payload)
      }

      setShowAddProducts(false)
      notification("Success", "Updated products in category", "success")
      refetch()
      setUpdates(updates + 1) // muh: I added this because the useEffect doesn't work because we do not have category.products
    } catch (error) {
      notification("Error", getErrorMessage(error), "error")
    }
  }

  useEffect(() => {
    if (category?.products?.length) {
      setUpdates(updates + 1) // force re-render product table when products are added/removed
    }
  }, [category?.products])

  return (
    <>
      <div className="flex flex-col !pb-xlarge">
        <BackButton
          className="mb-xsmall"
          path="/a/products?view=categories"
          label="Back to Categories"
        />
        <div className="rounded-rounded py-large px-xlarge border border-grey-20 bg-grey-0 mb-large">
          {isLoading || !category ? (
            <div className="flex items-center w-full h-12">
              <Spinner variant="secondary" size="large" />
            </div>
          ) : (
            <div>
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="inter-xlarge-semibold mb-2xsmall">
                    {category.name}
                  </h2>
                  <Actionables
                    forceDropdown
                    actions={[
                      {
                        label: "Edit Category",
                        onClick: () => setShowEdit(true),
                        icon: <EditIcon size="20" />,
                      },
                      {
                        label: "Delete",
                        onClick: () => setShowDelete(!showDelete),
                        variant: "danger",
                        icon: <TrashIcon size="20" />,
                      },
                    ]}
                  />
                </div>
                <p className="inter-small-regular text-grey-50">
                  /{category.handle}
                </p>
              </div>
            </div>
          )}
        </div>
        <Section
          title="Products"
          actions={[
            {
              label: "Edit Products",
              icon: <EditIcon size="20" />,
              onClick: () => setShowAddProducts(!showAddProducts),
            },
          ]}
        >
          <p className="text-grey-50 inter-base-regular mt-xsmall mb-base">
            To start selling, all you need is a name, price, and image.
          </p>
          {category && (
            <ViewProductsTable
              isCategory
              key={updates} // force re-render when category is updated
              collectionId={category.id}
              refetchCollection={refetch}
            />
          )}
        </Section>
      </div>
      {showEdit && (
        <CategoryModal
          onClose={() => setShowEdit(!showEdit)}
          onSubmit={handleUpdateDetails}
          isEdit
          category={category}
        />
      )}
      {showDelete && (
        <DeletePrompt
          handleClose={() => setShowDelete(!showDelete)}
          heading="Delete category"
          successText="Successfully deleted category"
          onDelete={async () => handleDelete()}
          confirmText="Yes, delete"
        />
      )}
      {showAddProducts && (
        // muh: we do not have products and can't expand products for useAdminCategory
        <AddProductsTable
          onClose={() => setShowAddProducts(false)}
          onSubmit={handleAddProducts}
          existingRelations={category?.products ?? []}
        />
      )}
    </>
  )
}

export default CategoryDetails
