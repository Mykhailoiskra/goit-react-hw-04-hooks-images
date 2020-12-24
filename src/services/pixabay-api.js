function fetchPictures(query, page) {
  const BASE_URL = "https://pixabay.com/api/";
  const API_KEY = "19028300-83b376d79bd6a99c9e2183deb";
  return fetch(
    `${BASE_URL}?image_type=photo&orientation=horizontal&q=${query}&page=${page}&per_page=12&key=${API_KEY}`
  ).then((res) => {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(new Error("Something is wrong, please try again"));
  });
}

const API = {
  fetchPictures,
};

export default API;
