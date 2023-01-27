import { Component } from "react";
import Loader from "../Loader/Loader";
import Button from "../Button/Button";
import Searchbar from "../Searchbar/Searchbar";
import ImageGallery from "../ImageGallery/ImageGallery";
import { Container, ErrorMessage } from './App.styled';
import fetchImages from '../../servises/images-api';


class App extends Component {
  state = {
    images: [],
    searchWord: "",
    page: 1,
    status: "",
}

componentDidUpdate(prevProps, prevState) {

  const { page, searchWord } = this.state;

  const prevWord = prevState.searchWord;
  const nextWord = searchWord;
  const prevPage = prevState.page;
  const nextPage = page;

  if (prevWord !== nextWord && !"") {
    this.setState({status: "LOADING"});
    const newImage = fetchImages(nextWord, page);
    newImage
      .then( data  => {
        if (data.total === 0) {
          this.setState({ status: "ERROR" })
        } else {
          this.setState({ images: data.hits, status: "OK" });
        }
      })
      .catch(() => { this.setState({status: "ERROR"}) }) 
  }

  if (prevWord === nextWord && prevPage !== nextPage) {
    this.setState({status: "LOADING"});
    const newImage = fetchImages(nextWord, page);
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
      return { page: 1, searchWord: keyWord, images: [] }
    } else { return { searchWord: keyWord } }
  });
}

handleIncrement = () => {
  this.setState(prevState => {
  return { page: prevState.page + 1 };
});
}

render() {
  const { status, searchWord, images } = this.state;
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

          {images.length > 11 && (
            <Button text={"Load more"} type="button" onClick={this.handleIncrement} />
          )}
        </Container>
        )
  }
}

export default App;
