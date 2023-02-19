export const queryKeys = {
  all: ["admin_product-categories"],
  lists: () => [...queryKeys.all, "list"],
  list: (query?: any) => [...queryKeys.lists(), { query }],
  details: () => [...queryKeys.all, "detail"],
  detail: (id: string) => [...queryKeys.details(), id],
}
