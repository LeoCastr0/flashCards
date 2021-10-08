import { getNewId } from "../services/idService"

export default function TextArea({
  id = getNewId(),
  labelDescription = "Descrição do label",
  textAreaValue = "Valor padrão do textArea",
  onTextAreaChange = null,
  maxLength = 230,
  rows = 4
}) {
  function handleTextAreaChange({currentTarget}) {
    if (onTextAreaChange) {
        const newValue = currentTarget.value
        onTextAreaChange(newValue)
    }
  }

  const currentCharacterCount = textAreaValue.length
  return (
      <div className='flex flex-col my-4'>
          <label className='text-sm mb-1' htmlFor={id}>
              {labelDescription}
          </label>
          <textarea
              id={id}
              className='border p-1'
              maxLength={maxLength}
              rows={rows}
              value={textAreaValue}
              onChange={handleTextAreaChange}
          />
          <div className='text-right mr-1'>
            <span>{currentCharacterCount} / {maxLength}</span>
          </div>
      </div>
  )
}
