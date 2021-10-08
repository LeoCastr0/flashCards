
export default function FlashCard({
  id,
  title = 'Titulo do card', 
  description = 'Descrição do card',
  showFlashCardTitle = true,
  onToggleFlashCard = null
}) {

  function handleCardClick() {
    if(onToggleFlashCard) {
      onToggleFlashCard(id)
    }
  }

  const fontSizeClassName = showFlashCardTitle ? 'text-xl' : 'text-sm'
  return (
    <div className={`shadow-lg p-4 m-4 w-80 h-48 cursor-pointer
                     flex flex-row items-center justify-center
                     font-semibold ${fontSizeClassName}`} 
    style={{fontFamily:"'JetBrains Mono', monospace"}}
    onClick={handleCardClick}
    >
      {showFlashCardTitle ? title : description}
    </div>
  )
}
