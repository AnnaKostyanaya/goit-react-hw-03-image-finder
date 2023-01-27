import React from 'react';
import PropTypes from 'prop-types';
import { ButtonLoad } from './Button.styled';

const Button = ({ text, type, onClick }) => {
    return (
        <ButtonLoad
            type={type}
            onClick={onClick}
        >
            {text}
        </ButtonLoad>
    )
};

export default Button;

Button.propTypes = {
    text: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
};