import { ComponentMeta, ComponentStory } from "@storybook/react"
import React from "react"
import CategoryModal from "."

export default {
  title: "Template/AddCategoryModal",
  component: CategoryModal,
} as ComponentMeta<typeof CategoryModal>

const Template: ComponentStory<typeof CategoryModal> = (args) => (
  <CategoryModal {...args} />
)

export const Default = Template.bind({})
Default.args = {
  onClose: () => {},
  onSubmit: (values) => console.log(JSON.stringify(values, null, 2)),
}
