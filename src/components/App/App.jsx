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
    pageNumber: 1,
    pageTotal: "",
    status: "",
}

componentDidUpdate(prevProps, prevState) {

  const { pageNumber, searchWord } = this.state;
  const prevWord = prevState.searchWord;
  const nextWord = searchWord;
  const prevPage = prevState.pageNumber;
  const nextPage = pageNumber;
  
  if (prevWord !== nextWord) {
    this.setState({status: "LOADING"});
    const newImage = fetchImages(nextWord, pageNumber);
    newImage
      .then( data  => {
        if (data.total === 0) {
          this.setState({ status: "ERROR" })
        } else {
          const newData = data.hits.map(({ id, webformatURL, largeImageURL }) => ({ id, webformatURL, largeImageURL }));
          this.setState({
            images: newData, status: "OK", pageTotal: data.totalHits,
          });
        }
      })
      .catch(() => { this.setState({status: "ERROR"}) }) 
  }

  if (prevPage !== nextPage && prevWord === nextWord) {
    this.setState({status: "LOADING"});
    const newImage = fetchImages(nextWord, pageNumber);
    newImage
      .then( data  => {
        const newData = data.hits.map(({ id, webformatURL, largeImageURL }) => ({ id, webformatURL, largeImageURL }));
        this.setState(prevState => ({
          images: [...prevState.images, ...newData], status: "OK",
        }));
      })
      .catch(() => { this.setState({status: "ERROR"}) })
    }
}

shouldComponentUpdate(nextProps, nextState) {
  return nextState.searchWord !== this.state.searchWord ||
        nextState.pageNumber !== this.state.pageNumber ||
        nextState.images !== this.state.images;
}

formSubmitHandler = ({ keyWord }) => {
  const {searchWord} = this.state;
  if (searchWord !== keyWord) {
    this.setState({ searchWord: keyWord, pageNumber: 1, images: [] })
    } else {
        this.setState({ searchWord: keyWord })
    } 
}

handleIncrement = () => {
  this.setState(prevState => (
    { pageNumber: prevState.pageNumber + 1 }
  ));
}

lastPageDef = () => {
  const { pageTotal } = this.state;
  let lastPage = Number(pageTotal % 12);
  if (lastPage === 0) {
      return lastPage = Number(pageTotal / 12);
  } else {
      return lastPage = Number.parseInt(pageTotal / 12) + 1;
  }
}

render() {
  const { status, searchWord, images, pageNumber } = this.state;
  const lastPage = this.lastPageDef();

return (
  <Container>
    <Searchbar onSubmit={this.formSubmitHandler}
    />
    
    {status === "OK" && (
    <ImageGallery data={images} onClose={this.toggleModal}/>
    )}

    {status === "LOADING" && (
      <Loader />
    )}

    {status === "ERROR" && (
      <ErrorMessage>No images for keyword "{searchWord}"</ErrorMessage>
    )}

    {(status === "OK" && images.length > 11 && pageNumber !== lastPage) && (
      <Button text={"Load more"} type="button" onClick={this.handleIncrement} />
    )}
    {(pageNumber === lastPage) && (
      <ErrorMessage>You've reached the end of search results.</ErrorMessage>
    )}
  </Container>
  )
  }
}

