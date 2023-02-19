import {
  AdminPostProductCategoriesReq,
  AdminPostProductCategoriesCategoryReq,
  AdminProductCategoriesCategoryRes,
  AdminProductCategoriesCategoryDeleteRes,
} from "@medusajs/medusa"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import Medusa from "../api"
import { queryKeys } from "./utils"

type CreateCategoryReq = AdminPostProductCategoriesReq
export type UpdateCategoryReq = AdminPostProductCategoriesCategoryReq

type PostCategoryRes = AdminProductCategoriesCategoryRes

export const useInvalidateProductCategories = () => {
  const queryClient = useQueryClient()
  return (keys: string[][]) => {
    keys.forEach((key) => queryClient.invalidateQueries(key))
  }
}

export const useAdminCreateCategory = () => {
  const invalidateCategories = useInvalidateProductCategories()

  return useMutation<PostCategoryRes, unknown, CreateCategoryReq>(
    (createPayload) =>
      Medusa.categories.create(createPayload).then(({ data }) => data),
    {
      onSuccess: () => invalidateCategories([queryKeys.lists()]),
    }
  )
}

export const useAdminUpdateCategory = (id: string) => {
  const invalidateCategories = useInvalidateProductCategories()

  return useMutation<PostCategoryRes, unknown, UpdateCategoryReq>(
    (updatePayload) =>
      Medusa.categories.update(id, updatePayload).then(({ data }) => data),
    {
      onSuccess: () =>
        invalidateCategories([queryKeys.lists(), queryKeys.detail(id)]),
    }
  )
}

export const useAdminDeleteCategory = (id: string) => {
  const invalidateCategories = useInvalidateProductCategories()

  return useMutation<AdminProductCategoriesCategoryDeleteRes>(
    () => Medusa.categories.delete(id).then(({ data }) => data),
    {
      onSuccess: () =>
        invalidateCategories([queryKeys.lists(), queryKeys.detail(id)]),
    }
  )
}
