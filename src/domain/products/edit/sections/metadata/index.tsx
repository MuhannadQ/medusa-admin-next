import { Product } from "@medusajs/medusa"
import React from "react"
import EditIcon from "../../../../../components/fundamentals/icons/edit-icon"
import { ActionType } from "../../../../../components/molecules/actionables"
import Section from "../../../../../components/organisms/section"
import useToggleState from "../../../../../hooks/use-toggle-state"
import MetadataModal from "./metadata-modal"

type Props = {
  product: Product
}

const MetadataSection = ({ product }: Props) => {
  const { state, toggle, close } = useToggleState()

  const actions: ActionType[] = [
    {
      label: "Edit Metadata",
      onClick: toggle,
      icon: <EditIcon size={20} />,
    },
  ]

  return (
    <>
      <Section title="Metadata" actions={actions} forceDropdown>
        <div className="flex flex-col gap-y-xsmall mt-base">
          {Object.entries(product.metadata ?? {}).map(([key, value]) => (
            <MetaField
              key={key}
              field={key}
              value={typeof value === "string" ? value : ""}
            />
          ))}
        </div>
      </Section>

      <MetadataModal onClose={close} open={state} product={product} />
    </>
  )
}

type MetaFieldProps = {
  field: string
  value: string
}

const MetaField = ({ field, value }: MetaFieldProps) => {
  return (
    <div className="flex items-center justify-between w-full inter-base-regular text-grey-50">
      <p className="min-w-fit mr-8">{field}</p>
      <p className="truncate">
        {value?.split(",").map((val) => (
          <span key={val} className="ml-3">
            {val || "–"}
          </span>
        ))}
      </p>
    </div>
  )
}

export default MetadataSection
