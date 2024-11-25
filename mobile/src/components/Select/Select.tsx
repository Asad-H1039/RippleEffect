import { Dispatch, SetStateAction, useState } from "react"
import { Option } from "../../types/option"
import { Picker } from "@react-native-picker/picker"
import { useStyles } from "./Select.styles"

type SelectProps<TOption extends Option> = {
  options: TOption[]
  selectedOption: TOption["id"] | undefined
  placeholder?: string

  onOptionChange: (itemValue: TOption["id"], itemIndex: number) => void
}

export const Select = <TOption extends Option>({
  options,
  selectedOption,
  placeholder,
  onOptionChange,
}: SelectProps<TOption>) => {
  const styles = useStyles()

  const [isPickerOpen, setIsPickerOpen] = useState(false)

  return (
    <Picker
      style={styles.select}
      selectedValue={selectedOption}
      onValueChange={onOptionChange}
      onFocus={() => setIsPickerOpen(true)}
      onBlur={() => setIsPickerOpen(false)}>
      {!isPickerOpen && <Picker.Item value="" label={placeholder} />}

      {options?.map((option) => (
        <Picker.Item key={option.id} label={option.name} value={option.id} />
      ))}
    </Picker>
  )
}
