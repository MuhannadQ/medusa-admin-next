import React from "react"
import { useFieldArray, useWatch } from "react-hook-form"
import Metadata, {
  MetadataField,
} from "../../../../../components/organisms/metadata"
import { NestedForm } from "../../../../../utils/nested-form"

export type VariantMetadataFormType = {
  metadata: MetadataField[]
}

type Props = {
  form: NestedForm<VariantMetadataFormType>
}
const VariantMetadataForm = ({ form }: Props) => {
  const { path, control } = form
  const { replace } = useFieldArray({ control, name: path("metadata") })
  const liveData = useWatch({ control, name: path("metadata") })

  return (
    <div>
      <p className="inter-base-regular text-grey-50">
        Used for additional specifications
      </p>
      <Metadata setMetadata={replace} metadata={liveData} heading="" />
    </div>
  )
}

export default VariantMetadataForm
