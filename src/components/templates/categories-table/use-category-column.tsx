import moment from "moment"
import React, { useMemo } from "react"
import Tooltip from "../../atoms/tooltip"
import StatusIndicator from "../../fundamentals/status-indicator"
/*
  is_active: false
  is_internal: false
*/
const useCategoryTableColumn = () => {
  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
        Cell: ({ row: { original } }) => {
          return <div className="flex items-center">{original.name}</div>
        },
      },
      {
        Header: "Handle",
        accessor: "handle",
        Cell: ({ cell: { value } }) => <div>/{value}</div>,
      },
      {
        Header: "Parent Category",
        accessor: "parent_category",
        Cell: ({ cell: { value } }) => <div>{value?.name ?? "-"}</div>,
      },

      {
        Header: "Sub Categories",
        accessor: "category_children",
        Cell: ({ cell: { value } }) => {
          return <div>{value?.length ?? "-"}</div>
        },
      },
      {
        Header: "Active",
        accessor: "is_active",
        Cell: ({ cell: { value } }) => (
          <StatusIndicator variant={value ? "primary" : "danger"} />
        ),
      },
      {
        Header: "Created At",
        accessor: "created_at",
        Cell: ({ cell: { value } }) => (
          <Tooltip content={moment(value).format("DD MMM YYYY hh:mm A")}>
            {moment(value).format("DD MMM YYYY")}
          </Tooltip>
        ),
      },
      {
        Header: "Updated At",
        accessor: "updated_at",
        Cell: ({ cell: { value } }) => (
          <Tooltip content={moment(value).format("DD MMM YYYY hh:mm A")}>
            {moment(value).format("DD MMM YYYY")}
          </Tooltip>
        ),
      },
    ],
    []
  )

  return [columns]
}

export default useCategoryTableColumn
