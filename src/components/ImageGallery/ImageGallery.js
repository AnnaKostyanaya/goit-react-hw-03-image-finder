import React from 'react';
import ImageGalleryItem from "../ImageGalleryItem/ImageGalleryItem";
import { ImageGalleryList } from './ImageGallery.styled';
import PropTypes from 'prop-types';


const ImageGallery = ({ data }) => (
        <ImageGalleryList>
            {data.map(({id, webformatURL, largeImageURL}) => (
                <ImageGalleryItem key={id} id={id} src={webformatURL} largeSrc={largeImageURL} />
            ))}
        </ImageGalleryList>

);

export default ImageGallery;


ImageGallery.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            webformatURL: PropTypes.string.isRequired,
            largeImageURL: PropTypes.string.isRequired,
    }).isRequired
    ).isRequired,
};