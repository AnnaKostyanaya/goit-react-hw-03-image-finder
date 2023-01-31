import { Component } from 'react';
import { ImageGalleryEl, ImageGalleryItemImage } from './ImageGalleryItem.styled';
import { Modal } from "../Modal/Modal";
import PropTypes from 'prop-types';


export default class ImageGalleryItem extends Component {

static propTypes = {
    id: PropTypes.number.isRequired,
    src: PropTypes.string.isRequired,
    largeSrc: PropTypes.string.isRequired,
};

state = {
    showModal: false,
};


toggleModal = () => {
    this.setState(({ showModal }) => ({
    showModal: !showModal,
}));
};

render() { 
    const { id, src, largeSrc } = this.props;
    return (
        <>
            <ImageGalleryEl key={id}>
                <ImageGalleryItemImage src={src} alt="foto" onClick={this.toggleModal} />
            </ImageGalleryEl>
            {this.state.showModal && (
                <Modal src={largeSrc} onClose={this.toggleModal}>
                    <img src={largeSrc} alt="foto" />
                </Modal>
            )}
        </>
    )
    }
}
