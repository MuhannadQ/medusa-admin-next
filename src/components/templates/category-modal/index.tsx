import { ProductCategory } from "@medusajs/medusa"

import React, { useMemo } from "react"
import { Controller, useForm } from "react-hook-form"
import useNotification from "../../../hooks/use-notification"
import {
  useAdminCategories,
  useAdminCreateCategory,
  useAdminUpdateCategory,
} from "../../../services/categories"
import { Option } from "../../../types/shared"
import { getErrorMessage } from "../../../utils/error-messages"
import Checkbox from "../../atoms/checkbox"
import Button from "../../fundamentals/button"
import IconTooltip from "../../molecules/icon-tooltip"
import InputField from "../../molecules/input"
import Modal from "../../molecules/modal"
import { NextSelect } from "../../molecules/select/next-select"

type CategoryModalProps = {
  onClose: () => void
  onSubmit: (values: any) => void
  isEdit?: boolean
  category?: ProductCategory
}

type CategoryModalFormData = {
  name: string
  handle: string
  isActive: boolean
  isInternal: boolean
  parentCategory: Option | null
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  onClose,
  isEdit = false,
  category,
}) => {
  const { mutate: update, isLoading: updating } = useAdminUpdateCategory(
    category?.id!
  )
  const { mutate: create, isLoading: creating } = useAdminCreateCategory()

  const { product_categories } = useAdminCategories()
  const categoryOptions = useMemo(() => {
    return (
      product_categories?.map(({ id, name }) => ({ value: id, label: name })) ||
      []
    )
  }, [product_categories])

  const { register, handleSubmit, control } = useForm<CategoryModalFormData>({
    defaultValues: getDefaultValues(category),
  })

  const notification = useNotification()

  if (isEdit && !category) {
    throw new Error("Category is required for edit")
  }

  // useEffect(() => {
  //   register("name", { required: true })
  //   register("handle", { required: true })
  // }, [])

  // useEffect(() => {
  //   if (isEdit && category) {
  //     reset()
  //   }
  // }, [category, isEdit])

  const submit = (data: CategoryModalFormData) => {
    const { name, handle, isActive, isInternal, parentCategory } = data
    const payload = {
      name,
      handle,
      is_active: isActive,
      is_internal: isInternal,
      parent_category_id: parentCategory ? parentCategory.value : null,
    }
    if (isEdit) {
      update(payload, {
        onSuccess: () => {
          notification("Success", "Successfully updated category", "success")
          onClose()
        },
        onError: (error) => {
          notification("Error", getErrorMessage(error), "error")
        },
      })
    } else {
      create(payload, {
        onSuccess: () => {
          notification("Success", "Successfully created category", "success")
          onClose()
        },
        onError: (error) => {
          notification("Error", getErrorMessage(error), "error")
        },
      })
    }
  }

  return (
    <Modal handleClose={onClose} isLargeModal>
      <Modal.Body>
        <Modal.Header handleClose={onClose}>
          <div>
            <h1 className="inter-xlarge-semibold mb-2xsmall">
              {isEdit ? "Edit Category" : "Add Category"}
            </h1>
            <p className="inter-small-regular text-grey-50">
              To create a category, all you need is a name and a handle.
            </p>
          </div>
        </Modal.Header>
        <form onSubmit={handleSubmit(submit)}>
          <Modal.Content>
            <div>
              <h2 className="inter-base-semibold mb-base">Details</h2>
              <div className="flex items-center gap-x-base mb-xlarge">
                <InputField
                  label="Name"
                  required
                  placeholder="Sunglasses"
                  {...register("name", { required: true })}
                />
                <InputField
                  label="Handle"
                  placeholder="sunglasses"
                  {...register("handle", { required: true })}
                  prefix="/"
                  tooltip={
                    <IconTooltip content="URL Slug for the category. Will be auto generated if left blank." />
                  }
                />
              </div>
              <div className="flex items-center gap-x-base mb-xlarge">
                <Controller
                  name="isActive"
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <Checkbox
                        label="Active category"
                        checked={value}
                        onChange={(e) => onChange(e.target.checked)}
                      />
                    )
                  }}
                />
                <Controller
                  name="isInternal"
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <Checkbox
                        label="Internal category"
                        checked={value}
                        onChange={(e) => onChange(e.target.checked)}
                      />
                    )
                  }}
                />
              </div>
              <Controller
                name="parentCategory"
                control={control}
                render={({ field: { value, onChange } }) => {
                  return (
                    <NextSelect
                      label="Parent Category"
                      onChange={onChange}
                      options={categoryOptions}
                      value={value}
                      placeholder="Choose a parent category"
                      isClearable
                    />
                  )
                }}
              />
            </div>
            {/* <div className="mt-xlarge w-full">
              <Metadata setMetadata={setMetadata} metadata={metadata} />
            </div> */}
          </Modal.Content>
          <Modal.Footer>
            <div className="flex items-center justify-end w-full gap-x-xsmall">
              <Button
                variant="secondary"
                size="small"
                type="button"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="small"
                loading={isEdit ? updating : creating}
              >
                {`${isEdit ? "Save" : "Publish"} category`}
              </Button>
            </div>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  )
}

function getDefaultValues(category?: ProductCategory) {
  // : CategoryModalFormData
  const {
    name,
    handle,
    is_active = true,
    is_internal = false,
    parent_category,
  } = category || {}
  return {
    name: name ?? "",
    handle: handle ?? "",
    isActive: !!is_active,
    isInternal: !!is_internal,
    parentCategory: parent_category
      ? { label: parent_category.name, value: parent_category.id }
      : null,
  }
}

export default CategoryModal
