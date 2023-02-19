import {
  AdminGetProductCategoriesParams,
  AdminProductCategoriesListRes,
  AdminProductCategoriesCategoryRes,
} from "@medusajs/medusa"
import { useQuery } from "@tanstack/react-query"
import { useFeatureFlag } from "../../context/feature-flag"
import Medusa from "../api"
import { queryKeys } from "./utils"

export const useAdminCategories = (
  query?: AdminGetProductCategoriesParams,
  options?: any
) => {
  const { isFeatureEnabled } = useFeatureFlag()

  const { data, ...rest } = useQuery<AdminProductCategoriesListRes>(
    queryKeys.list(query),
    () => Medusa.categories.list(query).then(({ data }) => data),
    {
      enabled: isFeatureEnabled("product_categories"),
      ...options,
    }
  )
  return { ...data, ...rest } as const
}

export const useAdminCategory = (id: string, options?: any) => {
  const { data, ...rest } = useQuery<AdminProductCategoriesCategoryRes>(
    queryKeys.detail(id),
    () => Medusa.categories.retrieve(id).then(({ data }) => data),
    options
  )
  return { ...data, ...rest } as const
}
