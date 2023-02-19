import { Product } from "@medusajs/medusa"
import React, { useEffect } from "react"
import { useFieldArray, useForm, useWatch } from "react-hook-form"

import Button from "../../../../../components/fundamentals/button"
import Modal from "../../../../../components/molecules/modal"
import Metadata, {
  MetadataField,
} from "../../../../../components/organisms/metadata"

import useEditProductActions from "../../hooks/use-edit-product-actions"

type Props = {
  product: Product
  open: boolean
  onClose: () => void
}

type MetadataForm = {
  metadata: MetadataField[]
}

const MetadataModal: React.FC<Props> = ({ product, open, onClose }) => {
  const { onUpdate, updating } = useEditProductActions(product.id)
  const form = useForm<MetadataForm>({
    defaultValues: getDefaultValues(product),
  })
  const {
    formState: { isDirty },
    handleSubmit,
    reset,
    control,
  } = form

  const { replace } = useFieldArray({ control, name: "metadata" })
  const liveData = useWatch({ control, name: "metadata" })

  useEffect(() => {
    reset(getDefaultValues(product))
  }, [product])

  const onReset = () => {
    reset(getDefaultValues(product))
    onClose()
  }

  const onSubmit = handleSubmit((data) => {
    const payloadMetadata = data.metadata.reduce(
      (acc, next) => ({ ...acc, [next.key]: next.value }),
      {}
    )
    onUpdate({ metadata: payloadMetadata }, onReset)
  })

  return (
    <Modal open={open} handleClose={onClose} isLargeModal>
      <Modal.Body>
        <Modal.Header handleClose={onReset}>
          <h1 className="inter-xlarge-semibold m-0">Edit Metadata</h1>
        </Modal.Header>
        <form onSubmit={onSubmit}>
          <Modal.Content>
            <Metadata setMetadata={replace} metadata={liveData} heading="" />
          </Modal.Content>
          <Modal.Footer>
            <div className="flex gap-x-2 justify-end w-full">
              <Button
                size="small"
                variant="secondary"
                type="button"
                onClick={onReset}
              >
                Cancel
              </Button>
              <Button
                size="small"
                variant="primary"
                type="submit"
                disabled={!isDirty}
                loading={updating}
              >
                Save
              </Button>
            </div>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  )
}

const getDefaultValues = (product: Product): MetadataForm => {
  const metadata: MetadataField[] = []
  Object.entries(product.metadata ?? {}).map(([key, value]) => {
    if (typeof value === "string") {
      metadata.push({ key, value })
    }
  })

  return { metadata }
}
export default MetadataModal
