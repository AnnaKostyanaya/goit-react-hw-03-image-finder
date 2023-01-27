import { Component } from "react";
import Loader from "../Loader/Loader";
import Button from "../Button/Button";
import Searchbar from "../Searchbar/Searchbar";
import ImageGallery from "../ImageGallery/ImageGallery";
import { Container, ErrorMessage } from './App.styled';
import fetchImages from '../../servises/images-api';


export default class App extends Component {
  state = {
    images: [],
    searchWord: "",
    page: {
      pageNumber: "",
      pageTotal: "",
    },
    status: "",
}

componentDidUpdate(prevProps, prevState) {

  const { page, searchWord } = this.state;

  const prevWord = prevState.searchWord;
  const nextWord = searchWord;
  const prevPage = prevState.page.pageNumber;
  const nextPage = page.pageNumber;

  if (prevWord !== nextWord && !"") {
    this.setState({status: "LOADING"});
    const newImage = fetchImages(nextWord, page.pageNumber);
    newImage
      .then( data  => {
        if (data.total === 0) {
          this.setState({ status: "ERROR" })
        } else {
          // this.setState({ images: data.hits, status: "OK", page: {...prevState.page, pageNumber: 1, pageTotal: data.totalHits} });
          this.setState(prevState => ({
            images: data.hits, status: "OK", page: {...prevState.page, pageNumber: 1, pageTotal: data.totalHits}
          }));
        }
      })
      .catch(() => { this.setState({status: "ERROR"}) }) 
  }

  if (prevWord === nextWord && prevPage !== nextPage) {
    this.setState({status: "LOADING"});
    const newImage = fetchImages(nextWord, page.pageNumber);
    newImage
      .then( data  => {
        this.setState(prevState => ({
          images: [...prevState.images, ...data.hits], status: "OK",
        }));
      })
      .catch(() => { this.setState({status: "ERROR"}) })
    }
}

formSubmitHandler = ({ keyWord }) => {
  this.setState(prevState => {
    if (prevState.searchWord !== keyWord) {
      const newPage = {...this.state.page}
      newPage.pageNumber = 1
      return { page: newPage, searchWord: keyWord, images: [] }
    } else { return { searchWord: keyWord } }
  });
}

handleIncrement = () => {
  this.setState(prevState => {
  return {
    page: { ...prevState.page, pageNumber: prevState.page.pageNumber + 1 }
  };
});
}

lastPageDef = () => {
  const { page } = this.state;
  let lastPage = Number(page.pageTotal % 12);
  if (lastPage === 0) {
      return lastPage = Number(page.pageTotal / 12);
  } else {
      return lastPage = Number.parseInt(page.pageTotal / 12) + 1;
  }
}

render() {
  const { status, searchWord, images, page } = this.state;
  const lastPage = this.lastPageDef();

return (
  <Container>
    <Searchbar onSubmit={this.formSubmitHandler}
    />
    {status === "LOADING" && (
      <Loader />
    )}

    {status === "ERROR" && (
      <ErrorMessage>No images for keyword "{searchWord}"</ErrorMessage>
    )}
    
    <ImageGallery data={images} onClose={this.toggleModal}/>

    {(images.length > 11 && page.pageNumber !== lastPage) && (
      <Button text={"Load more"} type="button" onClick={this.handleIncrement} />
    )}
    {(page.pageNumber === lastPage) && (
      <ErrorMessage>You've reached the end of search results.</ErrorMessage>
    )}
  </Container>
  )
  }
}

