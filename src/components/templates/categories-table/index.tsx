import React, { useEffect, useMemo, useState } from "react"
import { useDebounce } from "../../../hooks/use-debounce"
import Spinner from "../../atoms/spinner"
import Table from "../../molecules/table"
import { usePagination, useTable } from "react-table"
import { FilteringOptionProps } from "../../molecules/table/filtering-option"
import TableContainer from "../../organisms/table-container"
import useCategoryActions from "./use-category-actions"
import useCategoryTableColumn from "./use-category-column"
import { useAdminCategories } from "../../../services/categories"

const DEFAULT_PAGE_SIZE = 15

const CategoriesTable: React.FC = () => {
  const [filteringOptions, setFilteringOptions] = useState<
    FilteringOptionProps[]
  >([])
  const [offset, setOffset] = useState(0)
  const limit = DEFAULT_PAGE_SIZE

  const [query, setQuery] = useState("")
  const [numPages, setNumPages] = useState(0)

  const debouncedSearchTerm = useDebounce(query, 300)
  const { product_categories, isLoading, isRefetching, count } =
    useAdminCategories(
      {
        q: debouncedSearchTerm,
        offset: offset,
        limit,
        // expand: "products", // muh: can't expand products currently. Returns error
      },
      { keepPreviousData: true }
    )

  const categories = useMemo(() => product_categories, [product_categories])

  useEffect(() => {
    if (typeof count !== "undefined") {
      const controlledPageCount = Math.ceil(count / limit)
      setNumPages(controlledPageCount)
    }
  }, [count])

  const [columns] = useCategoryTableColumn()

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageCount,
    nextPage,
    previousPage,
    // Get the state from the instance
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data: categories || [],
      manualPagination: true,
      initialState: {
        pageIndex: Math.floor(offset / limit),
        pageSize: limit,
      },
      pageCount: numPages,
      autoResetPage: false,
    },
    usePagination
  )

  const handleNext = () => {
    if (canNextPage) {
      setOffset(offset + limit)
      nextPage()
    }
  }

  const handleSearch = (q: string) => {
    setOffset(0)
    setQuery(q)
  }

  const handlePrev = () => {
    if (canPreviousPage) {
      setOffset(offset - limit)
      previousPage()
    }
  }

  useEffect(() => {
    setFilteringOptions([
      {
        title: "Sort",
        options: [
          {
            title: "All",
            count: categories?.length || 0,
            onClick: () => console.log("Not implemented yet"),
          },
        ],
      },
    ])
  }, [categories])

  return (
    <TableContainer
      isLoading={isLoading || isRefetching}
      hasPagination
      numberOfRows={limit}
      pagingState={{
        count: count!,
        offset,
        pageSize: offset + rows.length,
        title: "Categories",
        currentPage: pageIndex + 1,
        pageCount: pageCount,
        nextPage: handleNext,
        prevPage: handlePrev,
        hasNext: canNextPage,
        hasPrev: canPreviousPage,
      }}
    >
      <Table
        enableSearch
        handleSearch={handleSearch}
        searchValue={query}
        searchPlaceholder="Search Categories"
        filteringOptions={filteringOptions}
        {...getTableProps()}
      >
        <Table.Head>
          {headerGroups?.map((headerGroup) => (
            <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((col) => (
                <Table.HeadCell
                  className="min-w-[100px]"
                  {...col.getHeaderProps()}
                >
                  {col.render("Header")}
                </Table.HeadCell>
              ))}
            </Table.HeadRow>
          ))}
        </Table.Head>
        {isLoading || isRefetching || !categories ? (
          <Table.Body {...getTableBodyProps()}>
            <Table.Row>
              <Table.Cell colSpan={columns.length}>
                <div className="w-full pt-2xlarge flex items-center justify-center">
                  <Spinner size={"large"} variant={"secondary"} />
                </div>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        ) : (
          <Table.Body {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row)
              return <CategoryRow row={row} />
            })}
          </Table.Body>
        )}
      </Table>
    </TableContainer>
  )
}

const CategoryRow = ({ row }) => {
  const category = row.original
  const { getActions } = useCategoryActions(category)

  return (
    <Table.Row
      color={"inherit"}
      linkTo={`/a/product-categories/${category.id}`}
      actions={getActions(category)}
      {...row.getRowProps()}
    >
      {row.cells.map((cell, index) => {
        return (
          <Table.Cell {...cell.getCellProps()}>
            {cell.render("Cell", { index })}
          </Table.Cell>
        )
      })}
    </Table.Row>
  )
}
export default CategoriesTable
