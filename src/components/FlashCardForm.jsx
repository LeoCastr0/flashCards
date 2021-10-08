import { useEffect, useState } from "react"
import Button from "./Button"
import Error from "./Error"
import TextArea from "./TextArea"
import TextInput from "./TextInput"

export default function FlashCardForm({createMode = true, onPersist = null, children: flashCard = null}) {
  const [title, setTitle] = useState(flashCard?.title || '') //se flashcard existir assume o titulo, se não vazio
  const [description, setDescription] = useState(flashCard?.description || '')
  const [error, setError] = useState('')

  useEffect(() => {
    if(createMode) {
      setTitle('')
      setDescription('')
    }
  },[createMode])

  function handleTitleChange(newTitle) {
    setTitle(newTitle)
  }

  function handleDescriptionChange(newDescription) {
    setDescription(newDescription)
  }

  function clearFields() {
    setTitle('')
    setDescription('')
  }

  function validateForm() {
    return title.trim() !== '' && description.trim() !== ''
  }

  function handleFormSubmit(event) {
    event.preventDefault()
    if(validateForm()) {
      setError('')
      if(onPersist) {
        onPersist(title, description)
        clearFields()
      }
    } else {
      setError('Título e descrição são obrigatórios')
    }

  }

  function handleFormReset(event) {
    clearFields()
  }

  const backgroundClassName = createMode ? 'bg-green-100' : 'bg-yellow-100'
  return (
    <form className={`${backgroundClassName} p-4`} onSubmit={handleFormSubmit} onReset={handleFormReset}>
      <h2 className="text-center font-semibold">Manutenção de flash cards</h2>
      <TextInput labelDescription="Titulo:" inputValue={title} onInputChange={handleTitleChange} />
      <TextArea labelDescription="Descrição:" textAreaValue={description} onTextAreaChange={handleDescriptionChange}/>
      <div className="flex items-center justify-between">
        {error.trim() !== '' ? <Error>{error}</Error> : <span>&nbsp;</span>}
        <div>
          <Button colorClass="bg-red-200" type="reset">Limpar</Button>
          <Button colorClass="bg-green-300" type="submit">Salvar</Button>
        </div>
      </div>
    </form>
  )
}
