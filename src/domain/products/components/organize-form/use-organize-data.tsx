import { useAdminCollections, useAdminProductTypes } from "medusa-react"
import { useMemo } from "react"
import { useAdminCategories } from "../../../../services/categories/queries"

const useOrganizeData = () => {
  const { product_types } = useAdminProductTypes(undefined, {
    staleTime: 0,
    refetchOnWindowFocus: true,
  })
  const { collections } = useAdminCollections()
  const { product_categories } = useAdminCategories()

  const productTypeOptions = useMemo(() => {
    return (
      product_types?.map(({ id, value }) => ({
        value: id,
        label: value,
      })) || []
    )
  }, [product_types])

  const collectionOptions = useMemo(() => {
    return (
      collections?.map(({ id, title }) => ({
        value: id,
        label: title,
      })) || []
    )
  }, [collections])

  const categoryOptions = useMemo(() => {
    return (
      product_categories?.map(({ id, name }) => ({
        value: id,
        label: name,
      })) || []
    )
  }, [product_categories])

  return {
    productTypeOptions,
    collectionOptions,
    categoryOptions,
  }
}

export default useOrganizeData
