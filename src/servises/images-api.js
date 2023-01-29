function fetchImages(keyWord, page) {
    return fetch(`https://pixabay.com/api/?q=${keyWord}&page=${page}&key=31851558-820ac2f97dae79a9951146e00&image_type=photo&orientation=horizontal&per_page=12`).then(response => {
        if (response.ok) {
            return response.json();
        }
        return Promise.reject(new Error(`No images for keyword ${keyWord}`));
    });
}

export default fetchImages;