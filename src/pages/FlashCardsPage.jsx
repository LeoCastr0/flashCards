import FlashCard from '../components/FlashCard'
import FlashCards from '../components/FlashCards'
import Header from '../components/Header'
import Main from '../components/Main'
import Button from '../components/Button'
import { useEffect, useState } from 'react'
import { helperShuffleArray } from '../helpers/arrayHelpers'
import RadioButton from '../components/RadioButton'
import { apiCreateFlashCard, apiDeleteFlashCard, apiGetAllFlashCards, apiUpdateFlashCard } from '../services/apiServices'
import Loading from '../components/Loading'
import Error from '../components/Error'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import FlashCardItem from '../components/FlashCardItem'
import FlashCardForm from '../components/FlashCardForm'
//import { getNewId } from '../services/idService'

export default function FlashCardsPage() {
  //Back end
  const [allCards, setAllCards] = useState([])
  //Exclusivo para estudo
  const [studyCards, setStudyCards] = useState([])  
  const [radioButtonShowTitle, setRadioButtonShowTitle] = useState(true)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [createMode, setCreateMode] = useState(true)
  const [selectedTab, setSelectedTab] = useState(0)
  const [selectedFlashCard, setSelectedFlashCard] = useState(null)

  useEffect(() => {
    // apiGetAllFlashCards().then(allFlashCards => {
    //   setAllCards(allFlashCards)
    // })

    (async function getAllCards(){
      try{
        const backEndAllCards = await apiGetAllFlashCards()
        setAllCards(backEndAllCards)
        setLoading(false)
      } catch (error) {
        setError(error.message)
      }
      
    })() //invocando imediatamente

    //getAllCards()
  }, [])

  useEffect(() => {
    setStudyCards(allCards.map(card => ({...card, showTitle: true})))
  }, [allCards])

  function handleShuffle() {
    const shyffledCards = helperShuffleArray(studyCards)
    setStudyCards(shyffledCards)
  }

  function handleRadioShowTitleClick() {
    const updatedCards = [...studyCards].map(card => ({...card, showTitle:true}))
    setStudyCards(updatedCards)

    setRadioButtonShowTitle(true)
  }

  function handleRadioShowDescriptionClick() {
    const updatedCards = [...studyCards].map(card => ({...card, showTitle:false}))
    setStudyCards(updatedCards)

    setRadioButtonShowTitle(false)
  }
  //console.log(showTitle)
  function handleToggleFlashCard(cardId) {
    const updatedCards = [...studyCards]
    const cardIndex = updatedCards.findIndex(card => card.id === cardId)
    updatedCards[cardIndex].showTitle = !updatedCards[cardIndex].showTitle

    setStudyCards(updatedCards)
  }

  async function handleDeleteFlashCard(cardId) {
    try {
      //Back end
      await apiDeleteFlashCard(cardId)
      //Front End
      setAllCards(allCards.filter(card => card.id !== cardId))
      setError('')
    } catch (error) {
      setError(error.message)
    }

  }

  function handleEditFlashCard(card) {
    setCreateMode(false)
    setSelectedTab(1)
    setSelectedFlashCard(card)
  }

  function handleTabSelect(tabIndex) {
    setSelectedTab(tabIndex)
  }

  function handleNewFlashCard() {
    setCreateMode(true)
    setSelectedFlashCard(null)
  }

  async function handlePersist(title, description) {
    if(createMode) {
      try {
        //Back End
        const newFlashCard = await apiCreateFlashCard(title, description)
      
        //Front End
        setAllCards([...allCards, newFlashCard])
        setError('')
      } catch (error) {
        setError(error.message)
      }      
    } else {
      try {
        //Back End
        await apiUpdateFlashCard(selectedFlashCard.id, title, description)

        //Front End
        setAllCards(
          allCards.map(card =>{
            if (card.id === selectedFlashCard.id) {
              return {...card, title, description}
            }
            return card
          })
        )
        setSelectedFlashCard(null)
        setCreateMode(true)
        setError('')
      } catch (error) {
        setError(error.message)
      }
    }
  }

  let mainJsx = (
    <div className="flex justify-center my-4">
        <Loading />
      </div>
  )
  
  if (error) {
    mainJsx = <Error>{error}</Error>
  }

  if (!loading && !error) {
    mainJsx = (
    <>
      <Tabs selectedIndex={selectedTab} onSelect={handleTabSelect}>
          <TabList>
            <Tab>Listagem</Tab>
            <Tab>Cadastro</Tab>
            <Tab>Estudo</Tab>
          </TabList>

          <TabPanel>
            {allCards.map(flashCard=> {
              return <FlashCardItem 
                key={flashCard.id} 
                onDelete={handleDeleteFlashCard}
                onEdit={handleEditFlashCard}
                >
                  {flashCard}</FlashCardItem>
            })}
          </TabPanel>

          <TabPanel>
            <div className="my-4">
              <Button onButtonClick={handleNewFlashCard}>Novo flash card</Button>
            </div>            
            <h2><FlashCardForm createMode={createMode} onPersist={handlePersist}>{selectedFlashCard}</FlashCardForm></h2>
          </TabPanel>

          <TabPanel>
              <div className="text-center mb-4">
                <Button onButtonClick = {handleShuffle}>Embaralhar cards</Button>
              </div>

              <div className="flex flex-row items-center justify-center space-x-4 m-4">
                <RadioButton 
                id='radioButtonShowTitle' 
                name='showInfo' 
                buttonChecked={radioButtonShowTitle}
                onButtonClick={handleRadioShowTitleClick}
                >
                  Mostrar Titulo
                </RadioButton>
                <RadioButton 
                  id='radioButtonShowDescription' 
                  name='showInfo' 
                  buttonChecked={!radioButtonShowTitle}
                  onButtonClick={handleRadioShowDescriptionClick}
                >
                  Mostrar Descrição
                </RadioButton>
              </div>

            <FlashCards>
              {
                studyCards.map(({id, title, description, showTitle}) => {
                  return( 
                    <FlashCard
                    key={id}
                    id={id} 
                    title={title} 
                    description={description} 
                    showFlashCardTitle={showTitle}
                    onToggleFlashCard={handleToggleFlashCard}
                    />
                  )
                })
              }
            </FlashCards>
          </TabPanel>
        </Tabs>
    </>
    )
  }

  return (
    <>
      <Header>React-Flash-Cards-V2</Header>     

      <Main>{mainJsx}</Main>
    </>
  )
}
